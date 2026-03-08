import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useUniverses, useCharacters, useRaces, useFactions, useTimelineEvents, useLocations, useCreatures } from "@/hooks/useSupabaseData";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight, Skull, MapPin, Swords, Shield, ScrollText, Clock, Bug } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const GrimoireSection = ({ title, icon, children, index, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; index: number; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={sectionVariants} className="grimoire-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-secondary/30 transition-colors">
        <span className="text-primary">{icon}</span>
        <h2 className="font-cinzel text-xl font-bold text-primary flex-1">{title}</h2>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-primary/60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-5 pb-5 border-t border-primary/10 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DangerStars = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skull key={i} size={14} className={i < level ? "text-destructive" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const UniversDetailPage = () => {
  const { id } = useParams();
  const { data: universes = [] } = useUniverses();
  const { data: allChars = [] } = useCharacters();
  const { data: allRaces = [] } = useRaces();
  const { data: allFactions = [] } = useFactions();
  const { data: allEvents = [] } = useTimelineEvents();
  const { data: allLocations = [] } = useLocations();
  const { data: allCreatures = [] } = useCreatures();

  const universe = universes.find(u => u.id === id);
  if (!universe) return <Layout><div className="min-h-screen flex items-center justify-center text-foreground font-cinzel">Univers introuvable</div></Layout>;

  const chars = allChars.filter(c => c.universe_id === id);
  const races = allRaces.filter(r => r.universe_id === id);
  const facs = allFactions.filter(f => f.universe_id === id);
  const evts = [...allEvents.filter(e => e.universe_id === id)].sort((a, b) => a.year - b.year);
  const locs = allLocations.filter(l => l.universe_id === id);
  const creatures = allCreatures.filter(cr => cr.universe_id === id);

  const getRaceName = (rid: string | null) => allRaces.find(r => r.id === rid)?.name || null;
  const getFactionName = (fid: string | null) => allFactions.find(f => f.id === fid)?.name || null;

  let sectionIdx = 0;

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 max-w-5xl mx-auto">
        {/* Header — Book Cover */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <Link to="/univers" className="inline-flex items-center gap-1 text-primary/50 hover:text-primary text-sm font-cinzel mb-6 transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Retour aux Univers
          </Link>

          {universe.image && (
            <div className="w-full max-w-2xl mx-auto h-64 rounded-xl overflow-hidden mb-6 border border-primary/20 glow-gold">
              <img src={universe.image} alt={universe.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-primary text-glow-gold relative">{universe.name}</h1>
          </div>
          <p className="font-cinzel text-primary/50 mt-2 text-lg tracking-widest uppercase">{universe.era}</p>

          {/* Stats ribbon */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { icon: <Swords size={16} />, label: "Personnages", count: chars.length },
              { icon: <Shield size={16} />, label: "Races", count: races.length },
              { icon: <ScrollText size={16} />, label: "Factions", count: facs.length },
              { icon: <Clock size={16} />, label: "Événements", count: evts.length },
              { icon: <MapPin size={16} />, label: "Lieux", count: locs.length },
              { icon: <Bug size={16} />, label: "Créatures", count: creatures.length },
            ].filter(s => s.count > 0).map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-primary/20 text-sm text-muted-foreground">
                <span className="text-primary">{s.icon}</span> {s.count} {s.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Description — Prologue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grimoire-card p-6 md:p-8 mb-8">
          <h2 className="font-cinzel text-lg text-primary/60 mb-3 tracking-widest uppercase">Prologue</h2>
          <p className="font-crimson text-lg md:text-xl text-foreground/90 leading-relaxed italic">"{universe.description}"</p>
        </motion.div>

        {/* Sections — Grimoire Chapters */}
        <div className="space-y-4">

          {/* PERSONNAGES */}
          {chars.length > 0 && (
            <GrimoireSection title={`Personnages (${chars.length})`} icon={<Swords size={22} />} index={sectionIdx++} defaultOpen>
              <div className="grid sm:grid-cols-2 gap-3">
                {chars.map(c => {
                  const race = getRaceName(c.race_id);
                  const faction = getFactionName(c.faction_id);
                  return (
                    <Link key={c.id} to={`/personnages/${c.id}`} className="group flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-primary/30 transition-all">
                      <div className="w-14 h-14 rounded-full bg-secondary flex-shrink-0 overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 group-hover:glow-gold transition-all">
                        {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">⚔️</div>}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-cinzel font-semibold text-primary group-hover:text-glow-gold truncate">{c.name}</h3>
                        <p className="text-sm text-muted-foreground font-crimson italic truncate">{c.title}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {race && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-cinzel">🧬 {race}</span>}
                          {faction && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-cinzel">🏛️ {faction}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </GrimoireSection>
          )}

          {/* RACES */}
          {races.length > 0 && (
            <GrimoireSection title={`Races (${races.length})`} icon={<Shield size={22} />} index={sectionIdx++}>
              <div className="space-y-4">
                {races.map(r => {
                  const raceChars = chars.filter(c => c.race_id === r.id);
                  return (
                    <div key={r.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                      <h3 className="font-cinzel text-lg font-semibold text-primary">{r.name}</h3>
                      <p className="text-sm text-foreground/80 font-crimson mt-1">{r.description}</p>
                      {r.traits && r.traits.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {r.traits.map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-cinzel">✦ {t}</span>
                          ))}
                        </div>
                      )}
                      {raceChars.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-primary/10">
                          <p className="text-xs text-muted-foreground font-cinzel mb-1">Membres connus :</p>
                          <div className="flex flex-wrap gap-2">
                            {raceChars.map(c => (
                              <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold hover:bg-secondary transition-all font-cinzel">
                                ⚔️ {c.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GrimoireSection>
          )}

          {/* FACTIONS */}
          {facs.length > 0 && (
            <GrimoireSection title={`Factions (${facs.length})`} icon={<ScrollText size={22} />} index={sectionIdx++}>
              <div className="space-y-4">
                {facs.map(f => {
                  const facChars = chars.filter(c => c.faction_id === f.id);
                  return (
                    <div key={f.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-cinzel text-lg font-semibold text-primary">{f.name}</h3>
                          <p className="text-xs text-primary/50 font-crimson italic">"{f.motto}"</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary/70 font-cinzel whitespace-nowrap">{f.member_count} membres</span>
                      </div>
                      <p className="text-sm text-foreground/80 font-crimson mt-2">{f.description}</p>
                      {facChars.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-primary/10">
                          <p className="text-xs text-muted-foreground font-cinzel mb-1">Membres notables :</p>
                          <div className="flex flex-wrap gap-2">
                            {facChars.map(c => (
                              <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold hover:bg-secondary transition-all font-cinzel">
                                ⚔️ {c.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GrimoireSection>
          )}

          {/* CHRONOLOGIE */}
          {evts.length > 0 && (
            <GrimoireSection title={`Chronologie (${evts.length})`} icon={<Clock size={22} />} index={sectionIdx++}>
              <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
                {evts.map((e, i) => (
                  <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
                    <div className="absolute -left-[29px] w-3.5 h-3.5 rounded-full bg-primary glow-gold border-2 border-background" />
                    <div className="flex items-baseline gap-3">
                      <span className="font-cinzel text-sm text-primary font-bold whitespace-nowrap">
                        {e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`}
                      </span>
                      {e.era && <span className="text-xs text-primary/40 font-cinzel">— {e.era}</span>}
                    </div>
                    <h3 className="font-cinzel font-semibold text-foreground mt-0.5">{e.title}</h3>
                    <p className="text-sm text-muted-foreground font-crimson">{e.description}</p>
                  </motion.div>
                ))}
              </div>
            </GrimoireSection>
          )}

          {/* LIEUX */}
          {locs.length > 0 && (
            <GrimoireSection title={`Lieux (${locs.length})`} icon={<MapPin size={22} />} index={sectionIdx++}>
              <div className="grid sm:grid-cols-2 gap-3">
                {locs.map(l => (
                  <div key={l.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary/60" />
                      <h3 className="font-cinzel font-semibold text-primary">{l.name}</h3>
                    </div>
                    <span className="text-xs text-primary/40 font-cinzel">{l.type}</span>
                    <p className="text-sm text-foreground/80 font-crimson mt-2">{l.description}</p>
                  </div>
                ))}
              </div>
            </GrimoireSection>
          )}

          {/* BESTIAIRE */}
          {creatures.length > 0 && (
            <GrimoireSection title={`Bestiaire (${creatures.length})`} icon={<Bug size={22} />} index={sectionIdx++}>
              <div className="space-y-4">
                {creatures.map(cr => (
                  <div key={cr.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10 flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden border border-primary/20">
                      {cr.image ? <img src={cr.image} alt={cr.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🐉</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-cinzel font-semibold text-primary">{cr.name}</h3>
                        <DangerStars level={cr.danger_level} />
                      </div>
                      <p className="text-xs text-primary/40 font-cinzel">Habitat : {cr.habitat}</p>
                      <p className="text-sm text-foreground/80 font-crimson mt-1">{cr.description}</p>
                      {cr.abilities && cr.abilities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cr.abilities.map(a => (
                            <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive/80 font-cinzel">⚡ {a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GrimoireSection>
          )}
        </div>

        {/* Navigation footer between universes */}
        <div className="mt-12 flex justify-center gap-4 flex-wrap">
          {universes.filter(u => u.id !== id).map(u => (
            <Link key={u.id} to={`/univers/${u.id}`} className="px-4 py-2 rounded-lg bg-secondary/40 border border-primary/20 hover:border-primary/50 hover:glow-gold text-sm font-cinzel text-primary/70 hover:text-primary transition-all">
              📕 {u.name}
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default UniversDetailPage;
