import { NextResponse } from "next/server";
import { abs, getHtml, strip } from "../shared";

// Popis albuma sa stare stranice maraton-ladja.hr/galerija (za jednokratni uvoz u adminu).
export async function GET() {
  try {
    const html = await getHtml("/galerija");
    const cols = html.split('class="sppb-column"').slice(1);
    const albums = cols
      .map((c) => {
        const img = c.match(/<img[^>]+class="sppb-img-responsive"[^>]+src="([^"]+)"/) || c.match(/<img[^>]+src="([^"]+)"[^>]+class="sppb-img-responsive"/);
        const title = c.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
        const desc = c.match(/class="sppb-addon-text"[^>]*>([\s\S]*?)<\/div>/);
        const btn = c.match(/<a href="(\/[^"#]+)"[^>]*class="sppb-btn/);
        if (!img || !title || !btn) return null;
        return { title: strip(title[1]), desc: desc ? strip(desc[1]) : "", cover: abs(img[1]), path: btn[1] };
      })
      .filter(Boolean);
    return NextResponse.json({ albums });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
