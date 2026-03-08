import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useFactions, useUniverses, useCharacters, useCharacterFactions } from "@/hooks/useSupabaseData";
import { motion, AnimatePresence } from "framer-motion";

const FactionsPage = () => {
  const { data: factions = [] } = useFactions();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: charFactions = [] } = useCharacterFactions();
  const [sort, setSort] = useState<"name" | "members">("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getFactionMembers = (factionId: string) => {
    const charIds = charFactions.filter(cf => cf.faction_id === factionId).map(cf => cf.character_id);
    return characters.filter(c => charIds.includes(c.id));
  };

  const sorted = [...factions].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.member_count - a.member_count
  );

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Factions</h1>
        <p className="text-center text-muted-foreground mb-8 font-crimson text-lg">Les ordres et confréries du multivers</p>

        <div className="flex justify-center gap-3 mb-10">
          <button onClick={() => setSort("name")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "name" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>Alphabétique</button>
          <button onClick={() => setSort("members")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "members" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>Par Membres</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {sorted.map((f, i) => {
            const members = getFactionMembers(f.id);
            const isExpanded = expandedId === f.id;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grimoire-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl border border-primary/30">🏛️</div>
                  <div className="flex-1">
                    <h3 className="font-cinzel text-xl font-bold text-primary">{f.name}</h3>
                    <p className="text-xs text-primary/60 italic font-crimson">"{f.motto}"</p>
                    <p className="text-xs text-muted-foreground mt-1">🌍 {getUniverseName(f.universe_id)} · 👥 {members.length} membres</p>
                    <p className="font-crimson text-foreground/80 text-sm mt-3">{f.description}</p>

                    {members.length > 0 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : f.id)}
                        className="mt-3 text-xs font-cinzel text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}>▶</span>
                        Voir les membres ({members.length})
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
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default FactionsPage;
