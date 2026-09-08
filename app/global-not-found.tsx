import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import "./(frontend)/globals.css";
import Header from "./(frontend)/_components/Global/Header";
import Footer from "./(frontend)/_components/Global/Footer";
import { getHeaderContent } from "../lib/payload/content/header";
import { getFooterContent } from "../lib/payload/content/footer";

export const metadata: Metadata = {
    title: "404 - Page Not Found",
    description: "The page you are looking for does not exist.",
};

export default async function GlobalNotFound() {
    const [header, footer] = await Promise.all([getHeaderContent(), getFooterContent()]);

    return (
        <html lang="en">
            <body className="antialiased">
                <Header {...header} />

                <main className="relative flex overflow-hidden bg-[#062133] pt-28 pb-12 text-white">

                    {/* Architectural grid */}
                    <div
                        className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.06]
                    [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
                    [background-size:80px_80px]
                "
                    />

                    {/* Cyan glow */}
                    <div
                        className="
                    pointer-events-none
                    absolute
                    -right-40
                    top-1/2
                    h-[700px]
                    w-[700px]
                    -translate-y-1/2
                    rounded-full
                    bg-[#0CC0DF]/10
                    blur-[180px]
                "
                    />

                    {/* Large decorative circle */}
                    <div
                        className="
                    pointer-events-none
                    absolute
                    -right-[220px]
                    top-1/2
                    h-[700px]
                    w-[700px]
                    -translate-y-1/2
                    rounded-full
                    border
                    border-[#0CC0DF]/10
                "
                    />

                    <div
                        className="
                    pointer-events-none
                    absolute
                    -right-[120px]
                    top-1/2
                    h-[500px]
                    w-[500px]
                    -translate-y-1/2
                    rounded-full
                    border
                    border-white/[0.04]
                "
                    />

                    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">

                        {/* Main */}
                        <div className="flex flex-1 items-center justify-center py-8 lg:mt-20">

                            <div className="relative w-full max-w-5xl text-center">

                                {/* 404 */}
                                <h1
                                    className="
                                text-[clamp(5rem,12vw,8rem)]
                                font-bold
                                uppercase
                                leading-[0.7]
                                tracking-[-0.09em]
                                text-white
                            "
                                >
                                    4<span className="text-[#0CC0DF]">0</span>4
                                </h1>

                                {/* Small label */}
                                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#0CC0DF]">
                                    Page not found
                                </p>

                                {/* Divider */}
                                <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-5">

                                    <div className="h-px flex-1 bg-white/10" />

                                    <span className="h-2 w-2 rounded-full bg-[#0CC0DF]" />

                                    <div className="h-px flex-1 bg-white/10" />

                                </div>

                                {/* Message */}
                                <div className="mx-auto mt-6 max-w-lg">

                                    <p className="mt-3 text-lg leading-7 text-white sm:text-base">
                                        The page you’re looking for doesn’t exist or may have moved.
                                    </p>

                                </div>

                                {/* Button */}
                                <div className="mt-6 flex justify-center">

                                    <Link
                                        href="/"
                                        className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-4
                                    border
                                    border-[#0CC0DF]
                                    bg-[#0CC0DF]
                                    px-7
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#062133]
                                    transition-all
                                    duration-300
                                    hover:bg-transparent
                                    hover:text-[#0CC0DF]
                                "
                                    >

                                        <ArrowLeft
                                            size={16}
                                            className="transition-transform duration-300 group-hover:-translate-x-1"
                                        />

                                        Back To Home

                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

                <Footer {...footer} />
            </body>
        </html>
    );
}
