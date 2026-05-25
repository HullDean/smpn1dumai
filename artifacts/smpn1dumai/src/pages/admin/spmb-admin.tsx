import { useState, useEffect } from "react";
import {
  useGetSpmbInfo, useUpdateSpmbInfo,
  getGetSpmbInfoQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function AdminSpmb() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: spmb, isLoading } = useGetSpmbInfo();
  const update = useUpdateSpmbInfo();

  const [form, setForm] = useState({
    judul: "", konten: "", tanggal_buka: "", tanggal_tutup: "",
    kuota: 0, persyaratan: "", link_pendaftaran: "", is_active: true,
  });

  useEffect(() => {
    if (spmb) {
      setForm({
        judul: spmb.judul ?? "",
        konten: spmb.konten ?? "",
        tanggal_buka: spmb.tanggal_buka ?? "",
        tanggal_tutup: spmb.tanggal_tutup ?? "",
        kuota: spmb.kuota ?? 0,
        persyaratan: spmb.persyaratan ?? "",
        link_pendaftaran: spmb.link_pendaftaran ?? "",
        is_active: spmb.is_active ?? true,
      });
    }
  }, [spmb]);

  const handleSave = () => {
    update.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Info SPMB berhasil disimpan" });
        qc.invalidateQueries({ queryKey: getGetSpmbInfoQueryKey() });
      },
      onError: () => toast({ title: "Gagal menyimpan", variant: "destructive" }),
    });
  };

  if (isLoading) return (
    <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Info SPMB</h2>
          <p className="text-muted-foreground text-sm">Informasi Penerimaan Peserta Didik Baru.</p>
        </div>
        <Button onClick={handleSave} disabled={update.isPending} className="gap-2">
          <Save size={18} /> {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Judul SPMB</label>
          <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul halaman SPMB..." />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Informasi Umum</label>
          <textarea rows={4} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.konten} onChange={e => setForm(f => ({ ...f, konten: e.target.value }))} placeholder="Deskripsi umum program SPMB..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Tanggal Buka</label>
            <Input type="date" value={form.tanggal_buka} onChange={e => setForm(f => ({ ...f, tanggal_buka: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Tanggal Tutup</label>
            <Input type="date" value={form.tanggal_tutup} onChange={e => setForm(f => ({ ...f, tanggal_tutup: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Kuota Siswa</label>
            <Input type="number" min={0} value={form.kuota} onChange={e => setForm(f => ({ ...f, kuota: Number(e.target.value) }))} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Link Pendaftaran Online</label>
          <Input value={form.link_pendaftaran} onChange={e => setForm(f => ({ ...f, link_pendaftaran: e.target.value }))} placeholder="https://..." />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Persyaratan Pendaftaran</label>
          <p className="text-xs text-muted-foreground mb-2">Tulis tiap persyaratan pada baris baru. Contoh: "1. Lulusan SD/MI sederajat..."</p>
          <textarea rows={10} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.persyaratan} onChange={e => setForm(f => ({ ...f, persyaratan: e.target.value }))} placeholder="1. Persyaratan pertama&#10;2. Persyaratan kedua&#10;..." />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="spmbActive" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
          <label htmlFor="spmbActive" className="text-sm font-medium text-gray-700">Pendaftaran sedang dibuka</label>
        </div>
      </div>
    </div>
  );
}
