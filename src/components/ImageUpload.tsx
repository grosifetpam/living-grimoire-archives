import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
  folder: string;
  label?: string;
}

const ImageUpload = ({ currentImage, onImageChange, folder }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Erreur", description: "Fichier image requis", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Taille max: 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    onImageChange(data.publicUrl);
    setUploading(false);
    toast({ title: "Image uploadée ✓" });
  };

  const remove = () => {
    onImageChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground font-crimson">Image</label>
      {currentImage && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border border-primary/30">
          <img src={currentImage} alt="preview" className="w-full h-full object-cover" />
          <button onClick={remove} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive/80 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="font-cinzel gap-2">
          <Upload size={14} /> {uploading ? "Upload..." : "Choisir une image"}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      </div>
    </div>
  );
};

export default ImageUpload;
