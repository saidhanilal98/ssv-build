import Image from "next/image";
import FadeIn from "./_components/FadeIn";
import { Building2, Wrench, ClipboardCheck } from "lucide-react";

export default function Home() {
  return (
    <main>
      <FadeIn>
        <section className="relative min-h-screen overflow-hidden bg-black text-white">

          {/* Background */}
          <Image
            src="/hero-background.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

          {/* Cyan glow */}
          <div
            className="
              pointer-events-none
              absolute
              -left-40
              top-1/3
              h-96
              w-96
              rounded-full
              bg-[#0CC0DF]/10
              blur-[140px]
            "
          />

          {/* Hero content */}
          <div
            className="
              relative
              z-10
              mx-auto
              flex
              min-h-screen
              max-w-7xl
              items-start
              px-6
              pt-55
              pb-28
              lg:px-8
            "
          >
            <div
              className="
                grid
                w-full
                grid-cols-1
                items-start
                gap-14
                lg:grid-cols-2
                lg:gap-20
              "
            >

              {/* Left */}
              <div className="max-w-4xl">
                <h1
                  className="
                    text-[14vw]
                    font-bold
                    uppercase
                    leading-[0.82]
                    tracking-[-0.075em]
                    sm:text-[10vw]
                    lg:text-[7.5rem]
                    xl:text-[8rem]
                  "
                >
                  YOUR VISION.
                  <br />
                  <span className="text-[#0CC0DF]">
                    EXPERTLY BUILT.
                  </span>
                </h1>
              </div>

              {/* Right */}
              <div className="max-w-xl">
                <h2
                  className="
                    max-w-lg
                    text-2xl
                    font-semibold
                    leading-tight
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  Sustainable Solutions{" "}
                  <span className="text-[#0CC0DF]">|</span>{" "}
                  Visionary Values
                </h2>

                <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />

                <p
                  className="
                    mt-6
                    max-w-lg
                    text-sm
                    leading-7
                    text-white
                    sm:text-base
                  "
                >
                  At SSV Property Group Ltd, we do more than manage and
                  maintain properties. We build strong client relationships
                  and protect long-term investments.
                </p>

                <p
                  className="
                    mt-4
                    max-w-lg
                    text-sm
                    leading-7
                    text-white
                    sm:text-base
                  "
                >
                  Guided by integrity, reliability, and attention to detail,
                  we treat every property with the highest level of care.
                  Our team delivers professional, responsive service with a
                  personal touch, ensuring your property is maintained to the
                  highest standards and your peace of mind always comes first.
                </p>

                <p
                  className="
                    mt-4
                    max-w-lg
                    text-sm
                    leading-7
                    text-white
                    sm:text-base
                  "
                >
                  Begin your project with confidence. Our team supports you
                  throughout the entire journey, allowing you to enjoy a
                  stress-free experience while we expertly manage and deliver
                  your desired project.
                </p>

                {/* CTA */}
                <a
                  href="/contact"
                  className="
                    mt-8
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#0CC0DF]
                    px-7
                    py-4
                    text-sm
                    font-medium
                    uppercase
                    tracking-wide
                    text-black
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:text-black
                    hover:shadow-[0_0_30px_rgba(12,192,223,0.35)]
                  "
                >
                  GET STARTED
                </a>
              </div>
            </div>
          </div>

        </section>
      </FadeIn>

      {/* Statistics column */}
      <section className="bg-black text-white">
        <div className="grid w-full grid-cols-1 md:grid-cols-3">

          {/* Statistic 1 */}
          <div className="flex min-h-[280px] flex-col justify-center bg-[#0CC0DF] px-10 py-16 text-center text-black md:text-left">
            <p className="text-6xl font-bold tracking-tight sm:text-7xl">
              30
            </p>
            <p className="mt-4 text-medium font-medium italic tracking-wide">
              Years of Sustainable Success
            </p>
          </div>

          {/* Statistic 2 */}
          <div className="flex min-h-[280px] flex-col justify-center bg-white px-10 py-16 text-center text-black md:text-left">
            <p className="text-6xl font-bold tracking-tight sm:text-7xl">
              1200+
            </p>
            <p className="mt-4 text-medium font-medium italic tracking-wide">
              Successful Projects Completed
            </p>
          </div>

          {/* Statistic 3 */}
          <div className="flex min-h-[280px] flex-col justify-center bg-[#062133] px-10 py-16 text-center text-white md:text-left">
            <p className="text-6xl font-bold tracking-tight sm:text-7xl">
              30+
            </p>
            <p className="mt-4 text-medium font-medium italic tracking-wide">
              Years of Experience
            </p>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#F4F7F8] px-6 py-28 text-black lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
              Services We <span className="text-[#0CC0DF]">Excel In.</span>
            </h2>

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
    </main>
  );
}