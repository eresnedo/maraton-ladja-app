import { supabase } from "@/lib/supabase";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[čć]/g, "c").replace(/đ/g, "d").replace(/š/g, "s").replace(/ž/g, "z")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

/** Smanji sliku u pregledniku (najdulja stranica max px) i vrati JPEG. */
export async function resize(file: File, max = 2000, quality = 0.85): Promise<{ blob: Blob; width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * k);
  const height = Math.round(bmp.height * k);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  bmp.close();
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Slika se ne može obraditi."))), "image/jpeg", quality));
  return { blob, width, height };
}

/** Učitaj sliku u spremište 'media' i vrati javni URL. */
export async function uploadImage(file: File, folder: string, max = 2000) {
  const { blob, width, height } = await resize(file, max);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase!.storage.from("media").upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw error;
  const { data } = supabase!.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, width, height };
}

/** Obriši datoteku iz spremišta ako je URL iz našeg 'media' bucketa. */
export async function removeImage(url: string | null | undefined) {
  const m = url?.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (m) await supabase!.storage.from("media").remove([decodeURIComponent(m[1])]);
}
