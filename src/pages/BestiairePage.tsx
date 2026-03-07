import { useState } from "react";
import Layout from "@/components/Layout";
import { useCreatures, useUniverses } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const BestiairePage = () => {
  const { data: creatures = [] } = useCreatures();
  const { data: universes = [] } = useUniverses();
  const [selected, setSelected] = useState<string | null>(null);

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const sel = creatures.find(c => c.id === selected);
  const dangerStars = (level: number) => "⭐".repeat(level) + "☆".repeat(5 - level);

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Bestiaire</h1>
        <p className="text-center text-muted-foreground mb-12 font-crimson text-lg">Les créatures qui hantent le multivers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatures.map((cr, i) => (
            <motion.div key={cr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelected(cr.id)} className="grimoire-card p-6 cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:animate-float">🐉</div>
              <h3 className="font-cinzel text-lg font-bold text-primary group-hover:text-glow-gold transition-all">{cr.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">🌍 {getUniverseName(cr.universe_id)}</p>
              <p className="text-xs text-primary/80 mt-1">Danger: {dangerStars(cr.danger_level)}</p>
              <p className="font-crimson text-foreground/80 text-sm mt-3 line-clamp-2">{cr.description}</p>
            </motion.div>
          ))}
        </div>

        {sel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative grimoire-card p-8 max-w-lg w-full glow-gold" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">✕</button>
              <div className="text-5xl mb-4">🐉</div>
              <h2 className="font-cinzel text-2xl font-bold text-primary text-glow-gold">{sel.name}</h2>
              <p className="text-sm text-primary/80 mt-1">Danger: {dangerStars(sel.danger_level)}</p>
              <p className="text-xs text-muted-foreground">🌍 {getUniverseName(sel.universe_id)} · 📍 {sel.habitat}</p>
              <p className="font-crimson text-foreground/90 mt-4 leading-relaxed">{sel.description}</p>
              <div className="mt-4">
                <h3 className="font-cinzel text-sm font-semibold text-primary mb-2">Capacités</h3>
                <div className="flex flex-wrap gap-2">
                  {sel.abilities.map(a => <span key={a} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-cinzel">{a}</span>)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default BestiairePage;
