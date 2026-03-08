import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useCharacters, useUniverses, useRaces, useFactions, useCharacterRaces, useCharacterFactions } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const CartesPage = () => {
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();
  const { data: charRaces = [] } = useCharacterRaces();
  const { data: charFactions = [] } = useCharacterFactions();

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getCharRaceNames = (charId: string) => {
    const ids = charRaces.filter(cr => cr.character_id === charId).map(cr => cr.race_id);
    return races.filter(r => ids.includes(r.id)).map(r => r.name);
  };
  const getCharFactionNames = (charId: string) => {
    const ids = charFactions.filter(cf => cf.character_id === charId).map(cf => cf.faction_id);
    return factions.filter(f => ids.includes(f.id)).map(f => f.name);
  };

  // Group by universe
  const grouped = universes
    .map(u => ({ universe: u, chars: characters.filter(c => c.universe_id === u.id) }))
    .filter(g => g.chars.length > 0);

  const chapters = grouped.map(g => ({
    title: `${g.universe.name} (${g.chars.length})`,
    icon: <span>🃏</span>,
    content: (
      <div className="grid sm:grid-cols-2 gap-6">
        {g.chars.map((c, i) => {
          const stats = c.stats as Record<string, number>;
          const raceNames = getCharRaceNames(c.id);
          const factionNames = getCharFactionNames(c.id);
          const totalPower = Object.values(stats).reduce((a, b) => a + b, 0);
          return (
            <motion.div key={c.id} initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-lg border border-primary/30 overflow-hidden bg-secondary/20 hover:glow-gold transition-all group">
              <div className="bg-gradient-to-b from-primary/15 to-transparent p-5 text-center border-b border-primary/20">
                <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center text-3xl border-2 border-primary/40 group-hover:glow-gold-strong transition-all overflow-hidden">
                  {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : "⚔️"}
                </div>
                <h3 className="font-cinzel text-lg font-bold text-primary">{c.name}</h3>
                <p className="text-xs text-primary/60 font-crimson italic">{c.title}</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  <span>🌍 {getUniverseName(c.universe_id)}</span>
                  {raceNames.map(n => <span key={n}>· 🧬 {n}</span>)}
                  {factionNames.map(n => <span key={n}>· 🏛️ {n}</span>)}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {Object.entries(stats).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-primary font-cinzel font-bold">{val}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{key.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full" style={{ width: `${(totalPower / 50) * 100}%`, background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--gold)))" }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-center font-cinzel">Puissance : {totalPower}/50</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    ),
  }));

  return (
    <Layout>
      <GrimoireBook
        title="Cartes"
        subtitle="Les cartes de personnages du multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucune carte disponible...</p> }]}
      />
    </Layout>
  );
};

export default CartesPage;
