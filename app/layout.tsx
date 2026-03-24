import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "Aura - 今日のあなたの色は、何色ですか。",
  description: "気分を一言入力するだけで、あなただけのオーラカードを生成します。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aura",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-dvh flex flex-col bg-[#0a0a0a] text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
