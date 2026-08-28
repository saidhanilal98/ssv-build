import Image from "next/image";
import Link from "next/link";
import FadeIn from "../../home/FadeIn";

function GithubIcon({ size = 22 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </svg>
    );
}

function LinkedinIcon({ size = 22 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
        </svg>
    );
}

function HeartIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="inline-block animate-pulse text-[#0CC0DF]"
        >
            <path d="M12 21s-6.7-4.35-9.33-8.34C.98 10.2 1.2 7.1 3.6 5.2c2.1-1.67 4.9-1.2 6.4.9l2 2.6 2-2.6c1.5-2.1 4.3-2.57 6.4-.9 2.4 1.9 2.62 5 .93 7.46C18.7 16.65 12 21 12 21Z" />
        </svg>
    );
}

export default function Footer() {
    return (
        <FadeIn>
            <footer className="relative overflow-hidden bg-[#062133] border-t border-border">

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">

                    <div className="flex flex-col justify-between gap-12 md:flex-row">

                        {/* Logo */}
                        <div>
                            <Link href="/" className="block text-3xl font-bold text-[#0CC0DF]">
                                <span className="block">Sustainable Solutions |</span>
                                <span className="block">Visionary Values</span>
                            </Link>

                            <p className="mt-3 max-w-sm text-muted-foreground">
                                SSV is guided by integrity, reliability, and attention to detail. Start your journey with us to create your desired project.
                            </p>

                            <p className="mt-6 max-w-sm text-muted-foreground">
                                Company Number: 14877900
                            </p>
                        </div>


                        {/* Logo Image */}
                        <div className="flex items-start justify-center">
                            <Image
                                src="/ssv-logo.webp"
                                alt="SSV Property Group"
                                width={120}
                                height={120}
                                className="h-auto w-50 object-contain"
                            />
                        </div>


                        {/* Head Office */}
                        <div>
                            <h3 className="mb-5 text-md uppercase font-semibold text-[#0CC0DF]">
                                Head Office
                            </h3>

                            <div className="flex flex-col gap-4 text-md text-muted-foreground">

                                <p className="mt-3 flex max-w-sm flex-col text-muted-foreground">
                                    <span>Milton Keynes</span>
                                    <span>North West London</span>
                                    <span>United Kingdom</span>
                                    <span>MK10 7DR</span>
                                </p>

                                <p className="mt-6 flex max-w-sm flex-col text-muted-foreground">
                                    <a
                                        href="tel:+447918351115"
                                        className="transition hover:text-[#0CC0DF]"
                                    >
                                        +44 7918 351115
                                    </a>
                                    <a
                                        href="mailto:geet.ssvpropertygroup@gmail.com"
                                        className="transition hover:text-[#0CC0DF]"
                                    >
                                        geet.ssvpropertygroup@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>


                        {/* Useful Links */}
                        <div>
                            <h3 className="mb-5 text-md uppercase font-semibold text-[#0CC0DF] ">
                                Useful Links
                            </h3>

                            <div className="flex flex-col gap-4 text-md text-muted-foreground">

                                <Link
                                    href="/"
                                    className="transition hover:text-[#0CC0DF]"
                                >
                                    Home
                                </Link>

                                <Link
                                    href="/about"
                                    className="transition hover:text-[#0CC0DF]"
                                >
                                    About Us
                                </Link>

                                <Link
                                    href="/projects"
                                    className="transition hover:text-[#0CC0DF]"
                                >
                                    Services
                                </Link>

                                <Link
                                    href="/contact"
                                    className="transition hover:text-[#0CC0DF]"
                                >
                                    Contact Us
                                </Link>

                            </div>
                        </div>





                    </div>


                    {/* Divider */}
                    <div className="my-10 h-px bg-border bg-[#0CC0DF]" />


                    {/* Bottom */}
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">

                        <p>
                            © {new Date().getFullYear()} SSV Property Group. All rights reserved.
                        </p>

                        <p className="flex items-center gap-1.5">
                            Developed by Carbron Coders with <HeartIcon size={16} />
                        </p>

                    </div>

                </div>

            </footer>
        </FadeIn>
    );
}