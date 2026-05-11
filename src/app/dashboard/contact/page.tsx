"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import swal from "@/lib/swal";
import { ContactInfo } from "@/types";
import { BilingualInput, ImageUpload, PageHeader } from "@/components/admin/AdminComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save, Phone, Mail, Link2, MapPin, Plus, X } from "lucide-react";

type FormValues = Omit<ContactInfo, "phones"> & { phones: { value: string }[] };

export default function ContactPage() {
  const qc = useQueryClient();
  const [logo, setLogo] = useState<File | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<ContactInfo>({
    queryKey: ["contact-admin"],
    queryFn: () => api.get("/contact").then((r) => r.data.data),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { phones: [{ value: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "phones" });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        phones: data.phones?.length
          ? data.phones.map((p) => ({ value: p }))
          : [{ value: "" }],
      });
    }
  }, [data, reset]);

  const save = useMutation({
    mutationFn: (d: FormValues) => {
      const fd = new FormData();
      if (logo) fd.append("logo", logo);
      fd.append("address", JSON.stringify(d.address));
      fd.append("phones", JSON.stringify(d.phones.map((p) => p.value).filter(Boolean)));
      if (d.email) fd.append("email", d.email);
      if (d.socialLinks) fd.append("socialLinks", JSON.stringify(d.socialLinks));
      return api.put("/contact", fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contact-admin"] });
      qc.invalidateQueries({ queryKey: ["contact"] });
      swal.success("Contact Info Saved!");
    },
    onError: () => swal.error("Failed to save"),
  });

  if (isLoading) return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-6 max-w-2xl">
      <PageHeader
        title="Contact & Info"
        action={
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </Button>
            <Button type="submit" size="sm" disabled={save.isPending} className="bg-[#1a7a4a] hover:bg-[#155f3a] gap-1.5">
              <Save size={14} />
              {save.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {/* Logo */}
        <ImageUpload currentUrl={data?.logoUrl} onChange={setLogo} label="Masjid Logo" />

        <hr className="border-gray-100" />

        {/* Address */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <MapPin size={12} /> Full Address
          </Label>
          <BilingualInput label="" nameEn="address.en" nameBn="address.bn" register={register} />
        </div>

        <hr className="border-gray-100" />

        {/* Phone Numbers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Phone size={12} /> Phone Numbers
            </Label>
            {fields.length < 4 && (
              <Button type="button" size="sm" variant="outline" onClick={() => append({ value: "" })} className="h-7 text-xs gap-1">
                <Plus size={12} /> Add
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    {...register(`phones.${i}.value`)}
                    className="pl-9"
                    placeholder={`Phone ${i + 1} — +880 1XXX-XXXXXX`}
                  />
                </div>
                {fields.length > 1 && (
                  <Button type="button" size="sm" variant="outline" onClick={() => remove(i)} className="text-red-500 hover:bg-red-50 shrink-0 h-9 w-9 p-0">
                    <X size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">{fields.length}/4 phone numbers</p>
        </div>

        <hr className="border-gray-100" />

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Mail size={12} /> Email
          </Label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input {...register("email")} type="email" className="pl-9" placeholder="info@masjid.com" />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Social Links */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Link2 size={12} /> Facebook
            </Label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
              <Input {...register("socialLinks.facebook")} className="pl-9" placeholder="https://facebook.com/..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Link2 size={12} /> YouTube
            </Label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
              <Input {...register("socialLinks.youtube")} className="pl-9" placeholder="https://youtube.com/@..." />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
