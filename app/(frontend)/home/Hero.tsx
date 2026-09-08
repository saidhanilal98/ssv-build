"use client";

import Image from "next/image";

type HeroProps = {
    headingLine1: string;
    headingLine2Highlighted: string;
    subheading: string;
    paragraphs: string[];
    ctaLabel: string;
    backgroundImage: { url: string; alt: string };
};

export default function Hero({
    headingLine1,
    headingLine2Highlighted,
    subheading,
    paragraphs,
    ctaLabel,
    backgroundImage,
}: HeroProps) {
    return (
        <section className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* Background */}
            <Image
                src={backgroundImage.url}
                alt={backgroundImage.alt}
                fill
                priority
                className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

            {/* Cyan glow */}
            <div
                className="
                      pointer-events-none
                      absolute
                      -left-40
                      top-1/3
                      h-96
                      w-96
                      rounded-full
                      bg-[#0CC0DF]/10
                      blur-[140px]
                    "
            />

            {/* Hero content */}
            <div
                className="
                      relative
                      z-10
                      mx-auto
                      flex
                      min-h-screen
                      max-w-7xl
                      items-start
                      px-6
                      pt-55
                      pb-28
                      lg:px-8
                    "
            >
                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        items-start
                        gap-14
                        lg:grid-cols-2
                        lg:gap-20
                      "
                >

                    {/* Left */}
                    <div className="max-w-4xl">
                        <h1
                            className="
                            text-[14vw]
                            font-bold
                            uppercase
                            leading-[0.82]
                            tracking-[-0.075em]
                            sm:text-[10vw]
                            lg:text-[7.5rem]
                            xl:text-[8rem]
                          "
                        >
                            {headingLine1}
                            <br />
                            <span className="text-[#0CC0DF]">
                                {headingLine2Highlighted}
                            </span>
                        </h1>
                    </div>

                    {/* Right */}
                    <div className="max-w-xl">
                        <h2
                            className="
                            max-w-lg
                            text-2xl
                            font-semibold
                            leading-tight
                            sm:text-3xl
                            lg:text-4xl
                          "
                        >
                            {subheading}
                        </h2>

                        <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />

                        {paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className="
                                mt-4
                                max-w-lg
                                text-sm
                                leading-7
                                text-white
                                sm:text-base
                              "
                            >
                                {paragraph}
                            </p>
                        ))}

                        {/* CTA */}
                        <a
                            href="/contact"
                            className="
                            mt-8
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-[#0CC0DF]
                            px-7
                            py-4
                            text-sm
                            font-medium
                            uppercase
                            tracking-wide
                            text-black
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:text-black
                            hover:shadow-[0_0_30px_rgba(12,192,223,0.35)]
                          "
                        >
                            {ctaLabel}
                        </a>
                    </div>
                </div>
            </div>

        </section>
    );
}
