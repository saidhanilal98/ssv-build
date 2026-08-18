"use client";

import Image from "next/image";

export default function Methods() {
    return (
        <section className="mx-auto px-4 py-12 bg-black">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

                {/* Column 1 */}
                <div className="flex flex-col space-y-4 bg-[#062133] p-6">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                            src="/methods-background.jpg"
                            alt="Feature illustration"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#0CC0DF]">
                        Sustainable Solutions | Visionary Values
                    </h2>

                    <p className="text-white">
                        We are ready to discuss your project and provide reliable,
                        professional property services tailored to your needs.
                    </p>

                    <div>
                        <button className="bg-[#0CC0DF] hover:bg-white text-black px-6 py-2.5 rounded-full font-medium transition">
                            Contact Us
                        </button>
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
                            <span className="text-blue-600 mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-gray-900 block">
                                    Server Components (RSC)
                                </strong>
                                <span className="text-gray-600 text-sm">
                                    Fetch data securely on the server by default.
                                </span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-gray-900 block">
                                    Dynamic Routes
                                </strong>
                                <span className="text-gray-600 text-sm">
                                    Create pages automatically using folder-based routing structures.
                                </span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2 font-bold">•</span>
                            <div>
                                <strong className="text-gray-900 block">
                                    Optimized Images
                                </strong>
                                <span className="text-gray-600 text-sm">
                                    Automatically resize, compress, and serve images in modern formats.
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
}