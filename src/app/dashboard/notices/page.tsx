"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { Notice, PaginatedData } from "@/types";
import { PageHeader, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw, Pin, PinOff } from "lucide-react";

const typeBg: Record<string, string> = {
  urgent: "bg-red-100",
  general: "bg-blue-100",
  event: "bg-purple-100",
  prayer: "bg-green-100",
};

const typeIcon: Record<string, string> = {
  urgent: "text-red-700",
  general: "text-blue-700",
  event: "text-purple-700",
  prayer: "text-green-700",
};

type FormValues = {
  title: { en: string; bn: string };
  body: { en: string; bn: string };
  type: "general" | "urgent" | "event" | "prayer";
  pinned: boolean;
  expiresAt?: string;
};

export default function NoticesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<Notice>>({
    queryKey: ["notices-admin", page],
    queryFn: () => api.get(`/notices?page=${page}&limit=10&includeExpired=true`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  const blank: FormValues = { title: { en: "", bn: "" }, body: { en: "", bn: "" }, type: "general", pinned: false };
  const openCreate = () => { setEditItem(null); reset(blank); setDialogOpen(true); };
  const openEdit = (n: Notice) => {
    setEditItem(n);
    reset({ title: n.title, body: n.body, type: n.type, pinned: n.pinned, expiresAt: n.expiresAt?.slice(0, 10) });
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const body = { ...d, expiresAt: d.expiresAt && d.expiresAt !== "" ? new Date(d.expiresAt).toISOString() : undefined };
      return editItem ? api.put(`/notices/${editItem._id}`, body) : api.post("/notices", body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices-admin"] });
      qc.invalidateQueries({ queryKey: ["notices-home"] });
      qc.invalidateQueries({ queryKey: ["notices-dash"] });
      setDialogOpen(false);
      swal.success(editItem ? "Notice Updated!" : "Notice Created!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const togglePin = async (n: Notice) => {
    const action = n.pinned ? "unpin" : "pin";
    const result = await swal.confirm(
      `${n.pinned ? "Unpin" : "Pin"} Notice?`,
      `Are you sure you want to ${action} "${n.title.en}"?`
    );
    if (!result.isConfirmed) return;
    try {
      await api.put(`/notices/${n._id}`, { pinned: !n.pinned });
      qc.invalidateQueries({ queryKey: ["notices-admin"] });
      qc.invalidateQueries({ queryKey: ["notices-home"] });
      swal.success(n.pinned ? "Notice Unpinned!" : "Notice Pinned!");
    } catch {
      swal.error("Failed to update");
    }
  };

  const handleDelete = async (n: Notice) => {
    const result = await swal.confirmDelete(n.title.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/notices/${n._id}`);
      qc.invalidateQueries({ queryKey: ["notices-admin"] });
      qc.invalidateQueries({ queryKey: ["notices-home"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Notices"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Add Notice
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {data?.data.length === 0 && <p className="text-center text-gray-400 py-8">No notices found</p>}
          {data?.data.map((n) => (
            <div key={n._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${typeBg[n.type]}`}>
                <Pin size={16} className={typeIcon[n.type]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 truncate">{n.title.en}</p>
                  {n.pinned && <Pin size={12} className="text-yellow-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                  <Badge className={`${typeBg[n.type]} ${typeIcon[n.type]} text-xs py-0`}>{n.type}</Badge>
                  {n.expiresAt && new Date(n.expiresAt) < new Date()
                    ? <Badge className="bg-red-100 text-red-600 text-xs py-0">Expired</Badge>
                    : n.expiresAt && <><span>·</span><span>Expires {new Date(n.expiresAt).toLocaleDateString()}</span></>
                  }
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => togglePin(n)} title={n.pinned ? "Unpin" : "Pin"}
                  className={n.pinned ? "text-yellow-600 border-yellow-300 hover:bg-yellow-50" : "text-gray-500 hover:bg-gray-50"}>
                  {n.pinned ? <><PinOff size={14} /><span className="ml-1">Unpin</span></> : <><Pin size={14} /><span className="ml-1">Pin</span></>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(n)}><Pencil size={14} /><span className="ml-1">Edit</span></Button>
                <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(n)}><Trash2 size={14} /><span className="ml-1">Delete</span></Button>
              </div>
            </div>
          ))}
          {data?.pagination && (
            <div className="flex justify-between items-center px-1 pt-2 text-sm text-gray-500">
              <span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Notice" : "Add Notice"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <BilingualInput label="Title *" nameEn="title.en" nameBn="title.bn" register={register} />
            <BilingualInput label="Body *" nameEn="body.en" nameBn="body.bn" register={register} textarea />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Controller control={control} name="type" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["general", "urgent", "event", "prayer"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div><Label>Expires At</Label><Input type="date" {...register("expiresAt")} className="mt-1" /></div>
            </div>
            <Controller control={control} name="pinned" render={({ field }) => (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pinned" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-4 h-4 accent-[#1a7a4a]" />
                <Label htmlFor="pinned">Pin this notice</Label>
              </div>
            )} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
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
