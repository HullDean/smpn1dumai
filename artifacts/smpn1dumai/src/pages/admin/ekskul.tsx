import { useState } from "react";
import {
  useListEkskul, useCreateEkskul, useUpdateEkskul, useDeleteEkskul,
  getListEkskulQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Form = { nama: string; deskripsi: string; pembina: string; jadwal: string; gambar: string; is_active: boolean; };
const empty: Form = { nama: "", deskripsi: "", pembina: "", jadwal: "", gambar: "", is_active: true };

export default function AdminEkskul() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: items, isLoading } = useListEkskul();
  const create = useCreateEkskul();
  const update = useUpdateEkskul();
  const del = useDeleteEkskul();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [deleting, setDeleting] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListEkskulQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (e: any) => {
    setEditing(e.id);
    setForm({ nama: e.nama ?? "", deskripsi: e.deskripsi ?? "", pembina: e.pembina ?? "", jadwal: e.jadwal ?? "", gambar: e.gambar ?? "", is_active: !!e.is_active });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editing !== null) {
      update.mutate({ id: editing, data: form }, {
        onSuccess: () => { toast({ title: "Ekskul diperbarui" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
      });
    } else {
      create.mutate({ data: form }, {
        onSuccess: () => { toast({ title: "Ekskul ditambahkan" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Ekskul dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Ekstrakurikuler</h2>
          <p className="text-muted-foreground text-sm">{(items ?? []).length} ekskul terdaftar</p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0"><Plus size={18} /> Tambah Ekskul</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nama Ekskul</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Pembina</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Jadwal</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm">{e.nama}</p>
                    {e.deskripsi && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{e.deskripsi}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{e.pembina || "-"}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">{e.jadwal || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${e.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {e.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleting(e.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(items ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Belum ada data ekskul.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Ekskul" : "Tambah Ekskul Baru"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Nama Ekskul *</label>
              <Input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama ekstrakurikuler..." />
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Deskripsi</label>
              <textarea className="w-full h-24 border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi singkat ekskul..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Pembina</label>
                <Input value={form.pembina} onChange={e => setForm(f => ({ ...f, pembina: e.target.value }))} placeholder="Nama pembina..." />
              </div>
              <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Jadwal</label>
                <Input value={form.jadwal} onChange={e => setForm(f => ({ ...f, jadwal: e.target.value }))} placeholder="Senin, 14.00-16.00..." />
              </div>
            </div>
            <ImageUpload
              label="Gambar Ekskul"
              value={form.gambar}
              onChange={url => setForm(f => ({ ...f, gambar: url }))}
            />
            <div className="flex items-center gap-3">
              <input type="checkbox" id="ekskulActive" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="ekskulActive" className="text-sm font-medium text-gray-700">Status Aktif</label>
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
          <DialogHeader><DialogTitle>Hapus Ekskul?</DialogTitle></DialogHeader>
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
