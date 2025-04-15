import "./global.css";
import { Inter } from "next/font/google";
import NavbarWrapper from "@/app/components/core/Navbar/NavbarWrapper";
import type { Metadata } from "next";
import Footer from "./components/core/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdvoKey",
  description: "Connect with trusted legal professionals instantly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <NavbarWrapper />
        <main className="min-h-[calc(100vh-160px)] pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
