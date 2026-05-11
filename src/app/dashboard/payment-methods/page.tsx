"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { PaymentMethod } from "@/types";
import { PageHeader, ImageUpload, BilingualInput } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

type FormValues = {
  type: "bank" | "mobile_banking" | "cash" | "other";
  provider: { en: string; bn: string };
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  instructions?: { en: string; bn: string };
  isActive: boolean;
  order: number;
};

export default function PaymentMethodsPage() {
  const qc = useQueryClient();
  const [editItem, setEditItem] = useState<PaymentMethod | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);

  const { data: methods = [], isLoading, isFetching, refetch } = useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods-admin"],
    queryFn: () => api.get("/payment-methods/all").then((r) => r.data.data),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>();
  const selectedType = useWatch({ control, name: "type" });

  const blank: FormValues = { type: "bank", provider: { en: "", bn: "" }, isActive: true, order: 0 };
  const openCreate = () => { setEditItem(null); reset(blank); setQrFile(null); setDialogOpen(true); };
  const openEdit = (m: PaymentMethod) => { setEditItem(m); reset(m); setQrFile(null); setDialogOpen(true); };

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      if (qrFile) fd.append("qr", qrFile);
      fd.append("type", d.type);
      fd.append("provider", JSON.stringify(d.provider));
      if (d.instructions) fd.append("instructions", JSON.stringify(d.instructions));
      if (d.accountName) fd.append("accountName", d.accountName);
      if (d.accountNumber) fd.append("accountNumber", d.accountNumber);
      if (d.routingNumber) fd.append("routingNumber", d.routingNumber);
      fd.append("isActive", String(d.isActive));
      fd.append("order", String(d.order));
      return editItem ? api.put(`/payment-methods/${editItem._id}`, fd) : api.post("/payment-methods", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment-methods-admin"] });
      qc.invalidateQueries({ queryKey: ["payment-methods"] });
      setDialogOpen(false);
      swal.success(editItem ? "Updated!" : "Created!");
    },
    onError: () => swal.error("Failed to save"),
  });

  const handleDelete = async (m: PaymentMethod) => {
    const result = await swal.confirmDelete(m.provider.en);
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/payment-methods/${m._id}`);
      qc.invalidateQueries({ queryKey: ["payment-methods-admin"] });
      qc.invalidateQueries({ queryKey: ["payment-methods"] });
      swal.success("Deleted!");
    } catch {
      swal.error("Delete Failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Payment Methods"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button onClick={openCreate} className="bg-[#1a7a4a] hover:bg-[#155f3a]">
              <Plus size={16} className="mr-1" />Add Method
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {methods.length === 0 && (
            <p className="text-center text-gray-400 py-8">No payment methods found</p>
          )}
          {methods.map((m) => (
            <div key={m._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-800 truncate">{m.provider.en}</p>
                  <Badge className={m.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                    {m.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                  <span className="capitalize">{m.type.replace("_", " ")}</span>
                  {m.accountNumber && <><span>·</span><span>{m.accountNumber}</span></>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil size={14} /></Button>
                <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDelete(m)}><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Method" : "Add Method"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <ImageUpload currentUrl={editItem?.qr} onChange={setQrFile} label="QR Code" />
            <div>
              <Label>Type</Label>
              <Controller control={control} name="type" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["bank", "mobile_banking", "cash", "other"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <BilingualInput label="Provider *" nameEn="provider.en" nameBn="provider.bn" register={register} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Account Name</Label><Input {...register("accountName")} className="mt-1" /></div>
              <div><Label>Account Number</Label><Input {...register("accountNumber")} className="mt-1" /></div>
              {selectedType === "bank" && (
                <div><Label>Routing Number</Label><Input {...register("routingNumber")} className="mt-1" /></div>
              )}
              <div><Label>Order</Label><Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1" /></div>
            </div>
            <BilingualInput label="Instructions" nameEn="instructions.en" nameBn="instructions.bn" register={register} textarea />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 accent-[#1a7a4a]" />
              <Label htmlFor="isActive">Active</Label>
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
