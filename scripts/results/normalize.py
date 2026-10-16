import json, re, os, collections, unicodedata
W = os.path.expanduser("~/work")
d = json.load(open(W + "/results_raw.json"))

PREFIX = r"^(ul|udl|su|svu|vk|kuu|uotv|šku|uonb|hpd|hkud|sportska udruga|sportsko veslačka udruga|udruga lađara|udruga|klub)\s+"
TOWNS = ["metković","komin","vid","slivno","krvavac","momići","ploče","podrujnica","mlinište","vlaka","rogotin","opuzen","desne",
         "bjelovar","zagreb","rijeka","korčula","žrnovo","otok korčula","matijevići","veliki prolog","ilok","vinkovci","sombor","srbija",
         "gabela","bih","italija","mostar","đakovo","pitomača","stablina","banja","šarengrad","kod iloka","šarengrad, kod iloka","slavonski brod","termoli","australia","australija","zagreb 3 i hpb sport"]
ALIAS = [
  (r"gospe? karmelsk\w*", "gospa karmelska"), (r"^žrnovski gali(j)?oti.*|^galijoti$", "žrnovski galijoti"),
  (r"^(čeljevo|udl čapljina|čapljina).*", "čeljevo čapljina"), (r"^čapljina$", "čeljevo čapljina"),
  (r"^(hšdo?|hrvatsko šumarsko društvo).*", "hšdo bjelovar šumari"),
  (r"^veterani (4|iv)\b.*", "veterani 4. gbr"), (r"^iv korpus.*", "veterani 4. gbr"),
  (r"^(hkud vladimir nazor.*|salašari.*)", "salašari somborski"),
  (r"^općin\w*( slivno)?$", "općina slivno"), (r"^lađari općine slivno", "općina slivno"),
  (r"^argo(nauti)?( bjelovar)?$", "argo bjelovar"), (r"^argo,? argonauti bjelovar$", "argo bjelovar"),
  (r"^argo[ -]?(2|ii)( bjelovar)?$", "argo bjelovar 2"), (r"^argo senatori$", "argo senatori"),
  (r"^primorsko.?goransk\w* županij\w*(?! žen)( ženska ekipa| žene)?", None),
  (r"^plavo srce.*", "plavo srce zagreb"), (r"^vinkovački lađari.*", "vinkovački lađari"),
  (r"^đakovački bećari.*", "đakovački bećari"), (r"^veslačka udruga dunavska čikla.*", "dunavska čikla ilok"),
  (r"^(spg fort opus|fort opus.?spg opuzen|spg opuzen)$", "spg fort opus opuzen"),
  (r"^(lađari opuzen|opuzen|za očuvanje neretvanske baštine)$", None),
  (r"^(prirodoslovno matematički fakultet|pmf).*", "pmf zagreb"), (r"^troja( juniori)?.*", None),
  (r"^široki brijeg.*matijevići.*", "široki brijeg i matijevići"), (r"^norin.*", "norin matijevići"),
  (r"^sv\.? ", "sveti "), (r"^marko markota.*|^rogotin marko markota$", "marko markota rogotin"),
  (r"^mollise.*|^comunita croata.*|^hrvatska zajednica mollise.*", "molise (italija)"),
  (r"^domagojevi gusari-?vid mladi$|^domagojevi gusari mladi$", "domagojevi gusari mladi"),
  (r"^studenti lađari.*|^lađara studenata$", "studenti lađari neretve"),
  (r"^plavi anđeli.*", "plavi anđeli ploče"), (r"^zvonimir kaleb.*", "zvonimir kaleb"),
  (r"^župa dusina.*", "župa dusina"), (r"^škrapa.*", "škrapa"), (r"^jerkovac-? juniori$", "jerkovac juniori"),
  (r"^lu mostar$|^mostar$", "lu mostar"), (r"^marsonia.*", "marsonia slavonski brod"),
  (r"^gusari cvjetno$", "gusari cvjetno"), (r"^mup.?policijska škola.*", "mup policijska škola"),
  (r"^vatrogasci dubrovnik.*", "vatrogasci dubrovnik-velika gorica"), (r"^peračko blato$", "peračko blato"),
]
def strip_acc(s): return s
def key(raw):
    s = raw.lower().replace("„", "").replace("“", "").replace("”", "").replace('"', "").replace("–", "-").replace("&", " i ")
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^diskv\.\s*", "", s)
    if re.match(r"^su\s+crni put", s): return "su crni put" + (" juniori" if "junior" in s else "")
    if "šumski" in s: return "hšdo bjelovar šumski"
    for _ in range(2): s = re.sub(PREFIX, "", s)
    s = re.sub(r"\(([^)]*)\)", lambda m: "" if any(t in m.group(1) for t in TOWNS) else m.group(0), s).strip()
    # sufiksi tipa ", Metković" / "- Komin" / " Metković"
    for _ in range(3):
        for t in sorted(TOWNS, key=len, reverse=True):
            s2 = re.sub(r"[\s,:-]+" + re.escape(t) + r"$", "", s).strip(" ,-")
            if s2 and s2 != s: s = s2
    mod = ""
    m = re.search(r"\s*[- ]\s*(juniori|mladi|pioniri.*|debitanti|moreno)$", s)
    if m: mod = " " + m.group(1); s = s[:m.start()].strip(" -")
    m = re.search(r"\s+(2|3|ii|i|a|b|1)$", s)
    if m and not s.endswith(" ii juniori"):
        mod = " " + {"ii": "2", "i": "1"}.get(m.group(1), m.group(1)) + mod; s = s[:m.start()]
    s = s.strip(" ,-")
    for pat, rep in ALIAS:
        if re.search(pat, s):
            s = re.sub(pat, rep, s) if rep else s
            break
    s = re.sub(r"^primorsko.?goransk\w* županij\w*", "primorsko-goranska županija", s)
    s = s.replace("gusari komin", "gusari").replace("gusari - komin", "gusari")
    if s == "gusari": s = "gusari komin"
    s = s.replace("primorsko-goranska županija ženska ekipa", "primorsko-goranska županija žene").replace("primorsko-goranska županija, žene", "primorsko-goranska županija žene")
    s = re.sub(r"^sveti ilija.*", "sveti ilija", s)
    s = re.sub(r"^crni put.*", "crni put", s) if not re.search(r"crni put \d", s) else s
    return re.sub(r"\s+", " ", (s + mod)).strip()

