"use client";

import Image from "next/image";

export default function Methods() {
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
                <div className="bg-white p-20 h-full border border-white">
                    <h2 className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl text-black">
                        OPTIMAL METHODS{" "}
                        <span className="text-[#0CC0DF]">
                            WE ACCOMPLISH.
                        </span>
                    </h2>

                    <ul className="py-10 space-y-4">
                        <li className="flex items-start">
                            <span className="text-[#0CC0DF] mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-black text-lg block">
                                    Extensive Experience
                                </strong>
                                <span className="text-gray-600 text-md">
                                    Over 30+ years expertise and sustainable success.
                                </span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="text-[#0CC0DF] mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-black text-lg block">
                                    Qualified Team
                                </strong>
                                <span className="text-gray-600 text-md">
                                    A dedicated team that delivers exceptional results on every project.
                                </span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="text-[#0CC0DF] mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-black text-lg block">
                                    Superior Quality
                                </strong>
                                <span className="text-gray-600 text-md">
                                    We offer expert workmanship, premium materials, and meticulous attention to detail.
                                </span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="text-[#0CC0DF] mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-black text-lg block">
                                    Reliable & Committed
                                </strong>
                                <span className="text-gray-600 text-md">
                                    Our commitment to delivering dependable services, consistent quality, and trust.
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
}