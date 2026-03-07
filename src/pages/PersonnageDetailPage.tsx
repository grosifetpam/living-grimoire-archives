import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCharacters, useUniverses, useRaces, useFactions } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const PersonnageDetailPage = () => {
  const { id } = useParams();
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();

  const character = characters.find(c => c.id === id);
  if (!character) return <Layout><div className="min-h-screen flex items-center justify-center">Personnage introuvable</div></Layout>;

  const getUniverseName = (uid: string) => universes.find(u => u.id === uid)?.name || "Inconnu";
  const getRaceName = (rid: string | null) => races.find(r => r.id === rid)?.name || "Inconnue";
  const getFactionName = (fid: string | null) => factions.find(f => f.id === fid)?.name || "Inconnue";

  const stats = character.stats as Record<string, number>;
  const statLabels = [
    { key: "force", label: "Force", icon: "💪" },
    { key: "agilite", label: "Agilité", icon: "🏃" },
    { key: "intelligence", label: "Intelligence", icon: "🧠" },
    { key: "magie", label: "Magie", icon: "✨" },
    { key: "charisme", label: "Charisme", icon: "👑" },
  ];

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/personnages" className="text-primary/60 hover:text-primary text-sm font-cinzel">← Retour</Link>
          <div className="mt-6 text-center">
            <div className="w-28 h-28 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center text-5xl border-2 border-primary/40 glow-gold">⚔️</div>
            <h1 className="font-cinzel text-4xl font-bold text-primary text-glow-gold">{character.name}</h1>
            <p className="text-primary/60 font-crimson italic text-lg mt-1">{character.title}</p>
            <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>🌍 {getUniverseName(character.universe_id)}</span>
              <span>🧬 {getRaceName(character.race_id)}</span>
              {character.faction_id && <span>🏛️ {getFactionName(character.faction_id)}</span>}
            </div>
          </div>

          <div className="mt-10 grimoire-card p-6">
            <h2 className="font-cinzel text-xl font-bold text-primary mb-4">Statistiques</h2>
            <div className="space-y-3">
              {statLabels.map(({ key, label, icon }) => {
                const val = stats[key] ?? 5;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="font-cinzel text-sm w-24 text-foreground/80">{label}</span>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${val * 10}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-primary to-gold rounded-full" />
                    </div>
                    <span className="font-cinzel text-sm text-primary w-8 text-right">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grimoire-card p-6">
            <h2 className="font-cinzel text-xl font-bold text-primary mb-4">Histoire</h2>
            <p className="font-crimson text-foreground/90 leading-relaxed text-lg">{character.backstory}</p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default PersonnageDetailPage;
