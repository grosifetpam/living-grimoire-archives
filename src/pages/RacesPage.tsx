import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useRaces, useUniverses, useCharacters, useCharacterRaces } from "@/hooks/useSupabaseData";
import { motion, AnimatePresence } from "framer-motion";

type SortKey = "name" | "universe";

const RacesPage = () => {
  const { data: races = [] } = useRaces();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: charRaces = [] } = useCharacterRaces();
  const [sort, setSort] = useState<SortKey>("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getRaceMembers = (raceId: string) => {
    const charIds = charRaces.filter(cr => cr.race_id === raceId).map(cr => cr.character_id);
    return characters.filter(c => charIds.includes(c.id));
  };

  const sorted = [...races].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : getUniverseName(a.universe_id).localeCompare(getUniverseName(b.universe_id))
  );

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Races</h1>
        <p className="text-center text-muted-foreground mb-8 font-crimson text-lg">Les peuples du multivers</p>

        <div className="flex justify-center gap-3 mb-10">
          <button onClick={() => setSort("name")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "name" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>Alphabétique</button>
          <button onClick={() => setSort("universe")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "universe" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>Par Univers</button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((r, i) => {
            const members = getRaceMembers(r.id);
            const isExpanded = expandedId === r.id;
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grimoire-card p-6">
                <h3 className="font-cinzel text-xl font-bold text-primary">{r.name}</h3>
                <p className="text-xs text-primary/60 mb-3">🌍 {getUniverseName(r.universe_id)} · 👤 {members.length} personnages</p>
                <p className="font-crimson text-foreground/80 text-sm">{r.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.traits.map(t => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-cinzel">{t}</span>)}
                </div>

                {members.length > 0 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="mt-3 text-xs font-cinzel text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}>▶</span>
                    Voir les personnages ({members.length})
                  </button>
                )}

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-primary/20 grid gap-2">
                        {members.map(c => (
                          <Link
                            key={c.id}
                            to={`/personnages/${c.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-background border border-primary/20 flex-shrink-0">
                              {c.image ? (
                                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm">⚔️</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-cinzel text-sm text-primary group-hover:text-primary/80 truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default RacesPage;
