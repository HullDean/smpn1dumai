import { useState } from "react";
import {
  useListBerita, useCreateBerita, useUpdateBerita, useDeleteBerita,
  getListBeritaQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";

type BeritaForm = {
  judul: string; konten: string; gambar: string;
  kategori: string; penulis: string; slug: string; is_published: boolean;
};

const empty: BeritaForm = { judul: "", konten: "", gambar: "", kategori: "Kegiatan", penulis: "Admin", slug: "", is_published: false };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

export default function AdminBerita() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: berita, isLoading } = useListBerita();
  const create = useCreateBerita();
  const update = useUpdateBerita();
  const del = useDeleteBerita();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<BeritaForm>(empty);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = (berita?.data ?? []).filter(b => !search || b.judul?.toLowerCase().includes(search.toLowerCase()));

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBeritaQueryKey() });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (b: any) => {
    setEditing(b.id);
    setForm({ judul: b.judul ?? "", konten: b.konten ?? "", gambar: b.gambar ?? "", kategori: b.kategori ?? "Kegiatan", penulis: b.penulis ?? "Admin", slug: b.slug ?? "", is_published: !!b.is_published });
    setOpen(true);
  };

  const handleSubmit = () => {
    const data = { ...form, slug: form.slug || slugify(form.judul) };
    if (editing !== null) {
      update.mutate({ id: editing, data }, {
        onSuccess: () => { toast({ title: "Berita diperbarui" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal memperbarui", variant: "destructive" }),
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => { toast({ title: "Berita ditambahkan" }); invalidate(); setOpen(false); },
        onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Berita dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  const togglePublish = (b: any) => {
    update.mutate({ id: b.id, data: { judul: b.judul, konten: b.konten, kategori: b.kategori, penulis: b.penulis, is_published: !b.is_published } }, {
      onSuccess: () => { toast({ title: b.is_published ? "Disimpan sebagai draft" : "Diterbitkan" }); invalidate(); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Berita</h2>
          <p className="text-muted-foreground text-sm">{(berita?.data ?? []).length} total berita</p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0"><Plus size={18} /> Tambah Berita</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Cari berita..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Judul</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 hidden lg:table-cell">Penulis</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">{b.judul}</p>
                    {b.gambar && <p className="text-xs text-muted-foreground truncate max-w-xs hidden sm:block">{b.gambar}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">{b.kategori}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">{b.penulis}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(b)} className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${b.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {b.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {b.is_published ? "Publik" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => setDeleting(b.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Belum ada berita.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Judul *</label>
              <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul berita..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Kategori</label>
                <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                  {["Kegiatan", "Prestasi", "Pengumuman", "Akademik"].map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Penulis</label>
                <Input value={form.penulis} onChange={e => setForm(f => ({ ...f, penulis: e.target.value }))} placeholder="Nama penulis..." />
              </div>
            </div>
            <ImageUpload
              label="Gambar Berita"
              value={form.gambar}
              onChange={url => setForm(f => ({ ...f, gambar: url }))}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Konten *</label>
              <textarea
                className="w-full h-48 border border-gray-200 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.konten}
                onChange={e => setForm(f => ({ ...f, konten: e.target.value }))}
                placeholder="Isi konten berita..."
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="published" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Terbitkan langsung</label>
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

      {/* Confirm Delete Dialog */}
      <Dialog open={deleting !== null} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Hapus Berita?</DialogTitle></DialogHeader>
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
