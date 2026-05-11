"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { CommitteeMember, PaginatedData } from "@/types";
import { PageHeader, ImageUpload, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, Users } from "lucide-react";
import Image from "next/image";

type FormValues = {
  name: { en: string; bn: string };
  designation: { en: string; bn: string };
  phone: string;
  tenureStart: string;
  tenureEnd?: string;
};

const blank: FormValues = { name: { en: "", bn: "" }, designation: { en: "", bn: "" }, phone: "", tenureStart: "" };

export default function CommitteePage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<CommitteeMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedData<CommitteeMember>>({
    queryKey: ["committee-admin", page],
    queryFn: () => api.get(`/committee?page=${page}&limit=12`).then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    placeholderData: (prev) => prev,
  });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const openCreate = () => { setEditItem(null); reset(blank); setPhotoFile(null); setDialogOpen(true); };
  const openEdit = (m: CommitteeMember) => {
    setEditItem(m);
    reset({ ...m, tenureStart: m.tenureStart.slice(0, 10), tenureEnd: m.tenureEnd?.slice(0, 10) });
    setPhotoFile(null);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      if (photoFile) fd.append("photo", photoFile);
      fd.append("name", JSON.stringify(d.name));
      fd.append("designation", JSON.stringify(d.designation));
      fd.append("phone", d.phone);
      fd.append("tenureStart", new Date(d.tenureStart).toISOString());
      if (d.tenureEnd) fd.append("tenureEnd", new Date(d.tenureEnd).toISOString());
      return editItem ? api.put(`/committee/${editItem._id}`, fd) : api.post("/committee", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["committee-admin"] });
      qc.invalidateQueries({ queryKey: ["committee-home"] });
      setDialogOpen(false);
      swal.success(editItem ? "Member Updated!" : "Member Added!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const handleDelete = async (m: CommitteeMember) => {
    const result = await swal.confirmDelete(m.name.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/committee/${m._id}`);
      qc.invalidateQueries({ queryKey: ["committee-admin"] });
      qc.invalidateQueries({ queryKey: ["committee-home"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Committee Members"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Add Member
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.data.map((m) => (
            <div key={m._id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="h-32 bg-[#f5f0e8] flex items-center justify-center">
                {m.imageUrl ? (
                  <Image src={m.imageUrl} alt={m.name.en} width={96} height={96} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow flex items-center justify-center">
                    <Users size={30} className="text-[#1a7a4a]/40" />
                  </div>
                )}
              </div>
              <div className="px-3 py-2 text-center">
                <p className="font-bold text-gray-800 text-sm truncate">{m.name.en}</p>
                <p className="text-xs text-[#1a7a4a] font-medium mt-0.5 truncate">{m.designation.en}</p>
                <p className="text-xs text-gray-400">
                  {new Date(m.tenureStart).getFullYear()}
                  {m.tenureEnd ? ` – ${new Date(m.tenureEnd).getFullYear()}` : " – Present"}
                </p>
              </div>
              <div className="flex border-t">
                <button onClick={() => openEdit(m)} className="flex-1 py-1.5 text-xs text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors">
                  <Pencil size={12} />Edit
                </button>
                <button onClick={() => handleDelete(m)} className="flex-1 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center justify-center gap-1 border-l transition-colors">
                  <Trash2 size={12} />Delete
                </button>
              </div>
            </div>
          ))}
          {data?.data.length === 0 && <p className="text-gray-500 col-span-5">No members found.</p>}
        </div>
      )}

      {data?.pagination && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Member" : "Add Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <ImageUpload currentUrl={editItem?.imageUrl} onChange={setPhotoFile} label="Photo" />
            <BilingualInput label="Name *" nameEn="name.en" nameBn="name.bn" register={register} />
            <BilingualInput label="Designation *" nameEn="designation.en" nameBn="designation.bn" register={register} />
            <div><Label>Phone *</Label><Input {...register("phone")} className="mt-1" required /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Tenure Start *</Label><Input type="date" {...register("tenureStart")} className="mt-1" required /></div>
              <div><Label>Tenure End</Label><Input type="date" {...register("tenureEnd")} className="mt-1" /></div>
            </div>
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
