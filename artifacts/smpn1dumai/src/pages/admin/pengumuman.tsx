import { useState } from "react";
import {
  useListPengumuman, useCreatePengumuman, useUpdatePengumuman, useDeletePengumuman,
  getListPengumumanQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Bell } from "lucide-react";

type Form = { judul: string; konten: string; prioritas: number; is_active: boolean; };
const empty: Form = { judul: "", konten: "", prioritas: 1, is_active: true };
const PRIORITY_LABELS: Record<number, string> = { 1: "Biasa", 2: "Penting", 3: "Segera" };
const PRIORITY_COLORS: Record<number, string> = { 1: "bg-gray-100 text-gray-600", 2: "bg-blue-100 text-blue-700", 3: "bg-red-100 text-red-700" };

export default function AdminPengumuman() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: items, isLoading } = useListPengumuman();
  const create = useCreatePengumuman();
  const update = useUpdatePengumuman();
  const del = useDeletePengumuman();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [deleting, setDeleting] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListPengumumanQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p.id);
    setForm({ judul: p.judul ?? "", konten: p.konten ?? "", prioritas: p.prioritas ?? 1, is_active: !!p.is_active });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editing !== null) {
      update.mutate({ id: editing, data: form }, {
        onSuccess: () => { toast({ title: "Pengumuman diperbarui" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
      });
    } else {
      create.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Pengumuman ditambahkan" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Pengumuman dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  const sorted = [...(items ?? [])].sort((a, b) => (b.prioritas ?? 0) - (a.prioritas ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Pengumuman</h2>
          <p className="text-muted-foreground text-sm">{(items ?? []).length} pengumuman</p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0"><Plus size={18} /> Tambah Pengumuman</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Judul</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Prioritas</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{p.judul}</p>
                    {p.konten && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.konten}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${PRIORITY_COLORS[p.prioritas ?? 1]}`}>
                      {PRIORITY_LABELS[p.prioritas ?? 1]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleting(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Belum ada pengumuman.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Pengumuman" : "Tambah Pengumuman"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Judul *</label>
              <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul pengumuman..." />
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Isi Pengumuman</label>
              <textarea className="w-full h-28 border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.konten} onChange={e => setForm(f => ({ ...f, konten: e.target.value }))} placeholder="Isi pengumuman lengkap..." />
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Prioritas</label>
              <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.prioritas} onChange={e => setForm(f => ({ ...f, prioritas: Number(e.target.value) }))}>
                {[1, 2, 3].map(n => <option key={n} value={n}>{PRIORITY_LABELS[n]}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pengumActive" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="pengumActive" className="text-sm font-medium text-gray-700">Tampilkan di ticker</label>
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
          <DialogHeader><DialogTitle>Hapus Pengumuman?</DialogTitle></DialogHeader>
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
