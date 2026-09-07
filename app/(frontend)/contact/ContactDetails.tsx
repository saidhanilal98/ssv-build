"use client";

import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import FadeIn from "./FadeIn";

export default function ContactDetails() {
    return (
        <section className="relative overflow-hidden bg-[#F4F7F8] text-[#062133]">

            {/* Architectural grid */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.035]
                    [background-image:linear-gradient(to_right,#062133_1px,transparent_1px),linear-gradient(to_bottom,#062133_1px,transparent_1px)]
                    [background-size:80px_80px]
                "
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

                {/* Section heading */}
                <FadeIn>
                    <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">

                        <div className="lg:col-span-7">

                            <h2
                                className="
                                max-w-3xl
                                text-4xl
                                font-bold
                                uppercase
                                leading-[0.9]
                                tracking-[-0.04em]
                                sm:text-5xl
                                lg:text-6xl
                            "
                            >
                                Get In
                                <br />
                                <span className="text-[#0CC0DF]">
                                    Touch.
                                </span>
                            </h2>

                        </div>

                        <div className="lg:col-span-5">

                            <p className="max-w-md text-base leading-7 text-black lg:ml-auto">
                                Have a property that needs attention? Get in touch
                                with our team and let us know how we can assist.
                            </p>

                        </div>

                    </div>
                </FadeIn>

                {/* Main content */}
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">

                    {/* Contact information */}
                    <FadeIn className="h-full lg:col-span-5">
                    <div className="relative h-full overflow-hidden bg-[#062133] p-8 text-white sm:p-10 lg:p-12">

                        {/* Decorative glow */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-[#0CC0DF]/10
                                blur-3xl
                            "
                        />

                        {/* Decorative circle */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-32
                                -left-32
                                h-72
                                w-72
                                rounded-full
                                border
                                border-[#0CC0DF]/10
                            "
                        />

                        <div className="relative z-10">

                            {/* Details */}
                            <div className="space-y-8">

                                {/* Email */}
                                <a
                                    href="mailto:info@example.com"
                                    className="
                                        group
                                        flex
                                        items-start
                                        gap-5
                                        border-b
                                        border-white/10
                                        pb-8
                                        transition-all
                                        duration-300
                                        hover:border-[#0CC0DF]/40
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#0CC0DF]/20
                                            text-[#0CC0DF]
                                            transition-all
                                            duration-300
                                            group-hover:border-[#0CC0DF]
                                            group-hover:bg-[#0CC0DF]/10
                                        "
                                    >
                                        <Mail size={19} strokeWidth={1.5} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                                            Email
                                        </p>

                                        <p className="break-all text-base text-white/80 transition-colors duration-300 group-hover:text-[#0CC0DF]">
                                            geet.ssvpropertygroup@gmail.com
                                        </p>

                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="
                                            ml-auto
                                            mt-1
                                            shrink-0
                                            text-white/20
                                            transition-all
                                            duration-300
                                            group-hover:-translate-y-1
                                            group-hover:translate-x-1
                                            group-hover:text-[#0CC0DF]
                                        "
                                    />

                                </a>

                                {/* Phone */}
                                <a
                                    href="tel:+440000000000"
                                    className="
                                        group
                                        flex
                                        items-start
                                        gap-5
                                        border-b
                                        border-white/10
                                        pb-8
                                        transition-all
                                        duration-300
                                        hover:border-[#0CC0DF]/40
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#0CC0DF]/20
                                            text-[#0CC0DF]
                                            transition-all
                                            duration-300
                                            group-hover:border-[#0CC0DF]
                                            group-hover:bg-[#0CC0DF]/10
                                        "
                                    >
                                        <Phone size={19} strokeWidth={1.5} />
                                    </div>

                                    <div>

                                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                                            Phone
                                        </p>

                                        <p className="text-base text-white/80 transition-colors duration-300 group-hover:text-[#0CC0DF]">
                                            +44 7918 351115
                                        </p>

                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="
                                            ml-auto
                                            mt-1
                                            shrink-0
                                            text-white/20
                                            transition-all
                                            duration-300
                                            group-hover:-translate-y-1
                                            group-hover:translate-x-1
                                            group-hover:text-[#0CC0DF]
                                        "
                                    />

                                </a>

                                {/* Location */}
                                <div className="group flex items-start gap-5">

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            border
                                            border-[#0CC0DF]/20
                                            text-[#0CC0DF]
                                        "
                                    >
                                        <MapPin size={19} strokeWidth={1.5} />
                                    </div>

                                    <div>

                                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
                                            Location
                                        </p>

                                        <p className="max-w-xs text-base leading-7 text-white/80">
                                            Milton Keynes
                                            <br />
                                            London, United Kingdom
                                        </p>

                                    </div>

                                    {/* Same arrow as Email and Phone */}
                                    <ArrowUpRight
                                        size={17}
                                        className="
                                            ml-auto
                                            mt-1
                                            shrink-0
                                            text-white/20
                                            transition-all
                                            duration-300
                                            group-hover:-translate-y-1
                                            group-hover:translate-x-1
                                            group-hover:text-[#0CC0DF]
                                        "
                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                    </FadeIn>

                    {/* Map */}
                    <FadeIn className="h-full min-h-[450px] lg:col-span-7">
                    <div className="relative h-full min-h-[450px] overflow-hidden border border-[#062133]/10 bg-white">

                        {/* Map label */}
                        <div
                            className="
                                absolute
                                left-6
                                top-6
                                z-10
                                px-5
                                py-3
                            "
                        >

                        </div>

                        {/* Google Maps Embed */}
                        <iframe
                            title="Our location"
                            src="https://www.google.com/maps?q=London%2C%20United%20Kingdom&output=embed"
                            className="absolute inset-0 h-full w-full border-0 grayscale-[0.7] contrast-[1.05]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    </div>
                    </FadeIn>

                </div>

            </div>

        </section>
    );
}