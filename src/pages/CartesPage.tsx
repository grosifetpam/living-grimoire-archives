import Layout from "@/components/Layout";
import { useCharacters, useUniverses, useRaces, useFactions } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const CartesPage = () => {
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getRaceName = (id: string | null) => races.find(r => r.id === id)?.name || "Inconnue";
  const getFactionName = (id: string | null) => factions.find(f => f.id === id)?.name || "Inconnue";

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Cartes</h1>
        <p className="text-center text-muted-foreground mb-12 font-crimson text-lg">Les cartes de personnages du multivers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((c, i) => {
            const stats = c.stats as Record<string, number>;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }} className="grimoire-card overflow-hidden group">
                <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 text-center border-b border-primary/20">
                  <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center text-4xl border-2 border-primary/40 group-hover:glow-gold-strong transition-all">⚔️</div>
                  <h3 className="font-cinzel text-xl font-bold text-primary">{c.name}</h3>
                  <p className="text-sm text-primary/60 font-crimson italic">{c.title}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>🌍 {getUniverseName(c.universe_id)}</span>
                    <span>🧬 {getRaceName(c.race_id)}</span>
                  </div>
                  {c.faction_id && <p className="text-xs text-muted-foreground">🏛️ {getFactionName(c.faction_id)}</p>}
                  <div className="grid grid-cols-5 gap-1 mt-3">
                    {Object.entries(stats).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-primary font-cinzel font-bold">{val}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{key.slice(0, 3)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-gold rounded-full" style={{ width: `${(Object.values(stats).reduce((a, b) => a + b, 0) / 50) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-1 font-cinzel">Puissance totale: {Object.values(stats).reduce((a, b) => a + b, 0)}/50</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default CartesPage;
