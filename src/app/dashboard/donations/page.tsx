"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { Donation, DonationSummary, PaginatedData, DonationCategory, PaymentMethodType } from "@/types";
import { PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Pencil, Trash2, RefreshCw, TrendingUp, TrendingDown, DollarSign,
  Calendar, Filter, User, FileText, ChevronLeft, ChevronRight,
} from "lucide-react";

const INCOME_CATEGORIES: { value: DonationCategory; label: string }[] = [
  { value: "friday_collection", label: "Friday Collection" },
  { value: "donation", label: "Donation" },
  { value: "zakat", label: "Zakat" },
  { value: "sadaqah", label: "Sadaqah" },
  { value: "construction_fund", label: "Construction Fund" },
  { value: "rent", label: "Rent" },
  { value: "other_income", label: "Other Income" },
];

const EXPENSE_CATEGORIES: { value: DonationCategory; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "utility", label: "Utility" },
  { value: "maintenance", label: "Maintenance" },
  { value: "construction", label: "Construction" },
  { value: "event", label: "Event" },
  { value: "cleaning", label: "Cleaning" },
  { value: "stationery", label: "Stationery" },
  { value: "other_expense", label: "Other Expense" },
];

const PAYMENT_METHODS: { value: PaymentMethodType; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

type FormValues = {
  type: "income" | "expense";
  amount: number;
  category: DonationCategory;
  paymentMethod: PaymentMethodType;
  personName?: string;
  reference?: string;
  note?: string;
  date: string;
};

const getCategoryLabel = (cat: string) =>
  [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find((c) => c.value === cat)?.label ?? cat;

const getPaymentLabel = (pm: string) =>
  PAYMENT_METHODS.find((p) => p.value === pm)?.label ?? pm;

export default function DonationsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"all" | "income" | "expense">("all");
  const [editItem, setEditItem] = useState<Donation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const now = new Date();
  const [filterMode, setFilterMode] = useState<"month" | "year" | "custom">("month");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildParams = () => {
    if (filterMode === "month") return `month=${month}&year=${year}`;
    if (filterMode === "year") return `year=${year}`;
    if (filterMode === "custom" && startDate && endDate) return `startDate=${startDate}&endDate=${endDate}`;
    return `month=${month}&year=${year}`;
  };

  const summaryParams = buildParams();
  const listParams = `page=${page}&limit=10${tab !== "all" ? `&type=${tab}` : ""}&${buildParams()}`;

  const { data: summary, refetch: refetchSummary } = useQuery<DonationSummary>({
    queryKey: ["donation-summary", filterMode, month, year, startDate, endDate],
    queryFn: () => api.get(`/donations/summary?${summaryParams}`).then((r) => r.data.data),
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<Donation>>({
    queryKey: ["donations-admin", page, tab, filterMode, month, year, startDate, endDate],
    queryFn: () => api.get(`/donations?${listParams}`).then((r) => r.data.data),
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset, control, watch, setValue } = useForm<FormValues>();
  const watchedType = watch("type", "income");

  const blank: FormValues = {
    type: "income",
    amount: 0,
    category: "donation",
    paymentMethod: "cash",
    date: new Date().toISOString().slice(0, 10),
  };

  const openCreate = () => {
    setEditItem(null);
    reset(blank);
    setDialogOpen(true);
  };

  const openEdit = (d: Donation) => {
    setEditItem(d);
    reset({ ...d, date: d.date.slice(0, 10) });
    setDialogOpen(true);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["donations-admin"] });
    qc.invalidateQueries({ queryKey: ["donation-summary"] });
  };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const body = { ...d, date: new Date(d.date).toISOString() };
      return editItem ? api.put(`/donations/${editItem._id}`, body) : api.post("/donations", body);
    },
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      swal.success(editItem ? "Entry Updated!" : "Entry Added!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const handleDelete = async (d: Donation) => {
    const result = await swal.confirmDelete(`${d.type} — ৳${d.amount}`);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/donations/${d._id}`);
      invalidate();
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  const handleRefetch = () => {
    refetch();
    refetchSummary();
  };

  const handleTabChange = (v: string) => {
    setTab(v as typeof tab);
    setPage(1);
  };

  const topIncome = summary?.categoryBreakdown
    .filter((c) => c.type === "income")
    .slice(0, 3) ?? [];
  const topExpense = summary?.categoryBreakdown
    .filter((c) => c.type === "expense")
    .slice(0, 3) ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Accounts & Ledger"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefetch} disabled={isFetching}>
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a] gap-1.5">
              <Plus size={15} /> Add Entry
            </Button>
          </div>
        }
      />

      {/* Period Filter */}
      <div className="bg-white rounded-xl border shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-gray-400" />
          <Label className="text-xs font-semibold text-gray-500 uppercase">Filter By:</Label>
          <Select value={filterMode} onValueChange={(v) => { if (v) { setFilterMode(v as typeof filterMode); setPage(1); } }}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filterMode === "month" && (
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-xs text-gray-500">Select Month & Year:</Label>
            <Select value={String(month)} onValueChange={(v) => { setMonth(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {new Date(0, i).toLocaleString("en", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(v) => { setYear(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterMode === "year" && (
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-xs text-gray-500">Select Year:</Label>
            <Select value={String(year)} onValueChange={(v) => { setYear(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterMode === "custom" && (
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-xs text-gray-500">From:</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-36 h-8 text-xs"
            />
            <Label className="text-xs text-gray-500">To:</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-36 h-8 text-xs"
            />
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Income (Period)", value: summary.period.income, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Expense (Period)", value: summary.period.expense, icon: TrendingDown, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
            { label: "Balance (Period)", value: summary.period.balance, icon: DollarSign, color: "text-[#1a7a4a]", bg: "bg-teal-50", border: "border-teal-200" },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-xl p-4 border ${s.border} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`${s.bg} p-2.5 rounded-lg`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">৳{s.value.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">
                All-time: ৳{(s.label.includes("Income") ? summary.allTime.income : s.label.includes("Expense") ? summary.allTime.expense : summary.allTime.balance).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      {summary && (topIncome.length > 0 || topExpense.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-600" /> Top Income Sources
            </h3>
            <div className="space-y-2">
              {topIncome.map((c) => (
                <div key={c.category} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{getCategoryLabel(c.category)}</span>
                  <span className="font-semibold text-emerald-600">৳{c.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingDown size={14} className="text-red-500" /> Top Expense Categories
            </h3>
            <div className="space-y-2">
              {topExpense.map((c) => (
                <div key={c.category} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{getCategoryLabel(c.category)}</span>
                  <span className="font-semibold text-red-500">৳{c.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="bg-white border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ledger List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.length === 0 && (
            <p className="text-center text-gray-400 py-12 bg-white rounded-xl border">
              No entries found for this period
            </p>
          )}
          {data?.data.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${d.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
                {d.type === "income" ? (
                  <TrendingUp size={18} className="text-emerald-600" />
                ) : (
                  <TrendingDown size={18} className="text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold text-lg ${d.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {d.type === "income" ? "+" : "-"}৳{d.amount.toLocaleString()}
                  </span>
                  <Badge className={d.type === "income" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-red-100 text-red-600 text-xs"}>
                    {getCategoryLabel(d.category)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getPaymentLabel(d.paymentMethod)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                  {d.personName && (
                    <span className="flex items-center gap-1">
                      <User size={10} /> {d.personName}
                    </span>
                  )}
                  {d.reference && (
                    <span className="flex items-center gap-1">
                      <FileText size={10} /> Ref: {d.reference}
                    </span>
                  )}
                  {d.note && <span className="italic">&quot;{d.note}&quot;</span>}
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> {new Date(d.date).toLocaleDateString("en-BD", { dateStyle: "medium" })}
                  </span>
                  {d.createdBy && <span className="text-gray-400">by {d.createdBy.name}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(d)}>
                  <Pencil size={13} />
                </Button>
                <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(d)}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-1 pt-2 text-sm text-gray-500">
              <span>
                Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Entry" : "Add New Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <div>
              <Label>Type *</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => {
                    field.onChange(v);
                    // reset category to a valid default for the new type
                    setValue("category", v === "income" ? "donation" : "salary");
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount (৳) *</Label>
                <Input type="number" {...register("amount", { valueAsNumber: true })} className="mt-1" required />
              </div>
              <div>
                <Label>Category *</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(watchedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div>
              <Label>Payment Method *</Label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>{watchedType === "income" ? "Donor Name" : "Paid To"}</Label>
              <Input {...register("personName")} placeholder="Optional" className="mt-1" />
            </div>
            <div>
              <Label>Reference No.</Label>
              <Input {...register("reference")} placeholder="Bank/Mobile ref" className="mt-1" />
            </div>
            <div>
              <Label>Note</Label>
              <Input {...register("note")} className="mt-1" />
            </div>
            <div>
              <Label>Date *</Label>
              <Input type="date" {...register("date")} className="mt-1" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1a7a4a] hover:bg-[#155f3a]" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
