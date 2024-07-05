import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainHeader } from "@/components/main-header";
import { Footer } from "@/components/footer";
import "./globals.css";
import { About } from "@/components/about";
import { Featured } from "@/components/featured";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-screen`}>
          <MainHeader />
          <>{children}</>
        </body>
    </html>
  );
}
