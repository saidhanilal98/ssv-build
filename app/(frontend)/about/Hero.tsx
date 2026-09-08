"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "./FadeIn";

type HeroProps = {
    heading: string;
    subheading: string;
    paragraphs: string[];
    ctaLabel: string;
    backgroundImage: { url: string; alt: string };
    philosophyItems: { title: string; description: string }[];
};

export default function Hero({ heading, subheading, paragraphs, ctaLabel, backgroundImage, philosophyItems }: HeroProps) {
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
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />


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
                <div className="w-full">

                    {/* Main grid */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-16
                            lg:grid-cols-[1.4fr_0.6fr]
                            lg:gap-20
                        "
                    >

                        {/* LEFT SIDE */}
                        <div>

                            {/* Heading */}
                            <FadeIn className="max-w-4xl">

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
                                    {heading}
                                </h1>

                            </FadeIn>

                            {/* Main content */}
                            <FadeIn
                                className="
                                    mt-12
                                    max-w-3xl
                                "
                            >

                                {/* Statement */}
                                <h2
                                    className="
                                        max-w-2xl
                                        text-2xl
                                        font-semibold
                                        leading-tight
                                        sm:text-3xl
                                        lg:text-4xl
                                    "
                                >
                                    {subheading}
                                </h2>

                                {/* Divider */}
                                <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />

                                {/* Description */}
                                <div className="mt-6 max-w-2xl">

                                    {paragraphs.map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="mt-6 text-sm leading-7 text-white sm:text-base first:mt-0"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}

                                    {/* CTA */}
                                    <Link
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

                                        <span className="text-lg transition-transform duration-300">
                                            →
                                        </span>
                                    </Link>

                                </div>

                            </FadeIn>

                        </div>

                        {/* RIGHT SIDE */}
                        <div
                            className="
                                mt-10
                                flex
                                items-center
                                lg:mt-32
                            "
                        >

                            <FadeIn
                                className="
                                    w-full
                                    border-l
                                    border-[#0CC0DF]/60
                                    pl-7
                                "
                            >

                                {/* Header */}
                                <div className="mb-8">

                                    <h3
                                        className="
                                            mt-3
                                            text-2xl
                                            font-semibold
                                            uppercase
                                            tracking-tight
                                            sm:text-3xl
                                        "
                                    >
                                        Our
                                        <br />
                                        <span className="text-[#0CC0DF]">
                                            Philosophy
                                        </span>
                                    </h3>

                                </div>

                                {philosophyItems.map((item, index) => (
                                    <div
                                        key={item.title}
                                        className={`border-t border-white/20 py-6 ${index === philosophyItems.length - 1 ? "border-b" : ""}`}
                                    >

                                        <div className="flex items-start gap-5">

                                            <span className="text-sm font-medium text-[#0CC0DF]">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <div>
                                                <h4 className="text-lg font-semibold uppercase tracking-wide">
                                                    {item.title}
                                                </h4>

                                                <p className="mt-2 text-sm leading-6 text-white/60">
                                                    {item.description}
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </FadeIn>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
