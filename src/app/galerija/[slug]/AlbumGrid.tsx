"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/content";

export default function AlbumGrid({ photos, title }: { photos: Photo[]; title: string }) {
  const [i, setI] = useState<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v === null ? v : (v + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [i, go]);

  const p = i === null ? null : photos[i];
  return (
    <>
      <div className="g-photos">
        {photos.map((ph, k) => (
          <button key={ph.url} type="button" onClick={() => setI(k)} aria-label={`Otvori fotografiju ${k + 1}`}>
            <img src={ph.url} alt={ph.caption || `${title}, fotografija ${k + 1}`} loading="lazy" width={ph.width ?? undefined} height={ph.height ?? undefined} />
          </button>
        ))}
      </div>
      {p && (
        <div className="g-lb" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setI(null)}>
          <span className="g-n">{(i ?? 0) + 1} / {photos.length}</span>
          <figure>
            <img src={p.url} alt={p.caption || title} />
            {p.caption && <figcaption>{p.caption}</figcaption>}
          </figure>
          <button className="g-x" type="button" onClick={() => setI(null)}>Zatvori ✕</button>
          {photos.length > 1 && (
            <>
              <button className="g-prev" type="button" onClick={() => go(-1)} aria-label="Prethodna">‹</button>
              <button className="g-next" type="button" onClick={() => go(1)} aria-label="Sljedeća">›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
