import { NextResponse } from "next/server";
import { abs, getHtml } from "../shared";

// Fotografije jednog albuma sa stare stranice: /api/stari-web/album?path=/28-maraton-lada
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get("path") || "";
  if (!/^\/[a-z0-9-]+$/.test(path)) return NextResponse.json({ error: "Neispravna adresa." }, { status: 400 });
  try {
    const html = await getHtml(path);
    const urls = [...html.matchAll(/<a[^>]+href="([^"]+\.(?:jpe?g|png|webp))"/gi)].map((m) => abs(m[1])).filter((u) => u.includes("/images/"));
    return NextResponse.json({ photos: [...new Set(urls)] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
