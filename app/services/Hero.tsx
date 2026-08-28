"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Building2,
    Wrench,
    Settings,
    ClipboardCheck,
    Hammer,
    CloudRain,
    FenceIcon,
} from "lucide-react";

const services = [
    {
        title: "Property Maintenance & Preventative Care",
        icon: Building2,
    },
    {
        title: "Damage Mitigation & Protective Measures",
        icon: FenceIcon,
    },
    {
        title: "Property Claims & Resultant Damage Reinstatement",
        icon: CloudRain,
    },
    {
        title: "Maintenance Insurance Claims & Inspections",
        icon: ClipboardCheck,
    },
];

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* Background */}
            <div className="absolute inset-0">

                <Image
                    src="/services-hero.jpg"
                    alt=""
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/15 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/15" />

            </div>

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    min-h-screen
                    max-w-7xl
                    items-end
                    px-6
                    pt-55
                    pb-28
                    sm:px-10
                    lg:px-16
                "
            >

                <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">

                    {/* LEFT — INTRO */}
                    <div className="flex flex-col justify-end animate-fade-in">

                        <div className="max-w-md">

                            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#0CC0DF]">
                                Our Expertise
                            </p>

                            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Property management with a{" "}
                                <span className="text-[#0CC0DF]">
                                    difference.
                                </span>
                            </h2>

                            <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />

                            <p className="mt-6 text-sm leading-7 text-white/65 sm:text-base">
                                We manage properties with care, professionalism
                                and a long-term vision. Our approach combines
                                reliable service with practical solutions that
                                protect your property and your investment.
                            </p>

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
                                GET IN TOUCH

                                <span className="text-lg">
                                    →
                                </span>
                            </Link>

                        </div>

                    </div>

                    {/* RIGHT — SERVICES */}
                    <div
                        className="
                            flex
                            flex-col
                            justify-start
                            animate-fade-in-delayed
                        "
                    >

                        {/* Heading */}
                        <div>

                            <h1
                                className="
                                    max-w-5xl
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
                                WE ARE AT
                                <br />
                                <span className="text-white">
                                    YOUR SERVICE
                                    <span className="text-[#0CC0DF]">
                                        .
                                    </span>
                                </span>
                            </h1>

                        </div>

                        {/* Service list */}
                        <div className="mt-12 max-w-xl border-t border-white/20">

                            {services.map((service) => {
                                const Icon = service.icon;

                                return (
                                    <div
                                        key={service.title}
                                        className="
                                            group
                                            flex
                                            items-center
                                            border-b
                                            border-white/20
                                            py-5
                                            transition-all
                                            duration-300
                                            hover:border-[#0CC0DF]
                                            hover:bg-white/[0.03]
                                        "
                                    >

                                        <div className="flex items-center gap-5">

                                            {/* Icon */}
                                            <Icon
                                                size={21}
                                                strokeWidth={1.7}
                                                className="
                                                    text-[#0CC0DF]
                                                    transition-transform
                                                    duration-300
                                                    group-hover:scale-110
                                                "
                                            />

                                            {/* Service */}
                                            <span className="text-sm font-medium uppercase tracking-wide sm:text-base">
                                                {service.title}
                                            </span>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom indicator */}
            <div
                className="
                    absolute
                    bottom-8
                    left-1/2
                    z-20
                    w-[calc(100%-3rem)]
                    max-w-7xl
                    -translate-x-1/2
                    border-t
                    border-[#0CC0DF]
                    pt-4
                "
            />

        </section>
    );
}