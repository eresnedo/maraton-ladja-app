import re, json, os, glob, sys
TXT = os.path.expanduser("~/txt")
TIME_RE = re.compile(r"^(\d{1,2})\s*[:.]\s*(\d{1,2})(?:\s*[:,']\s*(\d{1,2}))?(?:\s*[:,]\s*(\d{1,2}))?'?$")
def parse_time(s):
    s = s.strip().replace("’", "'")
    if not s or s in ("---", "-"): return None, None
    low = s.lower()
    if "diskval" in low: return None, "DSQ"
    if "odustal" in low or "nije zavr" in low: return None, "DNF"
    g = re.findall(r"\d+", s)
    if not re.match(r"^\s*\d", s) or len(g) < 2 or int(g[0]) > 4 or int(g[1]) > 59: return None, "?"+s
    h, mi = g[0], g[1]
    se = g[2] if len(g) > 2 else None
    cs = g[3] if len(g) > 3 else None
    sec = int(h)*3600 + int(mi)*60 + (int(se) if se else 0) + (int(cs)/100 if cs else 0)
    return round(sec, 2), None
out = []
for path in sorted(glob.glob(TXT+"/*.txt")):
    raw = open(path, encoding="utf-8").read().splitlines()
    head = next(l.strip() for l in raw if l.strip())
    num = int(re.search(r"(\d{1,2})\s*\.?\s*-?\s*MARATON", head.upper()).group(1)) if re.search(r"(\d{1,2})\s*\.?\s*-?\s*MARATON", head.upper()) else int(re.match(r".*?(\d+)", os.path.basename(path)).group(1))
    dm = re.search(r"(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})", head)
    date = f"{dm.group(3)}-{int(dm.group(2)):02d}-{int(dm.group(1)):02d}" if dm else None
    rows, notes = [], []
    started = False
    nonblank = [l for l in raw if l.strip()]
    used = set()
    for li, l in enumerate(nonblank):
        if li in used: continue
        if not l.strip(): continue
        cols = [c.strip() for c in re.split(r"\s{2,}", l.strip()) if c.strip()]
        # "3. *" (dijeljeno mjesto sa zvjezdicom) i "2. - 3." (dijeljeno mjesto)
        tie = None
        mt = re.match(r"^(\d{1,2})\.\s*-\s*\d{1,2}\.\s*(.*)$", cols[0])
        if mt:
            tie = True
            cols = [mt.group(1) + "."] + ([mt.group(2)] if mt.group(2) else []) + cols[1:]
        cols[0] = re.sub(r"^(\d{1,2}\.)\s*\*$", r"\1", cols[0])
        mm0 = re.match(r"^(\d{1,2})\.\s+(\D.*)$", cols[0])
        if mm0: cols = [mm0.group(1) + ".", mm0.group(2)] + cols[1:]
        first = cols[0]
        pm = re.match(r"^(\d{1,2})\.?$", first)
        if pm or first.upper().startswith("VAN KONK"):
            started = True
            place = int(pm.group(1)) if pm else None
            if place == 1 and any((x["place"] or 0) >= 3 for x in rows):
                rows = []  # nova (konačna) tablica u istom dokumentu: vrijedi zadnja
            name = cols[1] if len(cols) > 1 else ""
            tcol = cols[2] if len(cols) > 2 else ""
            # ime i vrijeme slijepljeni u jednu kolonu
            if not tcol:
                mm = re.match(r"^(.*?)\s+((?:\d{1,2}\s*[:.]\s*\d{1,2}.*)|---|diskvalificirani)$", name)
                if mm: name, tcol = mm.group(1), mm.group(2)
            if re.match(r"^\d{1,2}\s*:\s*\d{2}", name) and not tcol:
                tcol = name
                above = nonblank[li-1].strip() if li > 0 else ""
                below = nonblank[li+1].strip() if li + 1 < len(nonblank) else ""
                name = (above + " " + below).strip()
                used.add(li + 1)
                if notes and notes[-1] == above: notes.pop()
                elif rows and rows[-1]["crew"].endswith(above): rows[-1]["crew"] = rows[-1]["crew"][: -len(above)].strip()
            t, status = parse_time(tcol)
            if status and status.startswith("?"): status = None  # bilješka u stupcu vremena
            st = status or ("OOC" if place is None and first.upper().startswith("VAN") else None)
            names = [name]
            if tie:
                names = [n.strip() for n in re.split(r"\s+i\s+|\s+-\s+(?=[A-ZČĆŠŽĐ])", name) if n.strip()]
            for nm in names:
                rows.append({"place": place, "crew": nm.replace("Stabilna", "Stablina"), "time": t, "status": st})
        elif started and len(cols) >= 2 and cols[-1] == "---":
            rows.append({"place": None, "crew": cols[0], "time": None, "status": None})
        elif started and len(cols) == 1 and rows and not re.search(r"[.!]$|Napomena|Nastupil|veslali|^\(", first) and len(first) < 60 and first.isupper() == rows[-1]["crew"].isupper() and not rows[-1]["crew"].endswith(")"):
            if rows[-1]["crew"].endswith(","):
                rows[-1]["crew"] += " " + first
            else:
                notes.append(l.strip())
        elif started:
            notes.append(l.strip())
    out.append({"edition": num, "date": date, "file": os.path.basename(path), "results": rows, "notes": " ".join(notes)[:1500]})
out.sort(key=lambda e: e["edition"])
json.dump(out, open(os.path.expanduser("~/work/results_raw.json"), "w"), ensure_ascii=False, indent=1)
for e in out:
    r = e["results"]; timed = sum(1 for x in r if x["time"])
    print(e["edition"], e["date"], "crews", len(r), "timed", timed, "dsq", sum(1 for x in r if x["status"]=="DSQ"), "| 1st:", next((x["crew"] for x in r if x["place"]==1), "-"))
