"use client";

import FadeIn from "./FadeIn";
import type { CertificationItem } from "../../../lib/payload/content/certifications";

type CertificationsProps = {
    heading: string;
    description: string;
    certifications: CertificationItem[];
};

export default function Certifications({ heading, description, certifications }: CertificationsProps) {
    return (
        <section className="relative overflow-hidden bg-[#062133] text-white">

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-40
                    bottom-0
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-[#0CC0DF]/10
                    blur-[140px]
                "
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

                {/* Header */}
                <FadeIn>
                    <div className="max-w-4xl">

                        <h1
                            className="
                                text-5xl
                                font-bold
                                uppercase
                                tracking-tight
                                sm:text-6xl
                                lg:text-8xl
                            "
                        >
                            {heading}{" "}
                            <span className="text-[#0CC0DF]">
                                .
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                            {description}
                        </p>

                    </div>
                </FadeIn>

                {/* Certifications */}
                <div className="mt-20 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">

                    {certifications.map((certificate, index) => (
                        <FadeIn key={certificate.title}>

                            <div
                                className="
                                    group
                                    flex
                                    h-full
                                    flex-col
                                    justify-between
                                    bg-[#062133]/95
                                    p-8
                                    transition-all
                                    duration-500
                                    hover:bg-[#0CC0DF]/10
                                    sm:p-10
                                "
                            >

                                {/* Number */}
                                <div className="flex items-start justify-between">

                                    <span className="text-sm font-medium text-[#0CC0DF]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                </div>

                                {/* Content */}
                                <div className="mt-12">

                                    <h2 className="max-w-md text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                                        {certificate.title}
                                    </h2>

                                    <div className="mt-5 h-px w-12 bg-[#0CC0DF]" />

                                    <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">
                                        {certificate.description}
                                    </p>

                                </div>

                                {/* Button */}
                                {certificate.documentUrl ? (
                                    <a
                                        href={certificate.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            mt-10
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-3
                                            border
                                            border-[#0CC0DF]
                                            px-6
                                            py-4
                                            text-sm
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-white
                                            transition-all
                                            duration-300
                                            hover:bg-[#0CC0DF]
                                            hover:text-black
                                        "
                                    >
                                        View Certificate

                                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </a>
                                ) : (
                                    <span
                                        className="
                                            mt-10
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-3
                                            border
                                            border-white/20
                                            px-6
                                            py-4
                                            text-sm
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-white/40
                                        "
                                    >
                                        Document Coming Soon
                                    </span>
                                )}

                            </div>

                        </FadeIn>
                    ))}

                </div>

                {/* Bottom statement */}
                <FadeIn>
                    <div className="mt-20 border-t border-[#0CC0DF] pt-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <p className="max-w-xl text-sm leading-relaxed text-white sm:text-right">
                                Professional standards. Responsible practices.
                                A commitment to quality.
                            </p>

                        </div>

                    </div>
                </FadeIn>

            </div>
        </section>
    );
}
