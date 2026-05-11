"use client";
import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export default function ShareButton({ url, title, className = "" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
      } catch {}
    } else {
      setOpen((v) => !v);
    }
  };

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  const encoded = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}&quote=${encodedTitle}`,
    },
    {
      label: "Twitter / X",
      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle size={14} />,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    },
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={handleShare}
        title="Share"
        className="flex items-center gap-2 text-sm font-semibold text-white bg-[#1a7a4a] hover:bg-[#155f3a] active:scale-95 transition-all px-4 py-2 rounded-full shadow-md hover:shadow-lg"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 min-w-[160px]">
          {links.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1a7a4a]/10 hover:text-[#1a7a4a] rounded-xl transition-colors"
            >
              {icon} {label}
            </a>
          ))}
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={copyLink}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1a7a4a]/10 hover:text-[#1a7a4a] rounded-xl transition-colors w-full"
          >
            {copied ? <Check size={15} className="text-[#1a7a4a]" /> : <Link2 size={15} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}
