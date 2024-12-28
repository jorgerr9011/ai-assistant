import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "AI app to assist in resolving incidents in an organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/*<div className={theme}></div>*/}
          <div className="grid gap-6">
            <Header />
            {children}
          </div>
          {/*<footer>
            <Footer />
          </footer>*/}
        </Providers>
      </body>
    </html>
  );
}
