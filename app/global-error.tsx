"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "./(frontend)/globals.css";
import Header from "./(frontend)/_components/Global/Header";
import Footer from "./(frontend)/_components/Global/Footer";
import { headerDefaults, footerDefaults } from "../lib/payload/content/defaults";

export default function GlobalError({
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Header {...headerDefaults} />

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

                                {/* Small label */}
                                <p className="mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-[#0CC0DF]">
                                    Unexpected error
                                </p>

                                {/* Divider */}
                                <div className="mx-auto mt-14 flex max-w-xl items-center justify-center gap-5">

                                    <div className="h-px flex-1 bg-white/10" />

                                    <span className="h-2 w-2 rounded-full bg-[#0CC0DF]" />

                                    <div className="h-px flex-1 bg-white/10" />

                                </div>

                                {/* Message */}
                                <div className="mx-auto mt-10 max-w-lg">

                                    <h2 className="text-2xl font-semibold uppercase tracking-[-0.02em] sm:text-3xl">
                                        Something went wrong.
                                    </h2>

                                    <p className="mt-5 text-sm leading-7 text-white/50 sm:text-base">
                                        An unexpected error occurred. You can try again,
                                        or head back to the homepage.
                                    </p>

                                </div>

                                {/* Buttons */}
                                <div className="mt-10 flex flex-wrap justify-center gap-4">

                                    <button
                                        type="button"
                                        onClick={() => retry()}
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
                                        Try Again
                                    </button>

                                    <Link
                                        href="/"
                                        className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-4
                                    border
                                    border-white/20
                                    px-7
                                    py-4
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:border-[#0CC0DF]
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

                <Footer {...footerDefaults} />
            </body>
        </html>
    );
}
