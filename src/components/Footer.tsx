import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-ink border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-20 pb-10">
        <div className="x-display" style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
          Vidimo se na rijeci.
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-3 border-t border-ink/12 pt-10">
          <div>
            <img src="/img/logo.png" alt="Udruga lađara Neretve" width={96} height={96} className="h-24 w-24 object-contain mb-5" />
            <p className="text-ink/60 text-sm max-w-xs leading-relaxed">
              Organizira Udruga lađara Neretve. Tradicija Neretve od 1998. godine.
            </p>
          </div>
          <div>
            <div className="font-700 text-sm mb-3">Kontakt</div>
            <ul className="space-y-2 text-ink/60 text-sm">
              <li>Udruga lađara Neretve, Ivana Gundulića 4, 20350 Metković</li>
              <li>
                <a href="mailto:udruga-ladjara@maraton-ladja.hr" className="hover:text-red transition-colors">
                  udruga-ladjara@maraton-ladja.hr
                </a>
              </li>
              <li>
                <a href="tel:+385913077756" className="hover:text-red transition-colors">
                  +385 91 307 7756
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-700 text-sm mb-3">Prati nas</div>
            <ul className="space-y-2 text-ink/60 text-sm">
              <li>
                <a href="https://www.facebook.com/maraton.ladja" className="hover:text-red transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/maratonlada/" className="hover:text-red transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCHXQoo10tUMeSctWJtm70gQ" className="hover:text-red transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-2 text-xs text-ink/40">
          <span>© {new Date().getFullYear()} Udruga lađara Neretve</span>
          <span>maraton-ladja.hr</span>
        </div>
      </div>
    </footer>
  );
}
