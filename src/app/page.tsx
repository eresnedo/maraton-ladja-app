import HomeClient from "./HomeClient";
import { getNews } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  return <HomeClient news={await getNews(3)} />;
}
