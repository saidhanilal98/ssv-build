"use client";

import FadeIn from "./FadeIn";
import type { TestimonialItem } from "../../../lib/payload/content/testimonials";

type TestimonialsProps = {
    heading: string;
    description: string;
    testimonials: TestimonialItem[];
};

export default function Testimonials({ heading, description, testimonials }: TestimonialsProps) {
    return (
        <section className=" bg-black px-6 py-20 lg:px-8">

            {/* Content */}
            <div className="relative mx-auto max-w-7xl">

                {/* Heading */}
                <FadeIn>
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                            {heading}
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-white/70">
                            {description}
                        </p>
                    </div>
                </FadeIn>

                {/* Testimonials */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {testimonials.map((testimonial, index) => (
                        <FadeIn key={`${testimonial.citation}-${index}`}>
                            <figure className="flex min-h-[420px] h-full flex-col bg-white/95 p-8 backdrop-blur-sm">
                                <cite className="mb-6 min-h-[72px] text-2xl font-semibold not-italic text-[#0CC0DF]">
                                    ~ {testimonial.citation}
                                </cite>

                                <blockquote className="flex flex-1">
                                    <p className="text-md leading-8 text-black italic">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>
                                </blockquote>
                            </figure>
                        </FadeIn>
                    ))}

                </div>
            </div>
        </section>
    );
}
