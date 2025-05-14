import "./global.css";

import NavbarWrapper from "@/app/components/core/Navbar/NavbarWrapper";
import type { Metadata } from "next";
import FooterWrap from "./components/core/Footer/footer_wrap";


export const metadata: Metadata = {
  title: "AdvoKey",
  description: "Connect with trusted legal professionals instantly",
  icons:"/Advokey.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` bg-gray-900`} >
        <NavbarWrapper />
        <main className="min-h-[calc(100vh-160px)] pt-18">{children}</main>
        <FooterWrap />
      </body>
    </html>
  );
}
