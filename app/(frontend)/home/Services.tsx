"use client";
import Image from "next/image";
import { SERVICE_ICONS } from "../../../lib/icons";
import type { ServiceItem } from "../../../lib/payload/content/services";

const CARD_CLASSES = [
    "bg-[#062133] text-white",
    "bg-[#0CC0DF] text-black",
    "bg-black text-white",
];

const NUMBER_CLASSES = ["text-[#0CC0DF]", "text-black", "text-[#0CC0DF]"];
const ICON_CLASSES = ["text-[#0CC0DF]", "text-[#062133]", "text-[#0CC0DF]"];
const TITLE_CLASSES = ["", "text-white", "text-white"];

type ServicesProps = {
    heading: string;
    description: string;
    ctaLabel: string;
    backgroundImage: { url: string; alt: string };
    services: ServiceItem[];
};

export default function Services({ heading, description, ctaLabel, backgroundImage, services }: ServicesProps) {
    return (
        <section className="relative overflow-hidden bg-[#F4F7F8] px-6 py-28 text-black lg:px-8">

            {/* Background Image */}
            <Image
                src={backgroundImage.url}
                alt={backgroundImage.alt}
                fill
                className="object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/80" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Heading */}
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl text-white">
                        {heading}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-white">
                        {description}
                    </p>

                    <a
                        href="/services"
                        className="
                    mt-8
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#0CC0DF]
                    px-8
                    py-4
                    text-sm
                    font-medium
                    uppercase
                    tracking-wide
                    text-black
                    transition-all
                    duration-300
                    hover:bg-white"
                    >
                        {ctaLabel}
                    </a>
                </div>

                {/* Service Cards */}
                <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">

                    {services.map((service, index) => {
                        const Icon = SERVICE_ICONS[service.icon];

                        return (
                            <div
                                key={service.title}
                                className={`flex min-h-[440px] flex-col p-10 transition-all duration-300 hover:-translate-y-3 ${CARD_CLASSES[index % CARD_CLASSES.length]}`}
                            >
                                <p className={`text-lg ${NUMBER_CLASSES[index % NUMBER_CLASSES.length]}`}>
                                    {String(index + 1).padStart(2, "0")}
                                </p>

                                {Icon && (
                                    <Icon
                                        className={`mt-8 h-14 w-14 ${ICON_CLASSES[index % ICON_CLASSES.length]}`}
                                        strokeWidth={1.5}
                                    />
                                )}

                                <h3 className={`mt-8 text-xl font-semibold ${TITLE_CLASSES[index % TITLE_CLASSES.length]}`}>
                                    {service.title}
                                </h3>

                                <p className="mt-8 text-base leading-7 text-white">
                                    {service.shortDescription}
                                </p>

                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}
