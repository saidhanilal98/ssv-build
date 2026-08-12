"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
];

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="absolute left-0 top-0 z-50 w-full bg-transparent">

            <nav
                className="
          relative
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-4
          lg:px-8
        "
            >

                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center"
                    onClick={() => setOpen(false)}
                >
                    <Image
                        src="/ssv-logo.png"
                        alt="SSV Logo"
                        width={165}
                        height={55}
                        priority
                        className="
              h-auto
              w-[165px]
              transition
              duration-300
              group-hover:scale-105
            "
                    />
                </Link>

                {/* Desktop Navigation */}
                <div
                    className="
            hidden
            items-center
            gap-12
            lg:flex
          "
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="
                group
                relative
                py-2
                text-base
                text-zinc-300
                transition-colors
                duration-300
                hover:text-[#0CC0DF]
              "
                        >
                            {link.label}

                            {/* Underline */}
                            <span
                                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-0
                  bg-[#0CC0DF]
                  shadow-[0_0_8px_#0CC0DF]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
                            />
                        </Link>
                    ))}

                    {/* Contact */}
                    <Link
                        href="/contact"
                        className="
              rounded-full
              bg-[#0CC0DF]
              px-6
              py-3
              text-base
              font-medium
              text-black
              transition-all
              duration-300
              hover:bg-white
              hover:shadow-[0_0_25px_rgba(12,192,223,0.35)]
            "
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-lg
            border
            border-white/10
            bg-black/20
            backdrop-blur-md
            transition
            hover:border-[#0CC0DF]/50
            lg:hidden
          "
                >
                    <div className="flex w-5 flex-col gap-1.5">

                        <span
                            className={`block h-px w-full bg-[#0CC0DF] transition duration-300 ${open ? "translate-y-2 rotate-45" : ""
                                }`}
                        />

                        <span
                            className={`block h-px w-full bg-[#0CC0DF] transition duration-300 ${open ? "opacity-0" : ""
                                }`}
                        />

                        <span
                            className={`block h-px w-full bg-[#0CC0DF] transition duration-300 ${open ? "-translate-y-2 -rotate-45" : ""
                                }`}
                        />

                    </div>
                </button>
            </nav>

            {/* Mobile Navigation */}
            <div
                className={`
          absolute
          left-0
          right-0
          overflow-hidden
          border-t
          border-white/10
          bg-black/80
          backdrop-blur-xl
          transition-all
          duration-300
          lg:hidden
          ${open
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }
        `}
            >
                <div
                    className="flex flex-col gap-1 px-6 py-5"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="
                rounded-lg
                px-4
                py-3.5
                text-base
                text-zinc-300
                transition
                hover:bg-white/5
                hover:text-[#0CC0DF]
              "
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="
              mt-2
              rounded-lg
              bg-[#0CC0DF]
              px-4
              py-3.5
              text-center
              text-base
              font-medium
              text-black
              transition
              hover:bg-white
            "
                    >
                        Contact Us
                    </Link>
                </div>
            </div>

        </header>
    );
}