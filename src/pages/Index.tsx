import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCounter from "@/components/StatCounter";
import { useUniverses, useCharacters, useRaces, useFactions, useTimelineEvents } from "@/hooks/useSupabaseData";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Volume2, VolumeX, ImagePlus } from "lucide-react";
import { playBookOpen, startAmbientMusic, stopAmbientMusic, isAmbientPlaying } from "@/lib/sounds";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();
  const { data: timelineEvents = [] } = useTimelineEvents();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  // Load cover image from site_settings
  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "cover_image").single()
      .then(({ data }) => {
        if (data?.value) setCoverImage(data.value);
      });
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setUploadingCover(true);
    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("images").upload(path, file);
    if (upErr) {
      toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
      setUploadingCover(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
    const url = urlData.publicUrl;
    await supabase.from("site_settings" as any).update({ value: url }).eq("key", "cover_image");
    setCoverImage(url);
    setUploadingCover(false);
    toast({ title: "Image de couverture mise à jour ✓" });
  };

  const handleOpen = () => {
    playBookOpen();
    setIsOpen(true);
    startAmbientMusic();
    setMusicOn(true);
  };

  const handleClose = () => {
    playBookOpen();
    setIsOpen(false);
    stopAmbientMusic();
    setMusicOn(false);
  };

  const toggleMusic = () => {
    if (isAmbientPlaying()) {
      stopAmbientMusic();
      setMusicOn(false);
    } else {
      startAmbientMusic();
      setMusicOn(true);
    }
  };

  useEffect(() => {
    return () => { stopAmbientMusic(); };
  }, []);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.section
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, rotateY: 90, transition: { duration: 0.5 } }}
            className="min-h-screen flex flex-col items-center justify-center px-4 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="grimoire-book-cover cursor-pointer max-w-lg w-full"
              onClick={handleOpen}
              style={{ perspective: "1200px" }}
            >
              <div className="relative bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] border-2 border-primary/40 rounded-sm p-12 md:p-20 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.3),0_0_40px_hsl(var(--gold)/0.2)]">
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-primary/30 to-transparent" />
                <div className="absolute left-4 top-0 bottom-0 w-px bg-primary/20" />
                <div className="absolute left-5 top-0 bottom-0 w-px bg-primary/10" />

                <div className="absolute top-4 left-7 text-primary/25 text-3xl font-cinzel">✦</div>
                <div className="absolute top-4 right-4 text-primary/25 text-3xl font-cinzel">✦</div>
                <div className="absolute bottom-4 left-7 text-primary/25 text-3xl font-cinzel">✦</div>
                <div className="absolute bottom-4 right-4 text-primary/25 text-3xl font-cinzel">✦</div>

                <div className="absolute inset-6 left-9 border border-primary/15 rounded-sm pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl mb-8"
                >
                  📖
                </motion.div>

                <div className="border-t border-b border-primary/25 py-8 my-4">
                  <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-primary text-glow-gold leading-tight">
                    L'Archive Vivante
                  </h1>
                  <p className="font-cinzel text-xl md:text-2xl text-foreground/70 mt-2">du Multivers</p>
                </div>

                <p className="font-crimson text-muted-foreground italic mt-6 text-lg max-w-sm mx-auto">
                  Chaque page est un portail vers un monde oublié, chaque mot une clé vers des mystères anciens.
                </p>

                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="mt-8 flex items-center justify-center gap-2 text-primary/60 font-cinzel text-sm"
                >
                  <BookOpen size={18} />
                  <span>Cliquez pour ouvrir le grimoire</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            <section className="py-16 px-4 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button onClick={handleClose} className="text-xs font-cinzel text-primary/40 hover:text-primary transition-colors">
                    ← Refermer le grimoire
                  </button>
                  <button
                    onClick={toggleMusic}
                    className="inline-flex items-center gap-1 text-primary/40 hover:text-primary text-xs font-cinzel transition-colors"
                    title={musicOn ? "Couper la musique" : "Lancer la musique"}
                  >
                    {musicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    <span className="hidden sm:inline">{musicOn ? "Musique ON" : "Musique OFF"}</span>
                  </button>
                </div>
              </motion.div>

              {/* Page: Title Page */}
              <div className="grimoire-page relative mb-8">
                <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-lg" />
                <div className="bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] rounded-lg p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]">
                  <div className="text-center">
                    <div className="text-primary/20 text-sm font-cinzel tracking-[0.4em] mb-4">✦ SOMMAIRE ✦</div>
                    <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-primary text-glow-gold mb-4">
                      L'Archive Vivante
                    </h1>
                    <p className="font-crimson text-muted-foreground italic text-lg mb-8">
                      Explorez les secrets d'un multivers infini
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8">
                      <StatCounter icon="🌍" label="Univers" end={universes.length} />
                      <StatCounter icon="⚔️" label="Personnages" end={characters.length} />
                      <StatCounter icon="🧬" label="Races" end={races.length} />
                      <StatCounter icon="🏛️" label="Factions" end={factions.length} />
                      <StatCounter icon="📅" label="Événements" end={timelineEvents.length} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Page: Table of contents */}
              <div className="grimoire-page relative mb-8">
                <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-lg" />
                <div className="bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] rounded-lg p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]">
                  <div className="text-primary/20 text-sm font-cinzel tracking-[0.4em] text-center mb-6">✦ TABLE DES MATIÈRES ✦</div>
                  <div className="max-w-md mx-auto space-y-3">
                    {[
                      { to: "/univers", label: "Les Univers", icon: "📕", desc: "Les tomes du multivers" },
                      { to: "/personnages", label: "Personnages", icon: "⚔️", desc: "Héros et légendes" },
                      { to: "/races", label: "Races", icon: "🧬", desc: "Les peuples" },
                      { to: "/factions", label: "Factions", icon: "🏛️", desc: "Ordres et confréries" },
                      { to: "/chronologie", label: "Chronologie", icon: "📅", desc: "Le fil du temps" },
                      { to: "/lieux", label: "Lieux", icon: "📍", desc: "Terres et sanctuaires" },
                      { to: "/bestiaire", label: "Bestiaire", icon: "🐉", desc: "Créatures du multivers" },
                      { to: "/cartes", label: "Cartes", icon: "🃏", desc: "Cartes de personnages" },
                    ].map((item, i) => (
                      <motion.div key={item.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                        <Link to={item.to} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-all group border border-transparent hover:border-primary/20">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-cinzel text-lg text-primary group-hover:text-glow-gold transition-all">{item.label}</h3>
                            <p className="text-xs text-muted-foreground font-crimson">{item.desc}</p>
                          </div>
                          <span className="text-primary/30 font-cinzel text-sm">Chap. {romanize(i + 1)}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page: Featured Universes */}
              {universes.length > 0 && (
                <div className="grimoire-page relative">
                  <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-lg" />
                  <div className="bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] rounded-lg p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]">
                    <div className="text-primary/20 text-sm font-cinzel tracking-[0.4em] text-center mb-6">✦ UNIVERS À EXPLORER ✦</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {universes.map((u, i) => (
                        <motion.div key={u.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <Link to={`/univers/${u.id}`} className="block p-5 rounded-lg bg-secondary/20 border border-primary/10 hover:border-primary/40 hover:glow-gold transition-all group">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">📕</span>
                              <div>
                                <h3 className="font-cinzel text-lg font-semibold text-primary group-hover:text-glow-gold transition-all">{u.name}</h3>
                                <p className="text-xs text-primary/50 font-cinzel">{u.era}</p>
                                <p className="font-crimson text-foreground/70 text-sm mt-2 line-clamp-2">{u.description}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

function romanize(num: number): string {
  const lookup: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let result = "";
  for (const [value, symbol] of lookup) {
    while (num >= value) { result += symbol; num -= value; }
  }
  return result;
}

export default Index;
