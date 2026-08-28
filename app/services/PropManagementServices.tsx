"use client";

import { useState } from "react";
import FadeIn from "./FadeIn";

const services = [
    {
        number: "01",
        title: "Property Maintenance & Preventative Care",
        short: "Planned and reactive maintenance to keep properties safe, functional, and well maintained.",
        description:
            "Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the risk of damage and deterioration. We offer planned and reactive property maintenance services to help keep buildings in good condition, address issues early, and reduce the likelihood of preventable problems escalating.",
        features: [
            "General property repairs and upkeep.",
            "Identification and rectification of minor defects.",
            "Preventative works to reduce water ingress and deterioration.",
            "Ongoing maintenance support for landlords and property owners.",
            "Records of maintenance and repair works carried out.",
        ],
    },
    {
        number: "02",
        title: "Damage Mitigation & Protective Measures",
        short: "Prompt damage mitigation to limit further damage, protect your property, and reduce costly repairs.",
        description:
            "Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly to assess the situation and carry out practical measures to limit further damage and protect the property.",
        features: [
            "Making the property safe following an incident.",
            "Temporary isolation and protection works.",
            "Moisture control and drying measures.",
            "Removal of affected materials where necessary.",
            "Preventative actions to stop further deterioration.",
        ],
    },
    {
        number: "03",
        title: "Property Claims & Resultant Damage Reinstatement",
        short: "Professional damage assessment and reinstatement services to accurately identify, report, and restore property damage.",
        description:
            "We provide a professional damage assessment and reinstatement service. Our role is to support the claims process by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works. We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is properly identified and addressed.",
        features: [
            "Assessing and documenting resultant damage.",
            "Preparing detailed repair reports and scopes of works.",
            "Providing clear and transparent repair quotations.",
            "Liaising with appointed loss adjusters where required.",
            "Managing and completing reinstatement works.",
        ],
    },
    {
        number: "04",
        title: "Maintenance Insurance Claims & Inspections",
        short: "Property management focused on inspections, maintenance, safety, and keeping your property in excellent condition.",
        description:
            "We provide hands-on property management focused on maintenance, inspections, and ensuring your property remains safe, compliant, and well maintained at all times. Our services do not include rent collection or tenant financial management. We specialize in physical care of your property, managing inspections and overseeing maintenance works professionally.",
        features: [
            "We carry out regular property inspections, routine maintenance, and urgent repairs.",
            "Identifying issues early and resolving them quickly to protect your property and reduce long-term costs.",
            "We offer flexible monthly maintenance packages tailored to your property’s needs.",
            "Providing clear and transparent repair quotations.",
            "These include regular inspections, preventative maintenance, and prompt repairs, helping identify issues early, reduce unexpected costs, and protect your investment.",
        ],
    },
];

export default function Services() {
    const [activeService, setActiveService] = useState(0);

    const service = services[activeService];

    return (
        <section className="relative overflow-hidden bg-[#062133] text-white">

            {/* Background glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-40
                    top-1/4
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-[#0CC0DF]/10
                    blur-[160px]
                "
            />

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
                            PROPERTY{" "}
                            <span className="text-[#0CC0DF]">
                                MANAGEMENT SERVICES
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                            Professional property management solutions
                            designed to protect your investment, maintain
                            your property and deliver lasting value.
                        </p>

                    </div>
                </FadeIn>

                {/* Interactive Services */}
                <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">

                    {/* Service Navigation */}
                    <FadeIn>

                        <div className="border border-white/10">

                            {services.map((item, index) => {
                                const active = index === activeService;

                                return (
                                    <button
                                        key={item.number}
                                        type="button"
                                        onClick={() => setActiveService(index)}
                                        className={`
                                            group
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            border-b
                                            border-white/10
                                            p-6
                                            text-left
                                            transition-all
                                            duration-300
                                            last:border-b-0
                                            ${active
                                                ? "bg-[#0CC0DF] text-black"
                                                : "bg-black/10 text-white hover:bg-white/[0.05]"
                                            }
                                        `}
                                    >

                                        <div className="flex items-center gap-5">

                                            <span
                                                className={`
                                                    text-xs
                                                    font-semibold
                                                    ${active
                                                        ? "text-black/60"
                                                        : "text-[#0CC0DF]"
                                                    }
                                                `}
                                            >
                                                {item.number}
                                            </span>

                                            <div>

                                                <h2 className="text-base font-semibold uppercase tracking-wide sm:text-lg">
                                                    {item.title}
                                                </h2>

                                                <p
                                                    className={`
                                                        mt-1
                                                        text-xs
                                                        ${active
                                                            ? "text-black/60"
                                                            : "text-white/40"
                                                        }
                                                    `}
                                                >
                                                    {item.short}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className={`
                                                text-xl
                                                transition-transform
                                                duration-300
                                                ${active
                                                    ? "translate-x-1"
                                                    : "group-hover:translate-x-1"
                                                }
                                            `}
                                        >
                                            →
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </FadeIn>

                    {/* Active Service */}
                    <FadeIn key={activeService}>

                        <div
                            className="
                                relative
                                flex
                                min-h-[500px]
                                flex-col
                                justify-between
                                overflow-hidden
                                border
                                border-[#0CC0DF]/40
                                bg-black/20
                                p-8
                                backdrop-blur-sm
                                sm:p-12
                            "
                        >

                            {/* Decorative number */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-5
                                    -top-10
                                    text-[12rem]
                                    font-bold
                                    leading-none
                                    text-white/[0.025]
                                "
                            >
                                {service.number}
                            </div>

                            {/* Top */}
                            <div className="relative z-10">

                                <div className="flex items-center gap-3">

                                    <span className="h-px w-10 bg-[#0CC0DF]" />

                                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0CC0DF]">
                                        Service {service.number}
                                    </span>

                                </div>

                                <h2
                                    className="
                                        mt-8
                                        max-w-2xl
                                        text-4xl
                                        font-bold
                                        uppercase
                                        tracking-tight
                                        sm:text-5xl
                                        lg:text-6xl
                                    "
                                >
                                    {service.title}
                                    <span className="text-[#0CC0DF]">.</span>
                                </h2>

                                <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                                    {service.description}
                                </p>

                            </div>

                            {/* Features */}
                            <div className="relative z-10 mt-12">

                                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                                    What We Provide
                                </p>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    {service.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                border
                                                border-white/10
                                                bg-white/[0.03]
                                                px-4
                                                py-4
                                                transition-colors
                                                duration-300
                                                hover:border-[#0CC0DF]/50
                                            "
                                        >

                                            <span className="text-[#0CC0DF]">
                                                →
                                            </span>

                                            <span className="text-sm text-white/75">
                                                {feature}
                                            </span>

                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>

                    </FadeIn>

                </div>

                {/* Bottom CTA */}
                <FadeIn>

                    <div className="mt-20 border-t border-white pt-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#0CC0DF]">
                                    In Need of Property Support?
                                </p>

                                <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                                    Let us manage your property.
                                </h2>

                            </div>

                            <a
                                href="/contact"
                                className="
                                    inline-flex
                                    w-fit
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
                                    hover:shadow-[0_0_30px_rgba(12,192,223,0.35)]
                                "
                            >
                                GET IN TOUCH
                                <span className="text-lg">
                                    →
                                </span>
                            </a>

                        </div>

                    </div>

                </FadeIn>

            </div>
        </section>
    );
}

