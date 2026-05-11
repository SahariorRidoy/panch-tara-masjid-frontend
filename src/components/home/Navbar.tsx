"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import api from "@/lib/axios";
import { ContactInfo } from "@/types";
import { useLang } from "@/lib/LangContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/courses", label: "Courses" },
  { href: "/donate", label: "Donation" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blogs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();
  const pathname = usePathname();

  const { data } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
  });

  useEffect(() => { const t = setTimeout(() => setOpen(false), 0); return () => clearTimeout(t); }, [pathname]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Main navbar */}
      <nav className="transition-all duration-300 bg-white backdrop-blur-md shadow-md border-b border-[#1a7a4a]/20">
        <div className="h-0.5 bg-linear-to-r from-[#1a7a4a] via-[#d4a017] to-[#1a7a4a]" />

        <div className="container mx-auto px-4 flex items-center justify-between h-22">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image src="/logo.jpg" alt="Panch Tara Jame Masjid" width={44} height={20}
              className="object-contain h-18 w-18 sm:h-20 sm:w-30" />
              <h1 className="text-lg font-bold text-[#1a7a4a] sm:block">
                {lang === "en" ? "Nayabari Panch Tara Jame Masjid" : "নয়াবাড়ি পাঁচ তারা জামে মসজিদ"}
              </h1>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg group ${
                    isActive
                      ? "text-[#1a7a4a] bg-[#1a7a4a]/8"
                      : "text-gray-600 hover:text-[#1a7a4a] hover:bg-[#1a7a4a]/5"
                  }`}>
                  {l.label}
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-[#1a7a4a] transition-transform origin-left rounded-full ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center border-2 border-[#1a7a4a]/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setLang("bn")}
                className={`text-xs font-bold w-14 py-1.5 transition-all cursor-pointer ${
                  lang === "bn"
                    ? "bg-[#1a7a4a] text-white"
                    : "text-[#1a7a4a] hover:bg-[#1a7a4a]/5"
                }`}
              >
                বাংলা
              </button>
              <div className="w-px h-4 bg-[#1a7a4a]/30" />
              <button
                onClick={() => setLang("en")}
                className={`text-xs font-bold w-16 py-1.5 transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-[#1a7a4a] text-white"
                    : "text-[#1a7a4a] hover:bg-[#1a7a4a]/5"
                }`}
              >
                English
              </button>
            </div>
            <Link href="/donate"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold bg-linear-to-r from-[#d4a017] to-[#b8891a] text-white w-36 py-2 rounded-lg hover:shadow-md hover:scale-105 transition-all">
              <Heart size={14} className="fill-white" />
              {lang === "en" ? "Donate Now" : "দান করুন"}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center border-2 border-[#1a7a4a]/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setLang("bn")}
                className={`text-xs font-bold px-2 py-1 transition-all cursor-pointer ${
                  lang === "bn" ? "bg-[#1a7a4a] text-white" : "text-[#1a7a4a]"
                }`}
              >
                বাং
              </button>
              <div className="w-px h-3.5 bg-[#1a7a4a]/30" />
              <button
                onClick={() => setLang("en")}
                className={`text-xs font-bold px-2 py-1 transition-all cursor-pointer ${
                  lang === "en" ? "bg-[#1a7a4a] text-white" : "text-[#1a7a4a]"
                }`}
              >
                EN
              </button>
            </div>
            <button onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-150 opacity-100" : "max-h-0 opacity-0"
        }`}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors border-l-2 ${
                      isActive
                        ? "text-[#1a7a4a] bg-[#1a7a4a]/8 border-[#1a7a4a]"
                        : "text-gray-700 hover:text-[#1a7a4a] hover:bg-[#1a7a4a]/5 border-transparent"
                    }`}>
                    {l.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-100 mt-1">
                <Link href="/donate" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-r from-[#d4a017] to-[#b8891a] py-2.5 rounded-lg">
                  <Heart size={14} className="fill-white" />
                  {lang === "en" ? "Donate Now" : "দান করুন"}
                </Link>
              </div>
            </div>
          </div>
      </nav>
    </motion.header>
  );
}
