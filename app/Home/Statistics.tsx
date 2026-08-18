"use client";

export default function Statistics() {
    return (
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
    );
}