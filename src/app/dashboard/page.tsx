"use client";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DonationSummary, Event, Course, CommitteeMember, Notice, BlogPost } from "@/types";
import {
  DollarSign, CalendarDays, BookOpen, Users, Bell,
  TrendingUp, TrendingDown, RefreshCw, Newspaper,
  ArrowRight, Clock, Tag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const qc = useQueryClient();

  const results = useQueries({
    queries: [
      {
        queryKey: ["donation-summary"],
        queryFn: () => api.get("/donations/summary").then((r) => r.data.data),
        staleTime: 10_000,
        refetchOnWindowFocus: true,
        refetchInterval: 30_000,
      },
      {
        queryKey: ["events-dash"],
        queryFn: () => api.get("/events?status=upcoming&limit=5").then((r) => r.data.data?.data ?? r.data.data),
        staleTime: 15_000,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["courses-dash"],
        queryFn: () => api.get("/courses?status=active&limit=5").then((r) => r.data.data?.data ?? r.data.data),
        staleTime: 15_000,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["committee-dash"],
        queryFn: () => api.get("/committee?limit=5").then((r) => r.data.data?.data ?? r.data.data),
        staleTime: 30_000,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["notices-dash"],
        queryFn: () => api.get("/notices?pinned=true&limit=5").then((r) => r.data.data?.data ?? r.data.data),
        staleTime: 15_000,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["blog-dash"],
        queryFn: () => api.get("/blog?all=true&limit=5").then((r) => r.data.data?.data ?? r.data.data),
        staleTime: 15_000,
        refetchOnWindowFocus: true,
      },
    ],
  });

  const isAnyFetching = results.some((r) => r.isFetching);
  const refetchAll = () => { results.forEach((r) => r.refetch()); qc.invalidateQueries(); };

  const summary = results[0].data as DonationSummary | undefined;
  const events   = (results[1].data ?? []) as Event[];
  const courses  = (results[2].data ?? []) as Course[];
  const members  = (results[3].data ?? []) as CommitteeMember[];
  const notices  = (results[4].data ?? []) as Notice[];
  const blogs    = (results[5].data ?? []) as BlogPost[];

  const financeCards = [
    { label: "Total Income",  value: `৳${(summary?.allTime?.income  ?? 0).toLocaleString()}`, icon: TrendingUp,   color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200" },
    { label: "Total Expense", value: `৳${(summary?.allTime?.expense ?? 0).toLocaleString()}`, icon: TrendingDown, color: "text-red-500",     bg: "bg-red-50",      border: "border-red-200"     },
    { label: "Balance",       value: `৳${(summary?.allTime?.balance ?? 0).toLocaleString()}`, icon: DollarSign,   color: "text-[#1a7a4a]",  bg: "bg-teal-50",     border: "border-teal-200"    },
  ];

  const countCards = [
    { label: "Upcoming Events",    value: events.length,  icon: CalendarDays, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   href: "/dashboard/events"    },
    { label: "Active Courses",     value: courses.length, icon: BookOpen,     color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", href: "/dashboard/courses"   },
    { label: "Committee Members",  value: members.length, icon: Users,        color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", href: "/dashboard/committee" },
    { label: "Blog Posts",         value: blogs.length,   icon: Newspaper,    color: "text-pink-600",   bg: "bg-pink-50",   border: "border-pink-200",   href: "/dashboard/blog"      },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5">Welcome back — here's what's happening</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetchAll} disabled={isAnyFetching}>
          <RefreshCw size={14} className={`mr-1.5 ${isAnyFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Finance Cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Finance</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {financeCards.map((s) => (
            <div key={s.label} className={`bg-white rounded-xl p-4 shadow-sm border ${s.border} flex items-center gap-4`}>
              <div className={`${s.bg} p-3 rounded-xl shrink-0`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-800 truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Count Cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {countCards.map((s) => (
            <Link key={s.label} href={s.href} className={`bg-white rounded-xl p-4 shadow-sm border ${s.border} flex flex-col gap-3 hover:shadow-md transition-shadow group`}>
              <div className={`${s.bg} p-2.5 rounded-lg w-fit`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
              <span className={`text-xs ${s.color} flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>
                View all <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-blue-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Upcoming Events</h2>
            </div>
            <Link href="/dashboard/events" className="text-xs text-[#1a7a4a] hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y">
            {events.length === 0
              ? <p className="text-sm text-gray-400 px-5 py-6 text-center">No upcoming events</p>
              : events.slice(0, 5).map((e) => (
                <div key={e._id} className="flex justify-between items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 truncate">{e.title.en}</span>
                  <span className="text-xs text-gray-400 ml-2 shrink-0 flex items-center gap-1">
                    <Clock size={10} />{new Date(e.date).toLocaleDateString("en-BD", { dateStyle: "medium" })}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Pinned Notices */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-amber-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Pinned Notices</h2>
            </div>
            <Link href="/dashboard/notices" className="text-xs text-[#1a7a4a] hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y">
            {notices.length === 0
              ? <p className="text-sm text-gray-400 px-5 py-6 text-center">No pinned notices</p>
              : notices.slice(0, 5).map((n) => (
                <div key={n._id} className="flex items-center gap-2.5 px-5 py-3 text-sm hover:bg-gray-50 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.type === "urgent" ? "bg-red-500" : n.type === "prayer" ? "bg-green-500" : "bg-blue-400"}`} />
                  <span className="text-gray-700 truncate">{n.title.en}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Newspaper size={15} className="text-pink-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Recent Blog Posts</h2>
            </div>
            <Link href="/dashboard/blog" className="text-xs text-[#1a7a4a] hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y">
            {blogs.length === 0
              ? <p className="text-sm text-gray-400 px-5 py-6 text-center">No blog posts yet</p>
              : blogs.slice(0, 5).map((b) => (
                <div key={b._id} className="flex justify-between items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${b.isActive ? "bg-emerald-500" : "bg-gray-300"}`} />
                    <span className="text-gray-700 truncate">{b.title.en}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 shrink-0 flex items-center gap-1">
                    <Tag size={10} />{b.category.en}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-purple-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Active Courses</h2>
            </div>
            <Link href="/dashboard/courses" className="text-xs text-[#1a7a4a] hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y">
            {courses.length === 0
              ? <p className="text-sm text-gray-400 px-5 py-6 text-center">No active courses</p>
              : courses.slice(0, 5).map((c) => (
                <div key={c._id} className="flex justify-between items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 truncate">{c.title.en}</span>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">{c.schedule?.days?.en}</span>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
