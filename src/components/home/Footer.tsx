"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Home, Calendar, BookOpen, Heart, FileText, Shield, LogIn, Newspaper, MessageSquare } from "lucide-react";
import api from "@/lib/axios";
import { ContactInfo } from "@/types";

export function Footer() {
  const { data: contact } = useQuery<ContactInfo>({
    queryKey: ["contact"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
  });

  return (
    <footer className="relative bg-[#1a1a2e] text-white py-10 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="flex flex-col gap-3">
          <Image src="/logo.jpg" alt="Logo" width={100} height={40} className="rounded-md object-cover ring-2 ring-[#1a7a4a]/40" />
          <p className="text-white font-bold text-sm">Nayabari Panch Tara Jame Masjid</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            {contact?.tagline?.en ?? "A place of peace, worship, and community. Serving the local Muslim community with dedication and faith."}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#d4a017]">Menu</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Home size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/#events" className="hover:text-white transition-colors">Events</Link>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/#courses" className="hover:text-white transition-colors">Courses</Link>
            </li>
            <li className="flex items-center gap-2">
              <Heart size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/donate" className="hover:text-white transition-colors">Donate</Link>
            </li>
            <li className="flex items-center gap-2">
              <Newspaper size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#d4a017]">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Shield size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li className="flex items-center gap-2">
              <FileText size={14} className="shrink-0 text-[#d4a017]" />
              <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            </li>
            <li className="flex items-center gap-2">
              <LogIn size={14} className="shrink-0 text-gray-500" />
              <Link href="/login" className="text-gray-500 hover:text-gray-300 transition-colors">Admin Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#d4a017]">Contact Info</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {contact?.address?.en && (
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#d4a017]" />
                {contact.address.en}
              </li>
            )}
            {(contact?.phones?.length ?? 0) > 0 && contact!.phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-[#d4a017]" />
                {p}
              </li>
            ))}
            {contact?.email && (
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-[#d4a017]" />
                {contact.email}
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#d4a017]">Social Media</h4>
          <div className="flex gap-4">
            {contact?.socialLinks?.facebook && (
              <a href={contact.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
            )}
            {contact?.socialLinks?.youtube && (
              <a href={contact.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
            {contact?.socialLinks?.instagram && (
              <a href={contact.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="url(#ig)"><defs><radialGradient id="ig" r="150%" cx="30%" cy="107%"><stop stopColor="#fdf497" offset="0"/><stop stopColor="#fdf497" offset="0.05"/><stop stopColor="#fd5949" offset="0.45"/><stop stopColor="#d6249f" offset="0.6"/><stop stopColor="#285AEB" offset="0.9"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            )}
            {contact?.socialLinks?.whatsapp && (
              <a href={`https://wa.me/${contact.socialLinks.whatsapp}`} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10 text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4 space-y-1">
        <p>© {new Date().getFullYear()} Panch Tara Jame Masjid. All rights reserved.</p>
        <p>
          Designed & Developed by{" "}
          <a
            href="https://www.techgeniuslabs.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#d4a017] hover:text-[#e8b820] transition-colors font-medium"
          >
            Tech Genius Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
