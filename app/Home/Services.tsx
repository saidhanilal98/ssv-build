"use client";
import { Building2, Wrench, ClipboardCheck } from "lucide-react";

export default function Services() {
    return (
        <section className="bg-[#F4F7F8] px-6 py-28 text-black lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                        Services We <span className="text-[#0CC0DF]">Excel In.</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-black/70">
                        We excel in property renovation, refurbishment, reinstatement, and maintenance, delivering quality
                        workmanship and reliable results.
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
          hover:bg-[#062133]
          hover:text-white
        "
                    >
                        VIEW MORE
                    </a>
                </div>

                {/* Service Cards */}
                <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">

                    {/* Card 1 */}
                    <div className="flex min-h-[440px] flex-col bg-[#062133] p-10 text-white transition-all duration-300 hover:-translate-y-3">
                        <p className="text-lg text-[#0CC0DF]">
                            01
                        </p>

                        <Building2 className="mt-8 h-14 w-14 text-[#0CC0DF]" strokeWidth={1.5} />

                        <h3 className="mt-8 text-xl font-semibold">
                            Property Maintenance & Preventative Care
                        </h3>

                        <p className="mt-8 text-base leading-7 text-white/70">
                            Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the
                            risk of damage and deterioration.
                            We offer planned and reactive property maintenance services to help keep buildings in good condition,
                            address issues early, and reduce the likelihood of preventable problems escalating.
                        </p>

                        <div className="mt-8 h-px w-16 bg-[#0CC0DF]" />
                    </div>

                    {/* Card 2 */}
                    <div className="flex min-h-[440px] flex-col bg-[#0CC0DF] p-10 text-black transition-all duration-300 hover:-translate-y-3">
                        <p className="text-lg">
                            02
                        </p>

                        <Wrench className="mt-8 h-14 w-14 text-black" strokeWidth={1.5} />

                        <h3 className="mt-8 text-xl font-semibold">
                            Damage Mitigation & Protective Measures
                        </h3>

                        <p className="mt-8 text-base leading-7 text-black/70">
                            Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation
                            services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly
                            to assess the situation and carry out practical measures to limit further damage and protect the property.
                        </p>

                        <div className="mt-8 h-px w-16 bg-black" />
                    </div>

                    {/* Card 3 */}
                    <div className="flex min-h-[440px] flex-col bg-black p-10 text-white transition-all duration-300 hover:-translate-y-3">
                        <p className="text-lg text-[#0CC0DF]">
                            03
                        </p>

                        <ClipboardCheck className="mt-8 h-14 w-14 text-[#0CC0DF]" strokeWidth={1.5} />

                        <h3 className="mt-8 text-xl font-semibold">
                            Property Claims & Resultant Damage Reinstatement
                        </h3>

                        <p className="mt-8 text-base leading-7 text-white/70">
                            We provide a professional damage assessment and reinstatement service. Our role is to support the claims process
                            by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works.
                            We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is
                            properly identified and addressed.
                        </p>

                        <div className="mt-8 h-px w-16 bg-[#0CC0DF]" />
                    </div>

                </div>
            </div>
        </section>
    );
}