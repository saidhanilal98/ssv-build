"use client";

import { useEffect, useRef, useState } from "react";

function Counter({
    target,
    suffix = "",
    duration = 2000,
}: {
    target: number;
    suffix?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLParagraphElement>(null);
    const [started, setStarted] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;

        const startTime = performance.now();
        let frame: number;

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [started, target, duration]);

    return (
        <p ref={ref} className="text-6xl font-bold tracking-tight sm:text-7xl">
            {count.toLocaleString()}
            {suffix}
        </p>
    );
}

const BG_CLASSES = ["bg-[#0CC0DF] text-black", "bg-white text-black", "bg-[#062133] text-white"];

type StatisticsProps = {
    statistics: { value: number; suffix: string; label: string }[];
};

export default function Statistics({ statistics }: StatisticsProps) {
    return (
        <section className="bg-black text-white">
            <div className="grid w-full grid-cols-1 md:grid-cols-3">

                {statistics.map((statistic, index) => (
                    <div
                        key={statistic.label}
                        className={`flex min-h-[280px] flex-col justify-center px-10 py-16 text-center md:text-left ${BG_CLASSES[index % BG_CLASSES.length]}`}
                    >
                        <Counter target={statistic.value} suffix={statistic.suffix} />
                        <p className="mt-4 text-medium font-medium italic tracking-wide">
                            {statistic.label}
                        </p>
                    </div>
                ))}

            </div>
        </section>
    );
}
