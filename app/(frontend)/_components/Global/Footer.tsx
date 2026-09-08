import Image from "next/image";
import Link from "next/link";
import FadeIn from "../../home/FadeIn";

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

type FooterProps = {
    logo: { url: string; alt: string };
    tagline: string;
    description: string;
    companyNumber: string;
    officeAddressLines: string[];
    phone: string;
    email: string;
    usefulLinks: { label: string; href: string }[];
    developerCredit: string;
};

export default function Footer({
    logo,
    tagline,
    description,
    companyNumber,
    officeAddressLines,
    phone,
    email,
    usefulLinks,
    developerCredit,
}: FooterProps) {
    return (
        <FadeIn>
            <footer className="relative overflow-hidden bg-[#062133] border-t border-border">

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">

                    <div className="flex flex-col justify-between gap-12 md:flex-row">

                        {/* Logo */}
                        <div>
                            <Link href="/" className="block text-3xl font-bold text-[#0CC0DF]">
                                {tagline.split("|").map((part, index, parts) => (
                                    <span key={index} className="block">
                                        {part.trim()}
                                        {index < parts.length - 1 ? " |" : ""}
                                    </span>
                                ))}
                            </Link>

                            <p className="mt-3 max-w-sm text-muted-foreground">
                                {description}
                            </p>

                            {companyNumber && (
                                <p className="mt-6 max-w-sm text-muted-foreground">
                                    Company Number: {companyNumber}
                                </p>
                            )}
                        </div>


                        {/* Logo Image */}
                        <div className="flex items-start justify-center">
                            <Image
                                src={logo.url}
                                alt={logo.alt}
                                width={300}
                                height={300}
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
                                    {officeAddressLines.map((line) => (
                                        <span key={line}>{line}</span>
                                    ))}
                                </p>

                                <p className="mt-6 flex max-w-sm flex-col text-muted-foreground">
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        className="transition hover:text-[#0CC0DF]"
                                    >
                                        {phone}
                                    </a>
                                    <a
                                        href={`mailto:${email}`}
                                        className="transition hover:text-[#0CC0DF]"
                                    >
                                        {email}
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

                                {usefulLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="transition hover:text-[#0CC0DF]"
                                    >
                                        {link.label}
                                    </Link>
                                ))}

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

                        {developerCredit && (
                            <p className="flex items-center gap-1.5">
                                Developed by {developerCredit} with <HeartIcon size={16} />
                            </p>
                        )}

                    </div>

                </div>

            </footer>
        </FadeIn>
    );
}
