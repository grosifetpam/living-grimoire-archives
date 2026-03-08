import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AudioUploadProps {
  currentAudio?: string | null;
  onAudioChange: (url: string | null) => void;
  folder: string;
  label?: string;
}

const AudioUpload = ({ currentAudio, onAudioChange, folder }: AudioUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({ title: "Erreur", description: "Fichier audio requis (MP3, WAV...)", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Taille max: 10MB", variant: "destructive" });
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
    onAudioChange(data.publicUrl);
    setUploading(false);
    toast({ title: "Audio uploadé ✓" });
  };

  const remove = () => {
    onAudioChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground font-crimson flex items-center gap-1">
        <Music size={14} /> Musique / Thème
      </label>
      {currentAudio && (
        <div className="flex items-center gap-2 p-2 rounded-md border border-primary/20 bg-secondary/30">
          <audio controls src={currentAudio} className="h-8 flex-1" />
          <button onClick={remove} className="p-1 hover:bg-destructive/20 rounded transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="font-cinzel gap-2">
          <Upload size={14} /> {uploading ? "Upload..." : "Choisir un fichier audio"}
        </Button>
        <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={upload} />
      </div>
    </div>
  );
};

export default AudioUpload;
