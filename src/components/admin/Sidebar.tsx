"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearUser } from "@/store/authSlice";
import api from "@/lib/axios";
import {
  LayoutDashboard, Image, Phone, Megaphone, CalendarDays,
  BookOpen, Users, Bell, DollarSign, CreditCard, ImageIcon,
  FileText, UserCog, KeyRound, LogOut, ChevronDown, Newspaper,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Website", icon: null, children: [
      { label: "Marquee", href: "/dashboard/marquee", icon: Megaphone },
      { label: "Hero Carousel", href: "/dashboard/hero", icon: Image },
      { label: "Contact & Info", href: "/dashboard/contact", icon: Phone },
      // { label: "Jumu'ah Times", href: "/dashboard/jumah", icon: Star },
    ],
  },
  {
    label: "Content", icon: null, children: [
      { label: "Events", href: "/dashboard/events", icon: CalendarDays },
      { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
      { label: "Committee", href: "/dashboard/committee", icon: Users },
      { label: "Notices", href: "/dashboard/notices", icon: Bell },
      { label: "Blog", href: "/dashboard/blog", icon: Newspaper },
    ],
  },
  {
    label: "Finance", icon: null, children: [
      { label: "Donations", href: "/dashboard/donations", icon: DollarSign },
      { label: "Payment Methods", href: "/dashboard/payment-methods", icon: CreditCard },
    ],
  },
  {
    label: "Files", icon: null, children: [
      { label: "Media Gallery", href: "/dashboard/media", icon: ImageIcon },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
    ],
  },
  {
    label: "System", icon: null, adminOnly: true, children: [
      { label: "Users", href: "/dashboard/users", icon: UserCog, adminOnly: true },
      { label: "Change Password", href: "/dashboard/settings", icon: KeyRound },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSettled: () => {
      localStorage.clear();
      document.cookie = "accessToken=; Max-Age=0; path=/";
      dispatch(clearUser());
      router.push("/login");
      toast.success("Logged out");
    },
  });

  const toggle = (label: string) => setCollapsed((p) => ({ ...p, [label]: !p[label] }));

  return (
    <aside className="flex flex-col h-full bg-[#1a1a2e] text-white w-64">
      <div className="flex items-center justify-center py-4 border-b border-white/10">
        <NextImage src="/logo.jpg" alt="Masjid Logo" width={200} height={60} className="object-contain" priority />
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menu.map((item) => {
          if ((item as { adminOnly?: boolean }).adminOnly && user?.role !== "admin") return null;

          if (!item.children) {
            return (
              <Link key={item.href} href={item.href!}
                onClick={onClose}
                className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === item.href ? "bg-[#1a7a4a] text-white" : "text-gray-300 hover:bg-white/10"
                )}>
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          }

          const isOpen = collapsed[item.label] !== false;
          return (
            <div key={item.label}>
              <button onClick={() => toggle(item.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-200 transition-colors">
                {item.label}
                <ChevronDown size={14} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
              </button>
              {isOpen && (
                <div className="space-y-0.5 ml-1">
                  {item.children.map((child) => {
                    if ((child as { adminOnly?: boolean }).adminOnly && user?.role !== "admin") return null;
                    return (
                      <Link key={child.href} href={child.href}
                        onClick={onClose}
                        className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === child.href ? "bg-[#1a7a4a] text-white" : "text-gray-300 hover:bg-white/10"
                        )}>
                        <child.icon size={15} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="w-7 h-7 rounded-full bg-[#1a7a4a] flex items-center justify-center text-xs font-bold">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => logout()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
