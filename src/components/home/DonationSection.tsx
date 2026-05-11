"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { PaymentMethod } from "@/types";

export function DonationSection() {
  const { data: mobileMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: () => api.get("/payment-methods").then((r) =>
      (r.data.data as PaymentMethod[]).filter(
        (m) => m.isActive && ["mobile_banking", "bkash", "nagad", "rocket"].includes(m.type)
      )
    ),
  });

  return (
    <section id="donate" className="relative bg-[#1a7a4a] overflow-hidden">

      {/* Animated floating circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full animate-float-slow" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full animate-float" />
      <div className="absolute top-8 right-40 w-20 h-20 bg-[#d4a017]/20 rounded-full animate-float-delay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/2 rounded-full animate-spin-slow" />

      <div className="relative z-10 container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-white">

          {/* Left — CTA */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#d4a017] text-xs font-bold uppercase tracking-widest mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <h2 className="text-3xl font-bold leading-tight mb-3">
              মসজিদ নির্মাণে দান করুন<br />
              <span className="text-xl font-medium text-white/70">Donate for Masjid Construction</span>
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Your donation keeps the masjid running and the community thriving. May Allah reward you abundantly.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
              <p className="text-[#d4a017] text-xs font-bold mb-2">রাসূলুল্লাহ ﷺ বলেছেন:</p>
              <p className="text-white text-sm leading-relaxed italic">
                &ldquo;যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করেন।&rdquo;
              </p>
              <p className="text-white/50 text-xs mt-2">— সহিহ বুখারি ও মুসলিম</p>
            </div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link href="/donate" className="inline-flex items-center gap-2 bg-[#d4a017] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-transform hover:scale-105 duration-300">
              ♥ Donate Today
            </Link>
            </motion.div>
          </motion.div>

          {/* Middle — Bank */}
          <motion.div
            className="lg:col-span-1 border-l border-white/20 pl-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#d4a017] text-[10px] font-bold uppercase tracking-widest mb-4">Bank Transfer</p>
            <p className="text-white/60 text-xs mb-0.5">Bank Name</p>
            <p className="text-white font-semibold text-sm mb-3">PUBALI BANK PLC</p>
            <p className="text-white/60 text-xs mb-0.5">Account Name</p>
            <p className="text-white font-semibold text-sm mb-3">NAYABARI PANCH TARA JAME MASJID</p>
            <p className="text-white/60 text-xs mb-0.5">Account Number</p>
            <p className="text-[#d4a017] font-mono font-bold text-2xl tracking-widest mb-3">2420 1011 22879</p>
            <p className="text-white/60 text-xs mb-0.5">Branch</p>
            <p className="text-white font-semibold text-sm">SAVAR BRANCH</p>
          </motion.div>

          {/* Right — Mobile */}
          <motion.div
            className="lg:col-span-1 border-l border-white/20 pl-10"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#d4a017] text-[10px] font-bold uppercase tracking-widest mb-4">Mobile Banking</p>
            <div className="space-y-5">
              {mobileMethods.map((m, i) => {
                const isBkash = m.provider.en.toLowerCase().includes("bkash");
                const isNagad = m.provider.en.toLowerCase().includes("nagad");
                return (
                <div key={m._id} className={i > 0 ? "border-t border-white/10 pt-5" : ""}>
                  <div className="flex items-center gap-2 mb-1">
                    {isBkash && <Image src="/bkash.png" alt="bkash" width={48} height={24} className="shrink-0" />}
                    {isNagad && <Image src="/nagad.png" alt="nagad" width={48} height={24} className="shrink-0" />}
                    <p className="text-white/60 text-xs">{m.provider.en}</p>
                  </div>
                  <p className="text-white font-mono font-bold text-2xl tracking-widest">{m.accountNumber}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(m.accountNumber ?? "")}
                    className="mt-1 text-[10px] text-white/50 hover:text-[#d4a017] transition-colors"
                  >
                    Copy number
                  </button>
                </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
