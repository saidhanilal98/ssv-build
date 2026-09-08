"use client";

import FadeIn from "./FadeIn";

type Item = { title: string; description: string };

type VisionMissionProps = {
    heading: string;
    description: string;
    visions: Item[];
    missions: Item[];
};

export default function VisionMission({ heading, description, visions, missions }: VisionMissionProps) {
    return (
        <section className="relative overflow-hidden bg-black text-white">
            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

                {/* Header */}
                <FadeIn>
                    <div className="mb-20 max-w-4xl">
                        <h1 className="text-5xl font-bold uppercase tracking-tight sm:text-6xl lg:text-8xl">
                            {heading}
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                            {description}
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
                    {visions.map((vision, index) => (
                        <FadeIn key={vision.title}>
                            <div className="flex h-full min-h-[390px] flex-col bg-white p-8 text-black transition-colors duration-300 hover:bg-[#0CC0DF] sm:p-10">
                                <div className="mb-12 flex items-center justify-between">
                                    <span className="text-sm font-bold tracking-[0.25em] text-black">
                                        {String(index + 1).padStart(2, "0")}
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
                    {missions.map((mission, index) => (
                        <FadeIn key={mission.title}>
                            <div className="flex h-full min-h-[390px] flex-col bg-[#0CC0DF] p-8 text-black transition-colors duration-300 hover:bg-white sm:p-10">
                                <div className="mb-12 flex items-center justify-between">
                                    <span className="text-sm font-bold tracking-[0.25em] text-black">
                                        {String(index + 1).padStart(2, "0")}
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
