import { useState } from "react";
import {
  useListGaleri, useCreateGaleri, useDeleteGaleri,
  getListGaleriQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, Image } from "lucide-react";

type GaleriForm = { judul: string; gambar: string; kategori: string; deskripsi: string; };
const empty: GaleriForm = { judul: "", gambar: "", kategori: "Kegiatan", deskripsi: "" };
const CATS = ["Kegiatan", "Prestasi", "Fasilitas", "Olahraga", "Sosial", "Pramuka"];

export default function AdminGaleri() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: galeri, isLoading } = useListGaleri();
  const create = useCreateGaleri();
  const del = useDeleteGaleri();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<GaleriForm>(empty);
  const [deleting, setDeleting] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListGaleriQueryKey() });

  const handleSubmit = () => {
    create.mutate({ data: form }, {
      onSuccess: () => { toast({ title: "Foto ditambahkan" }); invalidate(); setOpen(false); setForm(empty); },
      onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Foto dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Galeri</h2>
          <p className="text-muted-foreground text-sm">{(galeri?.data ?? []).length} total foto</p>
        </div>
        <Button onClick={() => { setForm(empty); setOpen(true); }} className="gap-2 shrink-0"><Plus size={18} /> Tambah Foto</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-video rounded-xl" />)}
        </div>
      ) : (galeri?.data ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-white rounded-xl border border-gray-100">
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p>Belum ada foto galeri. Klik tambah foto untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(galeri?.data ?? []).map((g) => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-video shadow-sm">
              {g.gambar ? (
                <img src={g.gambar} alt={g.judul ?? ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Image size={32} className="text-gray-400" /></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <p className="text-white text-sm font-semibold text-center leading-tight">{g.judul}</p>
                <p className="text-gray-300 text-xs">{g.kategori}</p>
                <button onClick={() => setDeleting(g.id)} className="mt-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tambah Foto Galeri</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Judul Foto *</label>
              <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul foto..." />
            </div>
            <ImageUpload
              label="Gambar *"
              value={form.gambar}
              onChange={url => setForm(f => ({ ...f, gambar: url }))}
            />
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Kategori</label>
              <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Deskripsi</label>
              <Input value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} placeholder="Deskripsi singkat foto..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={create.isPending}>
              {create.isPending ? "Menyimpan..." : "Tambah Foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Hapus Foto?</DialogTitle></DialogHeader>
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
