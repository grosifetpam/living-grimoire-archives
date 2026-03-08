import { useState } from "react";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useCreatures, useUniverses } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { Skull } from "lucide-react";

const DangerStars = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skull key={i} size={14} className={i < level ? "text-destructive" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const BestiairePage = () => {
  const { data: creatures = [] } = useCreatures();
  const { data: universes = [] } = useUniverses();

  // Group by universe
  const grouped = universes
    .map(u => ({
      universe: u,
      creatures: creatures.filter(cr => cr.universe_id === u.id),
    }))
    .filter(g => g.creatures.length > 0);

  const chapters = grouped.map(g => ({
    title: `${g.universe.name} (${g.creatures.length})`,
    icon: <span>🐉</span>,
    content: (
      <div className="space-y-4">
        {g.creatures.map(cr => (
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
    ),
  }));

  return (
    <Layout>
      <GrimoireBook
        title="Bestiaire"
        subtitle="Les créatures qui hantent le multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucune créature inscrite...</p> }]}
      />
    </Layout>
  );
};

export default BestiairePage;
