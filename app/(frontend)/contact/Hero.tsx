"use client";

import FadeIn from "./FadeIn";

type HeroProps = {
    eyebrow: string;
    headingLine1: string;
    headingLine2Highlighted: string;
    tagline: string;
};

export default function Hero({ eyebrow, headingLine1, headingLine2Highlighted, tagline }: HeroProps) {
    return (
        <section className="relative min-h-[720px] overflow-hidden bg-[#062133] text-white">

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
                    -right-32
                    top-1/2
                    h-[600px]
                    w-[600px]
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
                    -right-[180px]
                    top-[80px]
                    h-[650px]
                    w-[650px]
                    rounded-full
                    border
                    border-[#0CC0DF]/10
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-[80px]
                    top-[180px]
                    h-[450px]
                    w-[450px]
                    rounded-full
                    border
                    border-white/[0.04]
                "
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

                {/* Main hero */}
                <div className="grid min-h-[610px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

                    {/* Left typography */}
                    <div className="relative z-10 py-20 text-center lg:col-span-7 lg:col-start-4 lg:py-28 lg:mt-16">

                        <FadeIn>
                            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.35em] text-[#0CC0DF]">
                                {eyebrow}
                            </p>

                            <h1
                                className="
                                text-[clamp(4rem,9vw,8rem)]
                                font-bold
                                uppercase
                                leading-[0.82]
                                tracking-[-0.06em]
                            "
                            >
                                {headingLine1}
                                <br />

                                <span className="text-[#0CC0DF]">
                                    {headingLine2Highlighted}
                                </span>
                            </h1>

                            {/* Accent line */}
                            <div className="mt-12 flex items-center justify-center gap-5">

                                <span className="text-xs uppercase tracking-[0.25em] text-white">
                                    {tagline}
                                </span>

                            </div>
                        </FadeIn>

                    </div>
                </div>

            </div>

        </section>
    );
}