"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
    {
        image: "/projects/ssv-project-1.png",
    },
    {
        image: "/projects/ssv-project-2.png",
    },
    {
        image: "/projects/ssv-project-3.png",
    },
    {
        image: "/projects/ssv-project-4.png",
    },
];

export default function Projects() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % projects.length);
    };

    const previousSlide = () => {
        setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const project = projects[current];

    return (
        <section className="bg-[#062133] px-6 py-28 text-white lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">

                    <div>

                        <h2 className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                            Some Projects We are{" "}
                            <span className="text-[#0CC0DF]">
                                Proud Of.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-white">
                            Explore some of our completed projects, showcasing quality workmanship, attention to detail,
                            and exceptional results.
                        </p>

                        <div className="mt-6 h-px w-16 bg-[#0CC0DF]" />
                    </div>

                </div>

                {/* Slider */}
                <div className="relative mt-20 overflow-hidden">

                    <div className="relative aspect-video w-full lg:aspect-auto lg:h-137.5">

                        {/* Project Image */}
                        <Image
                            key={project.image}
                            alt=''
                            src={project.image}
                            fill
                            className="
                object-cover
                transition-all
                duration-700 ease-in-out
              "
                        />

                        {/* Project Content */}
                        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 lg:p-16">

                            <div className="max-w-2xl">


                            </div>

                        </div>

                    </div>

                    {/* Controls */}
                    <div className="mt-6 flex items-center justify-between">

                        {/* Slide Indicators */}
                        <div className="flex gap-2">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    aria-label={`Go to project ${index + 1}`}
                                    className={`
                    h-1
                    transition-all
                    duration-300
                    ${current === index
                                            ? "w-12 bg-[#0CC0DF]"
                                            : "w-6 bg-white/30 hover:bg-white/60"
                                        }
                  `}
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3">

                            <button
                                onClick={previousSlide}
                                aria-label="Previous project"
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-white
                  transition-all
                  duration-300
                  hover:border-[#0CC0DF]
                  hover:bg-[#0CC0DF]
                  hover:text-black
                "
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextSlide}
                                aria-label="Next project"
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-white
                  transition-all
                  duration-300
                  hover:border-[#0CC0DF]
                  hover:bg-[#0CC0DF]
                  hover:text-black
                "
                            >
                                <ChevronRight size={20} />
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}