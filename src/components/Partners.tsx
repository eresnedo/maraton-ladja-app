import partners from "@/data/partners.json";

type P = { slug: string; name: string; href: string; group: string; w: number; h: number };
const ALL = partners as P[];

// optičko ujednačavanje: svaki logo dobije približno istu površinu, uz gornju granicu visine
const AREA = { xl: [30000, 92], l: [8200, 62], m: [5600, 54] } as const;
function logoHeight(p: P, size: keyof typeof AREA) {
  const [area, cap] = AREA[size];
  return Math.round(Math.min(cap, Math.sqrt(area / (p.w / p.h))));
}

const GROUPS: { key: string; title: string; size: "xl" | "l" | "m" }[] = [
  { key: "generalni", title: "Generalni sponzor", size: "xl" },
  { key: "partneri", title: "Partneri", size: "l" },
  { key: "sponzori", title: "Sponzori", size: "m" },
  { key: "medijski", title: "Medijski pokrovitelji", size: "m" },
];

export default function Partners() {
  return (
    <section className="h-sec h-partners" aria-labelledby="partneri-naslov">
      <div className="x-wrap">
        <div className="h-head">
          <div>
            <p className="h-label">Uz podršku</p>
            <h2 className="h-h2" id="partneri-naslov">Partneri i sponzori</h2>
          </div>
        </div>
        {GROUPS.map((g) => {
          const items = ALL.filter((p) => p.group === g.key);
          if (!items.length) return null;
          return (
            <div key={g.key} className={`p-group p-${g.size}`}>
              <h3>{g.title}</h3>
              <ul>
                {items.map((p) => (
                  <li key={p.slug}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" title={p.name}>
                      <img
                        src={`/partneri/${p.slug}.png`}
                        alt={p.name}
                        width={p.w}
                        height={p.h}
                        loading="lazy"
                        style={{ height: logoHeight(p, g.size), width: "auto" }}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
