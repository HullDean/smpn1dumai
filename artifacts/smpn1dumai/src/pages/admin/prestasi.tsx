import { useState } from "react";
import {
  useListPrestasi, useCreatePrestasi, useUpdatePrestasi, useDeletePrestasi,
  getListPrestasiQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Trophy } from "lucide-react";

type Form = { judul: string; deskripsi: string; tanggal: string; tingkat: string; kategori: string; };
const empty: Form = { judul: "", deskripsi: "", tanggal: "", tingkat: "Kota", kategori: "Akademik" };

export default function AdminPrestasi() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: items, isLoading } = useListPrestasi();
  const create = useCreatePrestasi();
  const update = useUpdatePrestasi();
  const del = useDeletePrestasi();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [deleting, setDeleting] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListPrestasiQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p.id);
    setForm({ judul: p.judul ?? "", deskripsi: p.deskripsi ?? "", tanggal: p.tanggal ?? "", tingkat: p.tingkat ?? "Kota", kategori: p.kategori ?? "Akademik" });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editing !== null) {
      update.mutate({ id: editing, data: form }, {
        onSuccess: () => { toast({ title: "Prestasi diperbarui" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
      });
    } else {
      create.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Prestasi ditambahkan" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Prestasi dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Prestasi</h2>
          <p className="text-muted-foreground text-sm">{(items ?? []).length} prestasi tercatat</p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0"><Plus size={18} /> Tambah Prestasi</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Prestasi</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Tingkat</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Tanggal</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{p.judul}</p>
                    {p.deskripsi && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.deskripsi}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge className="bg-primary/10 text-primary text-xs border-0">{p.tingkat}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{p.kategori}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">
                    {p.tanggal ? new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleting(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(items ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Belum ada data prestasi.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Prestasi" : "Tambah Prestasi Baru"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Judul Prestasi *</label>
              <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Misal: Juara 1 Olimpiade Matematika..." />
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Deskripsi</label>
              <textarea className="w-full h-24 border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi singkat prestasi..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Tingkat</label>
                <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.tingkat} onChange={e => setForm(f => ({ ...f, tingkat: e.target.value }))}>
                  {["Kota", "Provinsi", "Nasional", "Internasional"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Kategori</label>
                <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                  {["Akademik", "Non-Akademik", "Sekolah"].map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Tanggal</label>
              <Input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
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
          <DialogHeader><DialogTitle>Hapus Prestasi?</DialogTitle></DialogHeader>
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
