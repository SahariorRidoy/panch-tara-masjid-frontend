"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { CommitteeMember } from "@/types";
import { Users } from "lucide-react";

export { DonationSection } from "./DonationSection";
export { Footer } from "./Footer";

export function CommitteeSection() {
  const { data: members = [] } = useQuery<CommitteeMember[]>({
    queryKey: ["committee-home"],
    queryFn: () => api.get("/committee?limit=3").then((r) => r.data.data?.data ?? r.data.data),
  });

  return (
    <section id="committee" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1a7a4a] mb-6 text-center">Our Committee</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {members.map((m) => (
            <div key={m._id} className="flex flex-col items-center gap-2 w-36">
              {m.imageUrl ? (
                <Image src={m.imageUrl} alt={m.name.en} width={72} height={72} className="w-18 h-18 rounded-full object-cover border-2 border-[#1a7a4a]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#f5f0e8] flex items-center justify-center border-2 border-[#1a7a4a]">
                  <Users size={28} className="text-[#1a7a4a]/50" />
                </div>
              )}
              <p className="font-semibold text-sm text-center text-gray-800">{m.name.en}</p>
              <p className="text-xs text-gray-500 text-center">{m.designation.en}</p>
            </div>
          ))}
          {members.length === 0 && <p className="text-gray-500">No committee members found.</p>}
        </div>
        <div className="mt-6 text-center">
          <Link href="/committee" className="inline-block border border-[#1a7a4a] text-[#1a7a4a] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1a7a4a] hover:text-white transition-colors">
            View Full Committee
          </Link>
        </div>
      </div>
    </section>
  );
}
