import { useState } from "react";
import {
  useListGuru, useCreateGuru, useUpdateGuru, useDeleteGuru,
  getListGuruQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

type GuruForm = {
  nama: string; nip: string; mata_pelajaran: string; jabatan: string;
  foto: string; bio: string; is_active: boolean;
};

const empty: GuruForm = { nama: "", nip: "", mata_pelajaran: "", jabatan: "Guru", foto: "", bio: "", is_active: true };

export default function AdminGuru() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: gurus, isLoading } = useListGuru();
  const create = useCreateGuru();
  const update = useUpdateGuru();
  const del = useDeleteGuru();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<GuruForm>(empty);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = (gurus ?? []).filter(g => !search || g.nama?.toLowerCase().includes(search.toLowerCase()) || g.mata_pelajaran?.toLowerCase().includes(search.toLowerCase()));

  const invalidate = () => qc.invalidateQueries({ queryKey: getListGuruQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (g: any) => {
    setEditing(g.id);
    setForm({ nama: g.nama ?? "", nip: g.nip ?? "", mata_pelajaran: g.mata_pelajaran ?? "", jabatan: g.jabatan ?? "Guru", foto: g.foto ?? "", bio: g.bio ?? "", is_active: !!g.is_active });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editing !== null) {
      update.mutate({ id: editing, data: form }, {
        onSuccess: () => { toast({ title: "Data guru diperbarui" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
      });
    } else {
      create.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Guru ditambahkan" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Guru dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Guru & Staff</h2>
          <p className="text-muted-foreground text-sm">{(gurus ?? []).length} total pendidik</p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0"><Plus size={18} /> Tambah Guru</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Cari nama atau mata pelajaran..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">NIP</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Mapel</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Jabatan</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{g.nama}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{g.nip || "-"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {g.mata_pelajaran && <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">{g.mata_pelajaran}</Badge>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">{g.jabatan}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${g.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {g.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(g)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleting(g.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Belum ada data guru.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Data Guru" : "Tambah Guru Baru"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Nama Lengkap *</label>
              <Input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap dengan gelar..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">NIP</label>
                <Input value={form.nip} onChange={e => setForm(f => ({ ...f, nip: e.target.value }))} placeholder="Nomor Induk Pegawai..." />
              </div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Jabatan</label>
                <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}>
                  {["Kepala Sekolah", "Wakil Kepala Sekolah", "Guru", "Guru BK", "Staff TU"].map(j => <option key={j}>{j}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Mata Pelajaran</label>
              <Input value={form.mata_pelajaran} onChange={e => setForm(f => ({ ...f, mata_pelajaran: e.target.value }))} placeholder="Misal: Matematika, IPA, Bahasa Inggris..." />
            </div>
            <ImageUpload
              label="Foto Guru"
              value={form.foto}
              onChange={url => setForm(f => ({ ...f, foto: url }))}
            />
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Bio Singkat</label>
              <textarea className="w-full h-24 border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Deskripsi singkat tentang guru..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Status Aktif</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Hapus Data Guru?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => deleting !== null && handleDelete(deleting)} disabled={del.isPending}>
              {del.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
