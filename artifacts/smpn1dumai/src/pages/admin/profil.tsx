import { useState, useEffect } from "react";
import {
  useGetProfil, useUpdateProfil,
  getGetProfilQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Save } from "lucide-react";

export default function AdminProfil() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: profil, isLoading } = useGetProfil();
  const update = useUpdateProfil();

  const [form, setForm] = useState({
    nama_sekolah: "", npsn: "", alamat: "", telepon: "", email: "",
    website: "", kepala_sekolah: "", foto_kepsek: "", sambutan_kepsek: "",
    visi: "", misi: "", sejarah: "", akreditasi: "", tahun_berdiri: "", logo: ""
  });

  useEffect(() => {
    if (profil) {
      setForm({
        nama_sekolah: profil.nama_sekolah ?? "",
        npsn: profil.npsn ?? "",
        alamat: profil.alamat ?? "",
        telepon: profil.telepon ?? "",
        email: profil.email ?? "",
        website: profil.website ?? "",
        kepala_sekolah: profil.kepala_sekolah ?? "",
        foto_kepsek: profil.foto_kepsek ?? "",
        sambutan_kepsek: profil.sambutan_kepsek ?? "",
        visi: profil.visi ?? "",
        misi: profil.misi ?? "",
        sejarah: profil.sejarah ?? "",
        akreditasi: profil.akreditasi ?? "",
        tahun_berdiri: profil.tahun_berdiri ?? "",
        logo: profil.logo ?? "",
      });
    }
  }, [profil]);

  const handleSave = () => {
    update.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Profil sekolah berhasil disimpan" });
        qc.invalidateQueries({ queryKey: getGetProfilQueryKey() });
      },
      onError: () => toast({ title: "Gagal menyimpan profil", variant: "destructive" }),
    });
  };

  if (isLoading) return (
    <div className="space-y-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
  );

  const Field = ({ label, id, type = "text", textarea = false, rows = 4 }: { label: string; id: keyof typeof form; type?: string; textarea?: boolean; rows?: number }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={form[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
        />
      ) : (
        <Input type={type} value={form[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Profil Sekolah</h2>
          <p className="text-muted-foreground text-sm">Informasi yang ditampilkan di halaman Profil.</p>
        </div>
        <Button onClick={handleSave} disabled={update.isPending} className="gap-2">
          <Save size={18} /> {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-700 text-base border-b pb-2">Identitas Sekolah</h3>
          <Field label="Nama Sekolah" id="nama_sekolah" />
          <Field label="NPSN" id="npsn" />
          <Field label="Akreditasi" id="akreditasi" />
          <Field label="Tahun Berdiri" id="tahun_berdiri" />
          <ImageUpload
            label="Logo Sekolah"
            value={form.logo}
            onChange={url => setForm(f => ({ ...f, logo: url }))}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-700 text-base border-b pb-2">Kontak & Lokasi</h3>
          <Field label="Alamat Lengkap" id="alamat" textarea rows={3} />
          <Field label="Nomor Telepon" id="telepon" />
          <Field label="Email" id="email" type="email" />
          <Field label="Website" id="website" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-700 text-base border-b pb-2">Kepala Sekolah</h3>
          <Field label="Nama Kepala Sekolah" id="kepala_sekolah" />
          <ImageUpload
            label="Foto Kepala Sekolah"
            value={form.foto_kepsek}
            onChange={url => setForm(f => ({ ...f, foto_kepsek: url }))}
          />
          <Field label="Sambutan Kepala Sekolah" id="sambutan_kepsek" textarea rows={6} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-700 text-base border-b pb-2">Visi, Misi & Sejarah</h3>
          <Field label="Visi Sekolah" id="visi" textarea rows={3} />
          <Field label="Misi Sekolah (pisahkan tiap poin dengan baris baru)" id="misi" textarea rows={8} />
          <Field label="Sejarah Sekolah" id="sejarah" textarea rows={5} />
        </div>
      </div>
    </div>
  );
}
