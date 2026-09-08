import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "./_components/Global/Header";
import Footer from "./_components/Global/Footer";
import { getHeaderContent } from "../../lib/payload/content/header";
import { getFooterContent } from "../../lib/payload/content/footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSV Property Group",
  description: "SSV Rebuild",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [header, footer] = await Promise.all([getHeaderContent(), getFooterContent()]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <Header {...header} />

        {children}

        <Footer {...footer} />


      </body>
    </html>
  );
}
