import { useState } from "react";
import Layout from "@/components/Layout";
import { useRaces, useUniverses } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

type SortKey = "name" | "universe";

const RacesPage = () => {
  const { data: races = [] } = useRaces();
  const { data: universes = [] } = useUniverses();
  const [sort, setSort] = useState<SortKey>("name");

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";

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
          {sorted.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grimoire-card p-6">
              <h3 className="font-cinzel text-xl font-bold text-primary">{r.name}</h3>
              <p className="text-xs text-primary/60 mb-3">🌍 {getUniverseName(r.universe_id)}</p>
              <p className="font-crimson text-foreground/80 text-sm">{r.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.traits.map(t => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-cinzel">{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default RacesPage;
