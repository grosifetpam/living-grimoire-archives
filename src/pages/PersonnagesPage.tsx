import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCharacters, useUniverses, useRaces } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const PersonnagesPage = () => {
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const [filter, setFilter] = useState("");

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getRaceName = (id: string | null) => races.find(r => r.id === id)?.name || "Inconnue";

  const filtered = characters.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) || c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Personnages</h1>
        <p className="text-center text-muted-foreground mb-8 font-crimson text-lg">Les héros et légendes du multivers</p>

        <div className="max-w-md mx-auto mb-10">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Rechercher un personnage..."
            className="w-full bg-secondary/50 border border-primary/30 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-crimson focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/personnages/${c.id}`} className="grimoire-card p-6 block group text-center">
                <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center text-3xl border-2 border-primary/30 group-hover:border-primary group-hover:glow-gold transition-all">⚔️</div>
                <h3 className="font-cinzel text-lg font-bold text-primary group-hover:text-glow-gold transition-all">{c.name}</h3>
                <p className="text-sm text-primary/60 font-crimson italic">{c.title}</p>
                <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                  <span>🌍 {getUniverseName(c.universe_id)}</span>
                  <span>🧬 {getRaceName(c.race_id)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default PersonnagesPage;
