"use client";
import { useQuery } from "@tanstack/react-query";
import { Heart, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";
import { ContactInfo, PaymentMethod } from "@/types";
import { useLang } from "@/lib/LangContext";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

function CopyBtn({ text, id, copied, onCopy }: { text: string; id: string; copied: string | null; onCopy: (text: string, id: string) => void }) {
  return (
    <button onClick={() => onCopy(text, id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
      {copied === id ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
    </button>
  );
}

export default function DonatePage() {
  const { lang } = useLang();
  const [copied, setCopied] = useState<string | null>(null);

  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
  });

  const { data: mobileMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: () => api.get("/payment-methods").then((r) =>
      (r.data.data as PaymentMethod[]).filter((m) => m.type === "mobile_banking")
    ),
  });

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f8f6f0] to-white">
      <Navbar />
      {/* Hero */}
      <section className="relative bg-linear-to-r from-[#1a7a4a] to-[#15633d] text-white py-4.5 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Heart className="w-14 h-14 mx-auto mb-4 fill-[#d4a017] text-[#d4a017]" />
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {lang === "en" ? "Support Our Masjid" : "আমাদের মসজিদকে সাহায্য করুন"}
          </h1>
          <p className="text-md text-white/80 max-w-lg mx-auto">
            {lang === "en"
              ? "Your generous donation helps maintain our masjid and serve the community."
              : "আপনার দান আমাদের মসজিদ রক্ষণাবেক্ষণ এবং সম্প্রদায়ের সেবায় সাহায্য করে।"}
          </p>
        </div>
      </section>

      {/* Hadith */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-8 border-l-4 border-[#d4a017]">
          <p className="text-[#d4a017] font-bold mb-3 text-center text-sm uppercase tracking-widest">
            {lang === "en" ? "The Prophet ﷺ said:" : "রাসূলুল্লাহ ﷺ বলেছেন:"}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed italic text-center mb-3">
            {lang === "en"
              ? "\"Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.\""
              : "\"যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করেন।\""}
          </p>
          <p className="text-gray-400 text-sm text-center">— {lang === "en" ? "Sahih Bukhari & Muslim" : "সহিহ বুখারি ও মুসলিম"}</p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Bank Transfer */}
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-[#1a7a4a]">
            <h2 className="text-xl font-bold text-[#1a7a4a] mb-6">
              🏦 {lang === "en" ? "Bank Transfer" : "ব্যাংক ট্রান্সফার"}
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-0.5">{lang === "en" ? "Bank Name" : "ব্যাংকের নাম"}</p>
                <p className="font-semibold text-gray-800">PUBALI BANK PLC</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">{lang === "en" ? "Account Name" : "অ্যাকাউন্টের নাম"}</p>
                <p className="font-semibold text-gray-800">NAYABARI PANCH TARA JAME MASJID</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">{lang === "en" ? "Account Number" : "অ্যাকাউন্ট নম্বর"}</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-xl text-[#1a7a4a]">2420 1011 22879</p>
                  <CopyBtn text="2420101122879" id="bank" copied={copied} onCopy={copy} />
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">{lang === "en" ? "Branch" : "শাখা"}</p>
                <p className="font-semibold text-gray-800">SAVAR BRANCH</p>
              </div>
            </div>
          </div>

          {/* Mobile Banking */}
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-[#d4a017]">
            <h2 className="text-xl font-bold text-[#d4a017] mb-6">
              📱 {lang === "en" ? "Mobile Banking" : "মোবাইল ব্যাংকিং"}
            </h2>
            <div className="space-y-6 text-sm">
              {mobileMethods.map((m, i) => (
                <div key={m._id} className={i > 0 ? "pt-6 border-t border-gray-100" : ""}>
                  <p className="text-gray-400 mb-1">{lang === "en" ? m.provider.en : m.provider.bn}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-xl text-gray-800">{m.accountNumber}</p>
                    <CopyBtn text={m.accountNumber ?? ""} id={m._id} copied={copied} onCopy={copy} />
                  </div>
                  {m.instructions && (
                    <p className="text-gray-400 text-xs mt-1">
                      {lang === "en" ? m.instructions.en : m.instructions.bn}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      {(contact?.phones?.length || contact?.email) && (
        <section className="bg-[#1a7a4a]/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {lang === "en" ? "Need Help?" : "সাহায্য প্রয়োজন?"}
            </h3>
            <p className="text-gray-500 mb-5 text-sm">
              {lang === "en" ? "For any questions about donations, please contact us." : "দান সম্পর্কে কোন প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।"}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {contact.phones?.[0] && (
                <a href={`tel:${contact.phones[0]}`} className="text-[#1a7a4a] font-semibold hover:underline">📞 {contact.phones[0]}</a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-[#1a7a4a] font-semibold hover:underline">✉️ {contact.email}</a>
              )}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
