"use client";

import FadeIn from "./FadeIn";

export default function VisionMission() {
    const visions = [
        {
            number: "01",
            title: "Proactive Care Over Reactive Repairs",
            description:
                "To pioneer a new standard of predictive and planned maintenance by providing a safe environment for tenants, and delivers true peace of mind.",
        },
        {
            number: "02",
            title: "The Return of the Human Touch",
            description:
                "To be the trusted, local partner that our clients and communities can rely on. We are building a network of trust across the UK one relationship at a time.​",
        },
        {
            number: "03",
            title: "Raising the Standard, Together",
            description:
                "To set a new, uncompromising benchmark for quality and integrity in everything we do. We aim to inspire a “race to the top” in the UK with excellence and loyalty.​",
        },
    ];

    const missions = [
        {
            number: "01",
            title: "Standards",
            description:
                "By upholding the highest standards of safety and craftsmanship. Whether handling small repairs or full-scale property care, we treat every home as if it were our own.",
        },
        {
            number: "02",
            title: "Trust",
            description:
                "Prioritizing trust, transparency, and communication. Our family-run approach means every client receives hands-on support, consistent care, and a reliable point of contact who truly understands their needs.​",
        },
        {
            number: "03",
            title: "Deliver",
            description:
                "To deliver dependable, high-quality property care that puts people first. We are committed to supporting landlords, protecting investments, and creating safe, comfortable homes for tenants through a blend of proactive maintenance, personalized service, and family-driven values.​",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-black text-white">
            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

                {/* Header */}
                <FadeIn>
                    <div className="mb-20 max-w-4xl">
                        <h1 className="text-5xl font-bold uppercase tracking-tight sm:text-6xl lg:text-8xl">
                            OUR{" "}
                            <span className="text-[#0CC0DF]">DIRECTION</span>{" "}
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                            Guided by sustainable thinking and visionary values,
                            we strive to create meaningful places, opportunities
                            and long-term impact.
                        </p>
                    </div>
                </FadeIn>

                {/* VISION */}
                <FadeIn>
                    <div className="mb-10 flex items-end justify-between border-b border-[#0CC0DF] pb-6">
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#0CC0DF]">
                                01
                            </p>

                            <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                                The SSV <span className="text-[#0CC0DF]">Vision</span>
                            </h2>
                        </div>

                        <span className="hidden text-sm uppercase tracking-[0.2em] text-white sm:block">
                            The future we see
                        </span>
                    </div>
                </FadeIn>

                <div className="mb-24 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
                    {visions.map((vision) => (
                        <FadeIn key={vision.number}>
                            <div className="flex h-full min-h-[390px] flex-col bg-white p-8 text-black transition-colors duration-300 hover:bg-[#0CC0DF] sm:p-10">
                                <div className="mb-12 flex items-center justify-between">
                                    <span className="text-sm font-bold tracking-[0.25em] text-black">
                                        {vision.number}
                                    </span>

                                    <div className="h-2 w-2 rounded-full bg-black" />
                                </div>

                                <h3 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                                    {vision.title}
                                </h3>

                                <div className="mt-6 h-px w-full bg-black" />

                                <p className="mt-6 text-base leading-relaxed text-black">
                                    {vision.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* MISSION */}
                <FadeIn>
                    <div className="mb-10 flex items-end justify-between border-b border-white pb-6">
                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#0CC0DF]">
                                02
                            </p>

                            <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                                The SSV <span className="text-[#0CC0DF]">Mission</span>
                            </h2>
                        </div>

                        <span className="hidden text-sm uppercase tracking-[0.2em] text-[#0CC0DF] sm:block">
                            How we create impact
                        </span>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 gap-px overflow-hidden border border-black bg-black md:grid-cols-3">
                    {missions.map((mission) => (
                        <FadeIn key={mission.number}>
                            <div className="flex h-full min-h-[390px] flex-col bg-[#0CC0DF] p-8 text-black transition-colors duration-300 hover:bg-white sm:p-10">
                                <div className="mb-12 flex items-center justify-between">
                                    <span className="text-sm font-bold tracking-[0.25em] text-black">
                                        {mission.number}
                                    </span>

                                    <div className="h-2 w-2 rounded-full bg-black" />
                                </div>

                                <h3 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                                    {mission.title}
                                </h3>

                                <div className="mt-6 h-px w-full bg-black" />

                                <p className="mt-6 text-base leading-relaxed text-black">
                                    {mission.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
