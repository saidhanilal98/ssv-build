"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";

const methods = [
    {
        title: "Extensive Experience",
        description: "Over 30+ years expertise and sustainable success.",
    },
    {
        title: "Qualified Team",
        description:
            "A dedicated team that delivers exceptional results on every project.",
    },
    {
        title: "Superior Quality",
        description:
            "We offer expert workmanship, premium materials, and meticulous attention to detail.",
    },
    {
        title: "Reliable & Committed",
        description:
            "Our commitment to delivering dependable services, consistent quality, and trust.",
    },
];

export default function Methods() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="mx-auto">
            <div className="grid grid-cols-1 items-stretch md:grid-cols-2">

                {/* Column 1 - Background Image */}
                <div className="relative flex min-h-[600px] flex-col justify-center overflow-hidden p-10">

                    <Image
                        src="/methods-background.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* Centered Content */}
                    <div className="relative z-10 flex w-full flex-col items-center space-y-4 text-center">

                        <h2 className="text-4xl font-bold text-[#0CC0DF]">
                            Sustainable Solutions | Visionary Values
                        </h2>

                        <p className="max-w-md text-white">
                            We are ready to discuss your project and provide reliable,
                            professional property services tailored to your needs.
                        </p>

                        <div className="pt-2">
                            <button className="rounded-full bg-[#0CC0DF] px-6 py-2.5 font-medium text-black transition hover:bg-white">
                                Contact Us
                            </button>
                        </div>

                    </div>
                </div>

                {/* Column 2 */}
                <div className="bg-white p-8 h-full border border-white sm:p-10 md:p-8 lg:p-16 xl:p-20">
                    <h2 className="mt-4 wrap-break-word text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl text-black">
                        OPTIMAL METHODS{" "}
                        <span className="text-[#0CC0DF]">
                            WE ACCOMPLISH.
                        </span>
                    </h2>

                    <ul className="mt-10">
                        {methods.map((method, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <li key={method.title} className="border-b border-black/10">
                                    <button
                                        type="button"
                                        onClick={() => toggle(index)}
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-6 py-6 text-left"
                                    >
                                        <strong className="text-black text-lg">
                                            {method.title}
                                        </strong>

                                        <span
                                            className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-[#0CC0DF]
                                                text-[#0CC0DF]
                                                transition-transform
                                                duration-300
                                                ${isOpen ? "rotate-45" : ""}
                                            `}
                                        >
                                            <Plus size={16} strokeWidth={2} />
                                        </span>
                                    </button>

                                    <div
                                        className="grid overflow-hidden transition-all duration-300 ease-out"
                                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                    >
                                        <div className="overflow-hidden">
                                            <span className="block pb-6 text-gray-600 text-md">
                                                {method.description}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>
        </section>
    );
}
