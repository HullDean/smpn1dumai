import { useState } from "react";
import {
  useListSlider, useCreateSlider, useDeleteSlider,
  getListSliderQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, Image } from "lucide-react";

type Form = { judul: string; subjudul: string; gambar: string; urutan: number; is_active: boolean; };
const empty: Form = { judul: "", subjudul: "", gambar: "", urutan: 1, is_active: true };

export default function AdminSlider() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: items, isLoading } = useListSlider();
  const create = useCreateSlider();
  const del = useDeleteSlider();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [deleting, setDeleting] = useState<number | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: getListSliderQueryKey() });

  const handleSubmit = () => {
    create.mutate({ data: form }, {
      onSuccess: () => { toast({ title: "Slide ditambahkan" }); invalidate(); setOpen(false); setForm(empty); },
      onError: () => toast({ title: "Gagal menambahkan", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number) => {
    del.mutate({ id }, {
      onSuccess: () => { toast({ title: "Slide dihapus" }); invalidate(); setDeleting(null); },
      onError: () => toast({ title: "Gagal menghapus", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Slider Homepage</h2>
          <p className="text-muted-foreground text-sm">{(items ?? []).length} slide aktif</p>
        </div>
        <Button onClick={() => { setForm({ ...empty, urutan: (items?.length ?? 0) + 1 }); setOpen(true); }} className="gap-2 shrink-0">
          <Plus size={18} /> Tambah Slide
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}</div>
      ) : (items ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-white rounded-xl border border-gray-100">
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p>Belum ada slide. Tambahkan slide pertama.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...(items ?? [])].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0)).map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex gap-0">
              <div className="w-48 h-36 shrink-0 bg-gray-100 relative">
                {slide.gambar ? (
                  <img src={slide.gambar} alt={slide.judul ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image size={32} className="text-gray-300" /></div>
                )}
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow">
                  {slide.urutan}
                </div>
              </div>
              <div className="flex-1 p-5">
                <h3 className="font-bold text-gray-800 mb-1">{slide.judul}</h3>
                {slide.subjudul && <p className="text-sm text-muted-foreground line-clamp-2">{slide.subjudul}</p>}
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${slide.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {slide.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <button onClick={() => setDeleting(slide.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tambah Slide Baru</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Judul Slide *</label>
              <Input value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} placeholder="Judul utama slide..." />
            </div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Sub Judul</label>
              <Input value={form.subjudul} onChange={e => setForm(f => ({ ...f, subjudul: e.target.value }))} placeholder="Deskripsi singkat di bawah judul..." />
            </div>
            <ImageUpload
              label="Gambar Slide *"
              value={form.gambar}
              onChange={url => setForm(f => ({ ...f, gambar: url }))}
            />
            <div><label className="text-sm font-medium text-gray-700 block mb-1.5">Urutan</label>
              <Input type="number" min={1} value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="slideActive" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="slideActive" className="text-sm font-medium text-gray-700">Tampilkan di homepage</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={create.isPending}>
              {create.isPending ? "Menyimpan..." : "Tambah Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Hapus Slide?</DialogTitle></DialogHeader>
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
