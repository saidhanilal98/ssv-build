import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "./_components/Global/Header";
import Footer from "./_components/Global/Footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSV Property Group",
  description: "SSV Rebuild",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <Header />

        {children}

        <Footer />


      </body>
    </html>
  );
}
