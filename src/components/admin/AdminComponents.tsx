"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors, Path, FieldValues } from "react-hook-form";
import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface BilingualInputProps<T extends FieldValues> {
  label: string;
  nameEn: Path<T>;
  nameBn: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  textarea?: boolean;
}

export function BilingualInput<T extends FieldValues>({
  label, nameEn, nameBn, register, errors, textarea,
}: BilingualInputProps<T>) {
  const Comp = textarea ? Textarea : Input;
  const textareaClass = textarea ? "h-28 resize-none overflow-y-auto" : "";
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">English</Label>
          <Comp {...register(nameEn)} placeholder="English..." className={textareaClass} />
          {errors?.[nameEn] && (
            <p className="text-xs text-red-500 mt-0.5">
              {String((errors[nameEn] as { message?: string })?.message ?? "")}
            </p>
          )}
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">বাংলা</Label>
          <Comp {...register(nameBn)} placeholder="বাংলা..." className={textareaClass} />
          {errors?.[nameBn] && (
            <p className="text-xs text-red-500 mt-0.5">
              {String((errors[nameBn] as { message?: string })?.message ?? "")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
      {action}
    </div>
  );
}

export function ImageUpload({
  currentUrl, onChange, label = "Image",
}: { currentUrl?: string; onChange: (file: File | null) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const src = preview ?? currentUrl;

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-3">
        {src && (
          <div className="relative w-56 h-20 rounded-lg overflow-hidden border">
            <Image src={src} alt="preview" fill className="object-contain" />
            <button
              type="button"
              onClick={() => { setPreview(null); onChange(null); }}
              className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 text-white"
            >
              <X size={10} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors"
        >
          <Upload size={16} />
          {src ? "Change" : "Upload"}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

export function MultiImageUpload({
  currentUrls = [],
  onChange,
  label = "Images",
  max = 10,
}: {
  currentUrls?: string[];
  onChange: (files: File[]) => void;
  label?: string;
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ url: string; file?: File }[]>(
    currentUrls.map((url) => ({ url }))
  );

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const next = [
      ...previews,
      ...selected.map((f) => ({ url: URL.createObjectURL(f), file: f })),
    ].slice(0, max);
    setPreviews(next);
    onChange(next.filter((p) => p.file).map((p) => p.file!));
    e.target.value = "";
  };

  const remove = (idx: number) => {
    const next = previews.filter((_, i) => i !== idx);
    setPreviews(next);
    onChange(next.filter((p) => p.file).map((p) => p.file!));
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {previews.map((p, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
            <Image src={p.url} alt={`img-${i}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {previews.length < max && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-[#1a7a4a] hover:text-[#1a7a4a] transition-colors text-xs gap-1"
          >
            <Upload size={16} />
            Add
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      <p className="text-xs text-gray-400">{previews.length}/{max} images</p>
    </div>
  );
}