rows = [(e["edition"], r) for e in d for r in e["results"]]
groups = collections.defaultdict(list)
for ed, r in rows: groups[key(r["crew"])].append((ed, r["crew"]))
def display(variants):
    c = collections.Counter(v for _, v in variants)
    mixed = [v for v, _ in c.most_common() if not v.isupper()]
    best = (mixed or [c.most_common(1)[0][0]])[0]
    best = re.sub(r"^(UL|UDL)\s+", "", best).replace("„", "").replace("“", "")
    return best
NICE = {
 "gusari komin": "Gusari Komin", "rogotin": "Rogotin", "zagreb": "UL Zagreb", "stablina": "Stablina", "komin": "Komin",
 "donjani donji": "Donjani Donji (Slivno)", "crni put": "Crni put Metković", "su crni put": "SU Crni put Metković",
 "argo bjelovar": "SU Argo Bjelovar", "staševica": "Staševica", "baćina": "Baćina", "domagojevi gusari": "Domagojevi gusari Vid",
 "općina slivno": "UL Općina Slivno", "marko markota rogotin": "Marko Markota Rogotin", "sveti ilija": "Sveti Ilija Metković",
 "gospa karmelska": "Gospa Karmelska Krvavac", "jerkovac": "Jerkovac Metković", "škrapa": "Škrapa Momići",
 "žrnovski galijoti": "Žrnovski galijoti Korčula", "čeveljuša": "Čeveljuša", "opuzen": "Opuzen", "sisak": "UL Sisak",
 "veterani 4. gbr": "Veterani 4. gardijske brigade", "hšdo bjelovar šumari": "HŠDO Bjelovar Šumari",
 "salašari somborski": "Salašari Somborski (Sombor)", "torcida ploče": "Torcida Ploče", "južnjak": "Južnjak Ploče",
 "sveti roko": "Sveti Roko Podrujnica", "vidonje": "Vidonje Mlinište", "plina stablina": "Plina Stablina",
 "šarić struga": "Šarić Struga", "sveti ilija 2": "Sveti Ilija Metković 2", "općina slivno 2": "UL Općina Slivno 2", "krvavac": "Krvavac", "prud": "Prud", "peračko blato": "Peračko Blato",
}
clubs = {k: NICE.get(k, display(v)) for k, v in groups.items()}
json.dump({"clubs": clubs, "variants": {k: sorted(set(x for _, x in v)) for k, v in groups.items()}}, open(W + "/clubs.json", "w"), ensure_ascii=False, indent=1)
print(len(groups), "ekipa (iz", len(set(r["crew"] for _, r in rows)), "naziva)")
# medalje
med = collections.defaultdict(lambda: [0, 0, 0, 0])
for ed, r in rows:
    if r["place"] in (1, 2, 3) and r["status"] != "OOC":
        med[key(r["crew"])][r["place"] - 1] += 1
for ed, r in rows: med[key(r["crew"])][3] += 1
top = sorted(med.items(), key=lambda x: (-x[1][0], -x[1][1], -x[1][2]))[:14]
for k, v in top: print(f"{clubs[k][:32]:32} zlato {v[0]:2} srebro {v[1]:2} bronca {v[2]:2} nastupa {v[3]:2}")

def slug(k):
    t = unicodedata.normalize("NFKD", k.replace("đ", "dj").replace("Đ", "dj"))
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
web = {"editions": [], "clubs": {}, "results": []}
for k in groups: web["clubs"][slug(k)] = clubs[k]
for e in d:
    web["editions"].append({"n": e["edition"], "date": e["date"], "notes": e["notes"]})
    for r in e["results"]:
        web["results"].append({"e": e["edition"], "p": r["place"], "c": slug(key(r["crew"])), "n": r["crew"], "t": r["time"], "s": r["status"]})
json.dump(web, open(W + "/results_web.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("web json", len(json.dumps(web, ensure_ascii=False)) // 1024, "KB")
