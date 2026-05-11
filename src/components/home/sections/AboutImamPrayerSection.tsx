"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { ContactInfo, SalahTimes } from "@/types";
import { useLang } from "@/lib/LangContext";
import { slideLeft, slideRight } from "@/lib/animations";

// Flip digit tile for countdown
function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative bg-[#d4a017] rounded-lg px-2 py-1.5 min-w-[36px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-white font-mono font-bold text-lg leading-none text-center"
          >
            {display}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="text-white/80 text-[8px] uppercase">{label}</p>
    </div>
  );
}

// Typewriter text
function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span className={className}>
      {displayed}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="inline-block w-0.5 h-5 bg-[#1a7a4a] ml-0.5 align-middle" />
    </span>
  );
}

export function AboutImamPrayerSection() {
  const { lang } = useLang();
  const [now, setNow] = useState<Date>(() => new Date());

  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
    staleTime: 60_000,
  });

  const { data: salah } = useQuery<{ timings: SalahTimes }>({
    queryKey: ["salah"],
    queryFn: () => api.get(`/salah?city=${process.env.NEXT_PUBLIC_SALAH_CITY ?? "Dhaka"}&country=${process.env.NEXT_PUBLIC_SALAH_COUNTRY ?? "BD"}`).then((r) => r.data.data),
    staleTime: 3_600_000,
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const to12h = (t?: string) => {
    if (!t) return "—";
    const [h, m] = t.replace(" (BST)", "").split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  const toMinutes = (t?: string) => {
    if (!t) return 0;
    const [h, m] = t.replace(" (BST)", "").split(":").map(Number);
    return h * 60 + m;
  };

  const prayers = [
    { key: "fajr",    en: "Fajr",    bn: "ফজর",   ar: "الفجر",  time: salah?.timings?.Fajr },
    { key: "dhuhr",   en: "Dhuhr",   bn: "যোহর",  ar: "الظهر",  time: salah?.timings?.Dhuhr },
    { key: "asr",     en: "Asr",     bn: "আসর",   ar: "العصر",  time: salah?.timings?.Asr },
    { key: "maghrib", en: "Maghrib", bn: "মগরিব", ar: "المغرب", time: salah?.timings?.Maghrib },
    { key: "isha",    en: "Isha",    bn: "ইশা",   ar: "العشاء", time: salah?.timings?.Isha },
  ];

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayerMins = prayers.map((p) => toMinutes(p.time));
  const nextIdx = prayerMins.findIndex((m) => m > nowMinutes);
  const currentIdx = nextIdx === -1 ? prayers.length - 1 : (nextIdx - 1 + prayers.length) % prayers.length;
  const nextMins = nextIdx === -1 ? prayerMins[0] + 1440 : prayerMins[nextIdx];
  const remaining = nextMins - nowMinutes;
  const remH = Math.floor(remaining / 60);
  const remM = remaining % 60;
  const remS = 60 - now.getSeconds();

  const timeStr = now.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Dhaka" });
  const dateStr = now.toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" });

  const masjidName = lang === "bn" ? "নয়াবাড়ি পাঁচ তারা জামে মসজিদ" : "Nayabari Panch Tara Jame Masjid";

  const aboutBn = `নয়াবাড়ি পাঁচ তারা জামে মসজিদ কমপ্লেক্স ইবাদত, ঈমান ও ইসলামী শিক্ষার ও সমাজকল্যাণের এক অনন্য কেন্দ্র ও আলোকবর্তিকা। ঢাকা–আরিচা মহাসড়কের পাশে সাহারা সিএনজি রিফুয়েলিং স্টেশন এন্ড সার্ভিসেস এর পিছনে নয়াবাড়ি এলাকায় অবস্থিত এই মসজিদ দীর্ঘদিন ধরে এলাকার মুসলিম সমাজের ধর্মীয় কার্যক্রমের অন্যতম কেন্দ্র হিসেবে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।

এই মসজিদ শুধুমাত্র পাঁচ ওয়াক্ত নামাজ আদায়ের স্থান নয়; বরং এটি মুসলিম সমাজের ঐক্য, দ্বীনি শিক্ষা এবং সামাজিক কল্যাণমূলক কার্যক্রমের এক প্রাণকেন্দ্র। বর্তমানে এই মসজিদকে একটি আধুনিক ৫ তলা বিশিষ্ট কমপ্লেক্সে রূপান্তরের মহতী উদ্যোগ গ্রহণ করা হয়েছে এবং নির্মাণ কাজ চলমান রয়েছে।

মসজিদ নির্মাণে আপনার যে কোন দান একটি চলমান সাদাকায়ে জারিয়া হিসেবে গণ্য হবে ইনশাহ আল্লাহ। আপনার দান হতে পারে একটি ইট, একটি জানালা, একটি জায়নামাজের স্থান বা একটি তলার নির্মাণে অংশগ্রহণ।

যোগাযোগ: নয়াবাড়ি, সাভার, ঢাকা।
মোবাইল: ০১৯৭৬-১৭২১৪০, ০১৭১৫-৪৯৮৪৮৭, ০১৭১৫-৭০২৭৪০। 
ওয়েবসাইট: panchtaramasjid.com`;

  const aboutEn = `Nayabari Panch Tara Jame Masjid Complex is a unique beacon of worship, faith, Islamic education, and social welfare. Located behind Sahara CNG Refuelling Station & Services, beside the Dhaka–Aricha highway in the Nayabari area, this masjid has long served as a key religious centre for the local Muslim community.

It is not merely a place for the five daily prayers — it is a living hub of Muslim unity, Islamic learning, and community welfare. A major initiative is underway to transform it into a modern 5-storey complex, with construction actively in progress.

Your donation to the masjid construction will be counted as a continuous Sadaqah Jariyah, Insha'Allah. Your contribution can be a brick, a window, a prayer space, or participation in building a floor.

Contact: Nayabari, Savar, Dhaka. 
Mobile: 01976-172140, 01715-498487, 01715-702740. 
Website: panchtaramasjid.com`;

  return (
    <section className="py-10 bg-[#f8f6f0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT — About + Imam */}
          <motion.div
            className="lg:col-span-2 relative overflow-hidden flex flex-col gap-4"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <g fill="#1a7a4a" fillOpacity="0.03">
                <rect x="60" y="220" width="26" height="280" rx="4"/>
                <rect x="54" y="208" width="38" height="14" rx="3"/>
                <rect x="48" y="192" width="50" height="16" rx="3"/>
                <rect x="54" y="168" width="38" height="26" rx="3"/>
                <rect x="60" y="144" width="26" height="26" rx="3"/>
                <ellipse cx="73" cy="136" rx="18" ry="22"/>
                <ellipse cx="73" cy="114" rx="11" ry="14"/>
                <ellipse cx="73" cy="98" rx="6" ry="9"/>
                <polygon points="73,78 66,98 80,98"/>
              </g>
              <g fill="#1a7a4a" fillOpacity="0.03">
                <rect x="714" y="220" width="26" height="280" rx="4"/>
                <rect x="708" y="208" width="38" height="14" rx="3"/>
                <rect x="702" y="192" width="50" height="16" rx="3"/>
                <rect x="708" y="168" width="38" height="26" rx="3"/>
                <rect x="714" y="144" width="26" height="26" rx="3"/>
                <ellipse cx="727" cy="136" rx="18" ry="22"/>
                <ellipse cx="727" cy="114" rx="11" ry="14"/>
                <ellipse cx="727" cy="98" rx="6" ry="9"/>
                <polygon points="727,78 720,98 734,98"/>
              </g>
              <g fill="#1a7a4a" fillOpacity="0.04">
                <rect x="188" y="175" width="38" height="325" rx="5"/>
                <rect x="181" y="162" width="52" height="16" rx="3"/>
                <rect x="174" y="144" width="66" height="18" rx="3"/>
                <rect x="181" y="116" width="52" height="30" rx="3"/>
                <rect x="188" y="88" width="38" height="30" rx="3"/>
                <ellipse cx="207" cy="78" rx="24" ry="30"/>
                <ellipse cx="207" cy="48" rx="15" ry="19"/>
                <ellipse cx="207" cy="28" rx="8" ry="12"/>
                <polygon points="207,4 199,28 215,28"/>
              </g>
              <g fill="#1a7a4a" fillOpacity="0.04">
                <rect x="574" y="175" width="38" height="325" rx="5"/>
                <rect x="567" y="162" width="52" height="16" rx="3"/>
                <rect x="560" y="144" width="66" height="18" rx="3"/>
                <rect x="567" y="116" width="52" height="30" rx="3"/>
                <rect x="574" y="88" width="38" height="30" rx="3"/>
                <ellipse cx="593" cy="78" rx="24" ry="30"/>
                <ellipse cx="593" cy="48" rx="15" ry="19"/>
                <ellipse cx="593" cy="28" rx="8" ry="12"/>
                <polygon points="593,4 585,28 601,28"/>
              </g>
              <g fill="#1a7a4a" fillOpacity="0.03">
                <rect x="226" y="255" width="348" height="245" rx="6"/>
                <ellipse cx="276" cy="255" rx="38" ry="30"/>
                <ellipse cx="524" cy="255" rx="38" ry="30"/>
              </g>
              <g fill="#1a7a4a" fillOpacity="0.04">
                <ellipse cx="400" cy="218" rx="96" ry="76"/>
                <rect x="372" y="218" width="56" height="38" rx="4"/>
                <rect x="394" y="142" width="12" height="76" rx="4"/>
                <ellipse cx="400" cy="136" rx="14" ry="18"/>
                <ellipse cx="400" cy="118" rx="8" ry="11"/>
                <polygon points="400,94 393,118 407,118"/>
              </g>
              <path d="M393,108 a9,9 0 1,0 14,0 a7,7 0 1,1 -14,0" fill="#d4a017" fillOpacity="0.1"/>
              <g fill="#d4a017" fillOpacity="0.04">
                <ellipse cx="400" cy="388" rx="26" ry="38"/>
                <rect x="374" y="388" width="52" height="112" rx="2"/>
                <ellipse cx="304" cy="330" rx="18" ry="26"/>
                <rect x="286" y="330" width="36" height="80" rx="2"/>
                <ellipse cx="496" cy="330" rx="18" ry="26"/>
                <rect x="478" y="330" width="36" height="80" rx="2"/>
                <ellipse cx="344" cy="278" rx="12" ry="17"/>
                <ellipse cx="456" cy="278" rx="12" ry="17"/>
              </g>
            </svg>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3 mb-4">
                {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
              </h2>
              {contact?.logo && (
                <div className="relative w-20 h-20 mb-4">
                  <Image src={contact.logo} alt="Masjid Logo" fill className="object-contain" />
                </div>
              )}
              <p className="text-xl font-bold text-gray-800 mb-3">
                <Typewriter text={masjidName} className="text-xl font-bold text-gray-800" />
              </p>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {lang === "bn" ? aboutBn : aboutEn}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-white bg-[#1a7a4a] px-5 py-2.5 rounded-lg hover:bg-[#155f3a] transition-colors"
              >
                {lang === "bn" ? "বিস্তারিত দেখুন →" : "View Full Details →"}
              </Link>
            </div>
            {/* <div className="flex flex-wrap gap-3">
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="text-xs font-medium text-[#1a7a4a] border border-[#1a7a4a] px-3 py-1.5 rounded-lg hover:bg-[#1a7a4a] hover:text-white transition-colors">
                  📞 {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="text-xs font-medium text-[#1a7a4a] border border-[#1a7a4a] px-3 py-1.5 rounded-lg hover:bg-[#1a7a4a] hover:text-white transition-colors">
                  ✉️ {contact.email}
                </a>
              )}
            </div> */}

            {/* Imam Info */}
            <div className="border-t border-gray-100 pt-4 relative z-10">
              <h3 className="text-lg font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3 mb-3">
                {lang === "bn" ? "ইমাম ও খতিব" : "Imam & Khatib"}
              </h3>
              <p className="font-bold text-gray-800 text-base mb-1">
                {lang === "bn" ? "ক্বারী আব্দুল হামিদ" : "Qari Abdul Hamid"}
              </p>
              <span className="text-xs font-medium text-[#1a7a4a] bg-[#e8f5ee] px-3 py-0.5 rounded-full w-fit mb-3 inline-block">
                {lang === "bn" ? "ইমাম ও খতিব" : "Imam & Khatib"}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                {lang === "bn"
                  ? "তিনি একজন সম্মানিত আলেম, যিনি নিয়মিত নামাজ নেতৃত্ব, খুতবা এবং ইসলামী জ্ঞান প্রচারে নিয়োজিত।"
                  : "He is a respected scholar dedicated to leading daily prayers, delivering khutbahs, and spreading Islamic knowledge."}
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Prayer Times */}
          <motion.div
            className="rounded-2xl overflow-hidden flex flex-col border border-[#1a7a4a]/20 shadow-xl shadow-[#1a7a4a]/10 bg-white"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >

            {/* Header */}
            <div className="bg-[#1a7a4a] px-5 pt-5 pb-4">
              <p className="text-[#d4a017] text-[10px] font-bold uppercase tracking-widest mb-1">
                {lang === "bn" ? "বাংলাদেশ — GMT+6" : "Bangladesh — GMT+6"}
              </p>
              <h3 className="text-white text-lg font-bold">
                {lang === "bn" ? "নামাজের সময়সূচি" : "Prayer Times"}
              </h3>
            </div>

            {/* Live clock */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f0faf5]">
              <div>
                <p className="text-[#1a7a4a] font-mono font-bold text-2xl tracking-wide">{timeStr}</p>
                <p className="text-gray-500 text-xs mt-0.5">{dateStr}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#1a7a4a]/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#1a7a4a] animate-pulse" />
              </div>
            </div>

            {/* Next prayer countdown */}
            <div className="mx-4 my-4 bg-[#fff8e6] border border-[#d4a017]/40 rounded-xl p-4">
              <p className="text-[#d4a017] text-[10px] font-bold uppercase tracking-widest mb-2">
                {lang === "bn" ? "পরবর্তী নামাজ" : "Next Prayer"}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-bold text-base">
                    {lang === "bn" ? prayers[nextIdx === -1 ? 0 : nextIdx]?.bn : prayers[nextIdx === -1 ? 0 : nextIdx]?.en}
                    <span className="text-[#d4a017] text-sm ml-2 font-normal">{prayers[nextIdx === -1 ? 0 : nextIdx]?.ar}</span>
                  </p>
                  <p className="text-[#1a7a4a] text-xs font-semibold mt-0.5">{to12h(prayers[nextIdx === -1 ? 0 : nextIdx]?.time)}</p>
                </div>
                <div className="flex items-end gap-1">
                  <FlipDigit value={remH} label={lang === "bn" ? "ঘণ্টা" : "HR"} />
                  <span className="text-[#d4a017] font-bold text-lg mb-5">:</span>
                  <FlipDigit value={remM} label={lang === "bn" ? "মিনিট" : "MIN"} />
                  <span className="text-[#d4a017] font-bold text-lg mb-5">:</span>
                  <FlipDigit value={remS > 60 ? 0 : remS} label={lang === "bn" ? "সেকেন্ড" : "SEC"} />
                </div>
              </div>
            </div>

            {/* Prayer list */}
            <div className="px-4 pb-4 flex flex-col gap-2">
              {prayers.map((p, i) => {
                const isActive = i === currentIdx;
                const isNext = i === (nextIdx === -1 ? 0 : nextIdx);
                return (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                    isActive ? "bg-[#1a7a4a] border-[#1a7a4a] shadow-md shadow-[#1a7a4a]/20" :
                    isNext   ? "bg-[#fff8e6] border-[#d4a017]/50" :
                    "bg-gray-50 border-gray-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : isNext ? "bg-[#d4a017]" : "bg-gray-300"}`} />
                      <div>
                        <p className={`font-semibold text-sm ${isActive ? "text-white" : "text-gray-800"}`}>
                          {lang === "bn" ? p.bn : p.en}
                        </p>
                        <p className={`text-[10px] ${isActive ? "text-white/70" : "text-gray-400"}`}>{p.ar}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive && <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">{lang === "bn" ? "চলমান" : "Now"}</span>}
                      {isNext  && <span className="text-[9px] bg-[#d4a017]/20 text-[#b8891a] px-1.5 py-0.5 rounded-full font-semibold">{lang === "bn" ? "পরবর্তী" : "Next"}</span>}
                      <p className={`font-bold font-mono text-sm ${isActive ? "text-white" : "text-[#1a7a4a]"}`}>
                        {to12h(p.time)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
