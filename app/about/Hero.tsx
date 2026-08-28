"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* Background */}
            <Image
                src="/about-hero.jpg"
                alt=""
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
                            <div className="max-w-4xl animate-fade-in">

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
                                    THE SSV
                                    <br />
                                    <span className="text-white/90">
                                        DIFFERENCE
                                        <span className="text-[#0CC0DF]">
                                            .
                                        </span>
                                    </span>
                                </h1>

                            </div>

                            {/* Main content */}
                            <div
                                className="
                                    mt-12
                                    max-w-3xl
                                    animate-fade-in-delayed
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
                                    Property solutions built on{" "}
                                    <span className="text-[#0CC0DF]">
                                        trust, quality and vision.
                                    </span>
                                </h2>

                                {/* Divider */}
                                <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />

                                {/* Description */}
                                <div className="mt-6 max-w-2xl">

                                    <p className="text-sm leading-7 text-white sm:text-base">
                                        At SSV Property Group Ltd, we do not just
                                        manage and maintain properties, we build
                                        relationships and protect investments.
                                        Founded as a family business, our core
                                        philosophy is simple: treat every property
                                        as if it were our own and every client as
                                        part of our family. Our story began not in
                                        a large corporate boardroom, but within
                                        our own community.
                                    </p>

                                    <p className="mt-6 text-sm leading-7 text-white sm:text-base">
                                        We saw a need for property services that
                                        combined professional expertise with a
                                        personal touch where your call is answered
                                        by a person who knows your name and your
                                        property’s history. That vision became the
                                        foundation of SSV Property Group.
                                    </p>

                                    <p className="mt-6 text-sm leading-7 text-white sm:text-base">
                                        Today, we remain a family-owned and operated
                                        business. This means the values we started
                                        with are the values we operate by every day:
                                        integrity, reliability, and a relentless
                                        commitment to quality. For us, it’s not just
                                        about completing a job, it’s about building
                                        a legacy of trust, one satisfied client at
                                        a time.
                                    </p>

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
                                        JOIN THE DIFFERENCE

                                        <span className="text-lg transition-transform duration-300">
                                            →
                                        </span>
                                    </Link>

                                </div>

                            </div>

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

                            <div
                                className="
                                    w-full
                                    border-l
                                    border-[#0CC0DF]/60
                                    pl-7
                                    animate-fade-in-delayed
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

                                {/* Sustainable */}
                                <div className="border-t border-white/20 py-6">

                                    <div className="flex items-start gap-5">

                                        <span className="text-sm font-medium text-[#0CC0DF]">
                                            01
                                        </span>

                                        <div>
                                            <h4 className="text-lg font-semibold uppercase tracking-wide">
                                                Sustainable
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-white/60">
                                                We focus on long-term solutions that
                                                protect property value and create
                                                lasting benefits for our clients.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Solutions */}
                                <div className="border-t border-white/20 py-6">

                                    <div className="flex items-start gap-5">

                                        <span className="text-sm font-medium text-[#0CC0DF]">
                                            02
                                        </span>

                                        <div>
                                            <h4 className="text-lg font-semibold uppercase tracking-wide">
                                                Solutions
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-white/60">
                                                Every property is different. We provide
                                                practical, professional solutions built
                                                around your needs.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Visionary */}
                                <div className="border-t border-white/20 py-6">

                                    <div className="flex items-start gap-5">

                                        <span className="text-sm font-medium text-[#0CC0DF]">
                                            03
                                        </span>

                                        <div>
                                            <h4 className="text-lg font-semibold uppercase tracking-wide">
                                                Visionary
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-white/60">
                                                We look beyond today, combining experience
                                                and forward-thinking ideas to shape better
                                                outcomes.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Values */}
                                <div className="border-y border-white/20 py-6">

                                    <div className="flex items-start gap-5">

                                        <span className="text-sm font-medium text-[#0CC0DF]">
                                            04
                                        </span>

                                        <div>
                                            <h4 className="text-lg font-semibold uppercase tracking-wide">
                                                Values
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-white/60">
                                                Integrity, reliability, care and quality
                                                guide every decision we make and every
                                                relationship we build.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            
        </section>
    );
}