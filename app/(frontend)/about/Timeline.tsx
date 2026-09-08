"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";

type TimelineProps = {
    heading: string;
    description: string;
    backgroundImage: { url: string; alt: string };
    events: { year: string; title: string; description: string }[];
};

export default function Timeline({ heading, description, backgroundImage, events }: TimelineProps) {
    return (
        <section className="relative overflow-hidden text-white">

            {/* Background Image */}
            <Image
                src={backgroundImage.url}
                alt={backgroundImage.alt}
                fill
                className="object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#062133]/50 to-black/50" />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-40
                    top-2/3
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-[#0CC0DF]/10
                    blur-[160px]
                "
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

                {/* Header */}
                <FadeIn>
                    <div className="mb-24 max-w-4xl">

                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#0CC0DF]">
                            Our Journey
                        </p>

                        <h1 className="text-5xl font-bold uppercase tracking-tight sm:text-6xl lg:text-8xl">
                            {heading}
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                            {description}
                        </p>

                    </div>
                </FadeIn>

                {/* Timeline */}
                <div className="relative">

                    {/* Central Line */}
                    <div className="absolute bottom-0 left-5 top-0 w-px bg-[#0CC0DF]/30 md:left-1/2 md:-translate-x-1/2" />

                    <div className="space-y-16 md:space-y-24">

                        {events.map((item, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <FadeIn key={item.year}>

                                    <div className="relative grid grid-cols-1 md:grid-cols-2">

                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 top-8 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-[#0CC0DF] shadow-[0_0_0_6px_rgba(12,192,223,0.08)] md:left-1/2">

                                            <div className="h-1.5 w-1.5 rounded-full bg-white" />

                                        </div>

                                        {/* Timeline Card */}
                                        <div
                                            className={`pl-12 md:pl-0 ${isLeft
                                                    ? "md:pr-20"
                                                    : "md:col-start-2 md:pl-20"
                                                }`}
                                        >

                                            <div
                                                className={`
                                                    border
                                                    border-[#0CC0DF]/50
                                                    bg-black/35
                                                    p-8
                                                    backdrop-blur-md
                                                    transition-all
                                                    duration-500
                                                    hover:border-[#0CC0DF]
                                                    hover:bg-black/50
                                                    hover:shadow-[0_0_40px_rgba(12,192,223,0.08)]
                                                    sm:p-10
                                                    ${!isLeft
                                                        ? "md:mt-16"
                                                        : ""
                                                    }
                                                `}
                                            >

                                                {/* Card Header */}
                                                <div className="mb-8 flex items-center justify-between">

                                                    <span className="text-3xl font-bold tracking-tight text-[#0CC0DF] sm:text-4xl">
                                                        {item.year}
                                                    </span>

                                                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>

                                                </div>

                                                <h2 className="mb-5 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                                                    {item.title}
                                                </h2>

                                                <p className="text-base leading-relaxed text-white/60">
                                                    {item.description}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </FadeIn>
                            );
                        })}

                    </div>
                </div>

                {/* Closing Statement */}
                <FadeIn>
                    <div className="mt-28 border-t border-[#0CC0DF] pt-10">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#0CC0DF]">
                                    Looking Ahead
                                </p>

                                <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                                    The journey continues.
                                </h2>

                            </div>

                            <p className="max-w-md text-sm leading-relaxed text-white sm:text-right">
                                Building upon generations of experience to
                                create a more sustainable, innovative and
                                prosperous future.
                            </p>

                        </div>

                    </div>
                </FadeIn>

            </div>
        </section>
    );
}
