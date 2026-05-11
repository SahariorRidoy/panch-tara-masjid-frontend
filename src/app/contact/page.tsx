"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/BottomSections";
import api from "@/lib/axios";
import { ContactInfo } from "@/types";
import { useLang } from "@/lib/LangContext";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function ContactPage() {
  const { lang } = useLang();

  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
    staleTime: 60_000,
  });

  const phones = [
    "০১৯৭৬-১৭২১৪০",
    "০১৭১৫-৪৯৮৪৮৭",
    "০১৭১৫-৭০২৭৪০",
  ];

  const infoCards = [
    {
      icon: MapPin,
      label: { en: "Address", bn: "ঠিকানা" },
      value: lang === "bn"
        ? (contact?.address?.bn ?? "নয়াবাড়ি, সাভার, ঢাকা")
        : (contact?.address?.en ?? "Nayabari, Savar, Dhaka"),
      sub: lang === "bn"
        ? (contact?.city?.bn ?? "সাভার, ঢাকা, বাংলাদেশ")
        : (contact?.city?.en ?? "Savar, Dhaka, Bangladesh"),
    },
    {
      icon: Phone,
      label: { en: "Phone", bn: "মোবাইল" },
      value: contact?.phones?.[0] ?? "০১৯৭৬-১৭২১৪০",
      sub: lang === "bn" ? "সকাল ৮টা – রাত ১০টা" : "8:00 AM – 10:00 PM",
      href: `tel:${contact?.phones?.[0] ?? "01976172140"}`,
    },
    {
      icon: Mail,
      label: { en: "Email", bn: "ইমেইল" },
      value: contact?.email ?? "nayabaripachtarajamemasjid@gmail.com",
      sub: lang === "bn" ? "যেকোনো সময় ইমেইল করুন" : "Email us anytime",
      href: `mailto:${contact?.email ?? "nayabaripachtarajamemasjid@gmail.com"}`,
    },
    {
      icon: Globe,
      label: { en: "Website", bn: "ওয়েবসাইট" },
      value: "panchtaramasjid.com",
      sub: lang === "bn" ? "আমাদের অনলাইন পোর্টাল" : "Our online portal",
      href: "https://panchtaramasjid.com",
    },
  ];

  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="bg-linear-to-r from-[#1a7a4a] to-[#15633d] py-11">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-2">
              {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get In Touch"}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {lang === "bn" ? "যোগাযোগ" : "Contact Us"}
            </h1>
            <p className="text-white/80 text-md max-w-lg mx-auto">
              {lang === "bn"
                ? "আমরা সর্বদা আপনার সেবায় প্রস্তুত। যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।"
                : "We are always here to help. Reach out to us for any questions, support, or general enquiries."}
            </p>
          </div>
        </section>

        {/* Info cards */}
        <section className="py-12 bg-[#f8f6f0]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {infoCards.map((card, i) => {
                const Icon = card.icon;
                const content = (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#1a7a4a]/20 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-[#1a7a4a]/10 flex items-center justify-center">
                      <Icon size={20} className="text-[#1a7a4a]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a017] mb-1">
                        {card.label[lang]}
                      </p>
                      <p className="font-semibold text-gray-800 text-sm leading-snug">{card.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                );
                return card.href ? (
                  <a key={i} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {content}
                  </a>
                ) : content;
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT — Details */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Masjid identity */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start gap-5">
                    {contact?.logo ? (
                      <div className="relative w-20 h-20 shrink-0">
                        <Image src={contact.logo} alt="Logo" fill className="object-contain rounded-xl" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 shrink-0 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                        <MapPin size={28} className="text-[#1a7a4a]/50" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg leading-snug mb-1">
                        {lang === "bn" ? (contact?.masjidName?.bn ?? "নয়াবাড়ি পাঁচ তারা জামে মসজিদ") : (contact?.masjidName?.en ?? "Nayabari Panch Tara Jame Masjid")}
                      </h2>
                      <p className="text-[#1a7a4a] text-xs font-medium italic mb-2">
                        &ldquo;{lang === "bn" ? (contact?.tagline?.bn ?? "শান্তি ও সম্প্রদায়ের স্থান") : (contact?.tagline?.en ?? "A place of peace and community")}&rdquo;
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {lang === "bn"
                          ? "ঢাকা–আরিচা মহাসড়কের পাশে সাহারা সিএনজি রিফুয়েলিং স্টেশন এর পিছনে নয়াবাড়ি এলাকায় অবস্থিত।"
                          : "Located behind Sahara CNG Refuelling Station, beside the Dhaka–Aricha highway, Nayabari area."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* All phone numbers */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 text-base border-l-4 border-[#d4a017] pl-3 mb-4">
                    {lang === "bn" ? "যোগাযোগ নম্বর" : "Contact Numbers"}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/-/g, "")}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-[#f8f6f0] hover:border-[#1a7a4a]/30 hover:bg-[#e8f5ee] transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1a7a4a]/10 flex items-center justify-center">
                            <Phone size={14} className="text-[#1a7a4a]" />
                          </div>
                          <span className="font-mono font-semibold text-gray-800 text-sm">{phone}</span>
                        </div>
                        <span className="text-xs text-[#1a7a4a] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {lang === "bn" ? "কল করুন →" : "Call →"}
                        </span>
                      </a>
                    ))}
                    <a href="mailto:nayabaripachtarajamemasjid@gmail.com"
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-[#f8f6f0] hover:border-[#1a7a4a]/30 hover:bg-[#e8f5ee] transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1a7a4a]/10 flex items-center justify-center">
                          <Mail size={14} className="text-[#1a7a4a]" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">pachtarajamemasjid@gmail.com</span>
                      </div>
                      <span className="text-xs text-[#1a7a4a] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {lang === "bn" ? "ইমেইল করুন →" : "Email →"}
                      </span>
                    </a>
                  </div>
                </div>

              </div>

              {/* RIGHT — Map + Social */}
              <div className="flex flex-col gap-6">

                {/* Map */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 pt-5 pb-3">
                    <h3 className="font-bold text-gray-800 text-base border-l-4 border-[#d4a017] pl-3">
                      {lang === "bn" ? "আমাদের অবস্থান" : "Our Location"}
                    </h3>
                  </div>
                  {contact?.mapUrl ? (
                    <iframe src={contact.mapUrl} className="w-full h-56 border-0" loading="lazy" />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.5!2d90.26363577206088!3d23.862471814067693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUxJzQ0LjkiTiA5MMKwMTUnNDkuMSJF!5e0!3m2!1sen!2sbd!4v1"
                      className="w-full h-56 border-0" loading="lazy"
                    />
                  )}
                  <div className="px-5 py-4">
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                      <MapPin size={12} className="text-[#1a7a4a] mt-0.5 shrink-0" />
                      {lang === "bn"
                        ? "নয়াবাড়ি, সাভার, ঢাকা — ঢাকা–আরিচা মহাসড়কের পাশে"
                        : "Nayabari, Savar, Dhaka — beside Dhaka–Aricha highway"}
                    </p>
                  </div>
                </div>

                {/* Social media */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 text-base border-l-4 border-[#d4a017] pl-3 mb-4">
                    {lang === "bn" ? "সোশ্যাল মিডিয়া" : "Social Media"}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {contact?.socialLinks?.facebook && (
                      <a href={contact.socialLinks.facebook} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1877F2]/5 border border-[#1877F2]/20 hover:bg-[#1877F2]/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                      </a>
                    )}
                    {contact?.socialLinks?.youtube && (
                      <a href={contact.socialLinks.youtube} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF0000]/5 border border-[#FF0000]/20 hover:bg-[#FF0000]/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        <span className="text-sm font-medium text-gray-700">YouTube</span>
                      </a>
                    )}
                    {contact?.socialLinks?.instagram && (
                      <a href={contact.socialLinks.instagram} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-pink-50 border border-pink-100 hover:bg-pink-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/></svg>
                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                      </a>
                    )}
                    {contact?.socialLinks?.whatsapp && (
                      <a href={`https://wa.me/${contact.socialLinks.whatsapp}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366]/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                      </a>
                    )}
                    {!contact?.socialLinks?.facebook && !contact?.socialLinks?.youtube && (
                      <p className="text-sm text-gray-400 text-center py-2">
                        {lang === "bn" ? "শীঘ্রই আসছে..." : "Coming soon..."}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
