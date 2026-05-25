import { useRef, useState } from "react";
import { ImageIcon, UploadCloud, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value.startsWith("http") ? value : "");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Hanya file gambar yang diizinkan", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Ukuran file maksimal 5 MB", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast({ title: "Sesi habis, silakan login ulang", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Upload gagal");
      }

      const data = (await res.json()) as { url: string };
      onChange(data.url);
      toast({ title: "Gambar berhasil diupload" });
    } catch (err) {
      toast({
        title: (err as Error).message ?? "Upload gagal",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUrlApply = () => {
    onChange(urlInput.trim());
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 block">{label}</label>
      )}

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UploadCloud size={13} /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Link size={13} /> URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            uploading
              ? "border-primary/40 bg-primary/5 cursor-wait"
              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <UploadCloud
            size={28}
            className={`mx-auto mb-2 ${uploading ? "text-primary animate-pulse" : "text-gray-300"}`}
          />
          {uploading ? (
            <p className="text-sm text-primary font-medium">Mengupload...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Drag & drop atau <span className="text-primary font-medium">klik untuk pilih</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF, SVG — maks 5 MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://contoh.com/gambar.jpg"
            onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
          />
          <Button type="button" variant="outline" onClick={handleUrlApply} className="shrink-0">
            Pakai
          </Button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Empty state */}
      {!value && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ImageIcon size={13} />
          <span>Belum ada gambar dipilih</span>
        </div>
      )}
    </div>
  );
}
