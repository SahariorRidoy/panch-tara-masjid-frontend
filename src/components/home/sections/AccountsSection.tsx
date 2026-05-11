"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { Donation, DonationSummary, PaginatedData } from "@/types";
import { TrendingUp, TrendingDown, Wallet, Calendar, Filter, ChevronLeft, ChevronRight, User, FileText } from "lucide-react";

const CAT_LABELS: Record<string, string> = {
  friday_collection: "Friday Collection", donation: "Donation", zakat: "Zakat",
  sadaqah: "Sadaqah", construction_fund: "Construction Fund", rent: "Rent",
  other_income: "Other Income", salary: "Salary", utility: "Utility",
  maintenance: "Maintenance", construction: "Construction", event: "Event",
  cleaning: "Cleaning", stationery: "Stationery", other_expense: "Other Expense",
};

export function AccountsSection() {
  const now = new Date();
  const [filterMode, setFilterMode] = useState<"month" | "year" | "all">("month");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [tab, setTab] = useState<"all" | "income" | "expense">("all");
  const [page, setPage] = useState(1);

  const buildParams = () => {
    if (filterMode === "month") return `month=${month}&year=${year}`;
    if (filterMode === "year") return `year=${year}`;
    return "";
  };

  const { data: summary } = useQuery<DonationSummary>({
    queryKey: ["donation-summary-home", filterMode, month, year],
    queryFn: () => api.get(`/donations/summary?${buildParams()}`).then((r) => r.data.data),
    staleTime: 30_000,
  });

  const { data: transactions } = useQuery<PaginatedData<Donation>>({
    queryKey: ["donations-home", page, tab, filterMode, month, year],
    queryFn: () => api.get(`/donations?page=${page}&limit=10${tab !== "all" ? `&type=${tab}` : ""}&${buildParams()}`).then((r) => r.data.data),
    staleTime: 30_000,
  });

  const periodData = summary?.period ?? summary?.allTime;
  const topIncome = summary?.categoryBreakdown?.filter((c) => c.type === "income").slice(0, 5) ?? [];
  const topExpense = summary?.categoryBreakdown?.filter((c) => c.type === "expense").slice(0, 5) ?? [];

  return (
    <section className="relative py-10 bg-white overflow-hidden">
      <div className="absolute inset-0 pattern-geometric" />
      <div className="relative z-10 container mx-auto px-4 space-y-8">

        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#1a7a4a] border-l-4 border-[#d4a017] pl-3">
            Financial Transparency
          </h2>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-3"
        >
          <Filter size={15} className="text-gray-400" />
          <div className="flex gap-1.5">
            {(["month", "year", "all"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setFilterMode(m); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === m ? "bg-[#1a7a4a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m === "month" ? "Monthly" : m === "year" ? "Yearly" : "All Time"}
              </button>
            ))}
          </div>

          {filterMode === "month" && (
            <>
              <select
                value={month}
                onChange={(e) => { setMonth(Number(e.target.value)); setPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:border-[#1a7a4a] focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => { setYear(Number(e.target.value)); setPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:border-[#1a7a4a] focus:outline-none"
              >
                {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}

          {filterMode === "year" && (
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); setPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:border-[#1a7a4a] focus:outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Income", value: periodData?.income ?? 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Total Expense", value: periodData?.expense ?? 0, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
            { label: "Balance", value: periodData?.balance ?? 0, icon: Wallet, color: "text-[#1a7a4a]", bg: "bg-teal-50", border: "border-teal-200" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-xl border ${s.border} shadow-sm p-4 flex items-center gap-4`}
            >
              <div className={`${s.bg} p-3 rounded-xl shrink-0`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>৳{s.value.toLocaleString()}</p>
                {filterMode !== "all" && summary?.allTime && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    All-time: ৳{(s.label === "Total Income" ? summary.allTime.income : s.label === "Total Expense" ? summary.allTime.expense : summary.allTime.balance).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Breakdown */}
        {(topIncome.length > 0 || topExpense.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topIncome.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-600" /> Top Income Sources
                </h3>
                <div className="space-y-2">
                  {topIncome.map((c, i) => (
                    <div key={c.category} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                        {CAT_LABELS[c.category] ?? c.category}
                      </span>
                      <span className="font-semibold text-emerald-600">৳{c.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {topExpense.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-500" /> Top Expense Categories
                </h3>
                <div className="space-y-2">
                  {topExpense.map((c, i) => (
                    <div key={c.category} className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                        {CAT_LABELS[c.category] ?? c.category}
                      </span>
                      <span className="font-semibold text-red-500">৳{c.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">Transaction History</h3>
            <div className="flex gap-1.5">
              {(["all", "income", "expense"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    tab === t ? "bg-[#1a7a4a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100">
            {!transactions?.data || transactions.data.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No transactions found for this period</p>
            ) : transactions.data.map((d) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${d.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
                  {d.type === "income"
                    ? <TrendingUp size={15} className="text-emerald-600" />
                    : <TrendingDown size={15} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-base ${d.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                      {d.type === "income" ? "+" : "-"}৳{d.amount.toLocaleString()}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {CAT_LABELS[d.category] ?? d.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {d.paymentMethod}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                    {d.personName && <span className="flex items-center gap-1"><User size={10} />{d.personName}</span>}
                    {d.reference && <span className="flex items-center gap-1"><FileText size={10} />Ref: {d.reference}</span>}
                    <span className="flex items-center gap-1"><Calendar size={10} />{new Date(d.date).toLocaleDateString("en-BD", { dateStyle: "medium" })}</span>
                    {d.note && <span className="italic">&quot;{d.note}&quot;</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {transactions?.pagination && transactions.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
              <span>Page {transactions.pagination.page} of {transactions.pagination.totalPages} ({transactions.pagination.total} total)</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  disabled={page >= transactions.pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a7a4a] text-white hover:bg-[#155f3a] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
