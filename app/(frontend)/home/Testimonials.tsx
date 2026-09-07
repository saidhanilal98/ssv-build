"use client";

import FadeIn from "./FadeIn";

const testimonials = [
    {
        cite: "~ Wall Tiling",
        quote:
            "Robert was an absolute hero. Over the course of 2 intense and long days, he blitzed through a long list of jobs needing doing, all very quickly, cleanly and to a high standard. I'm very pleased with the result and would thoroughly recommend SSV for tiling, carpentry, decorating and other works. Pragmatic, great value and a lovely guy as well!",
    },
    {
        cite: "~ Internal Painting",
        quote:
            "Good work, clean and quiet! Robert was very professional and quickly got on with the painting work we had hired him for, causing minimal disruption. He was on time, stuck to the quote and did not leave any mess. Even wore shoe covers, which is always appreciated! Would not hesitate to recommend/use again!",
    },
    {
        cite: "~ Painting & Minor Repairs",
        quote:
            "Robert was professional from the day I met him and he offered me a fair price for the decorating work as well as completing it on time. I was so impressed with his work that I have asked him to do my laminate flooring as well as I wasn't disappointed! His general knowledge about building work is great and I felt I could trust him. Finally, the administrative system of things like invoicing setup is accurate and timely. Will be using SSV Property Group again.",
    },
    {
        cite: "~ Bathroom Wall Tiling",
        quote:
            "Robert did a great job with repairing our bathroom, including retiling, grouting, sealing and repairing some damp and water damage to the ceilings. He was quick, efficient, tidy, friendly and professional! Would definitely work with SSV again!",
    },
    {
        cite: "~ Internal Painting",
        quote:
            "Robert was brilliant, I would highly recommend! He worked tirelessly on my walls and ceiling to ensure they were completely covered, it wasn't an easy job but he wouldn't leave without it looking great. He was super helpful when discussing paint suggestions and very professional and friendly, both in communications and in person!",
    },
    {
        cite: "~ Renovation Upgrades",
        quote:
            "The decorator was very professional, came across like he knew what he was doing, carried out the work to a high standard, was friendly, communicative and was a great price for the work done. It was a pleasant experience and I would trust them to return for future jobs.",
    },
];

export default function Testimonials() {
    return (
        <section className=" bg-black px-6 py-20 lg:px-8">

            {/* Content */}
            <div className="relative mx-auto max-w-7xl">

                {/* Heading */}
                <FadeIn>
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                            What Our <span className="text-[#0CC0DF]">Clients Say?</span>
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-white/70">
                            Trusted by property owners, managers, and businesses for
                            professional property services and quality workmanship.
                        </p>
                    </div>
                </FadeIn>

                {/* Testimonials */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {testimonials.map((testimonial, index) => (
                        <FadeIn key={`${testimonial.cite}-${index}`}>
                            <figure className="flex min-h-[420px] h-full flex-col bg-white/95 p-8 backdrop-blur-sm">
                                <cite className="mb-6 min-h-[72px] text-2xl font-semibold not-italic text-[#0CC0DF]">
                                    {testimonial.cite}
                                </cite>

                                <blockquote className="flex flex-1">
                                    <p className="text-md leading-8 text-black italic">
                                        "{testimonial.quote}"
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
