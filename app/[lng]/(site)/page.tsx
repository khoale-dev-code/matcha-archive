import { HomePage as HomePageView } from "@/components/home/HomePage";

export const revalidate = 180;

export default function Page() {
  return <HomePageView />;
}