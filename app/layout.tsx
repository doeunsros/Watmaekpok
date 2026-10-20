import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "វត្តមែកពក | Wat Maek Pok",
  description: "គេហទំព័រព័ត៌មាន វប្បធម៌ និងសកម្មភាពព្រះពុទ្ធសាសនារបស់វត្តមែកពក។",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="km"><body>{children}</body></html>;
}