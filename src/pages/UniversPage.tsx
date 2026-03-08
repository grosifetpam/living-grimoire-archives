import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useUniverses, useCharacters, useRaces, useFactions } from "@/hooks/useSupabaseData";
import { useSectionImage } from "@/hooks/useSectionImage";
import { motion } from "framer-motion";

const UniversPage = () => {
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();

  const chapters = universes.map(u => ({
    title: u.name,
    icon: <span>📕</span>,
    content: (
      <Link to={`/univers/${u.id}`} className="block group">
        <div className="space-y-4">
          {u.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-primary/20 group-hover:glow-gold transition-all">
              <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-center">
            <h3 className="font-cinzel text-2xl font-bold text-primary group-hover:text-glow-gold transition-all">{u.name}</h3>
            <p className="text-sm text-primary/50 font-cinzel mt-1">{u.era}</p>
          </div>
          <p className="font-crimson text-foreground/80 text-lg leading-relaxed italic text-center">"{u.description}"</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <span>⚔️ {characters.filter(c => c.universe_id === u.id).length} personnages</span>
            <span>🧬 {races.filter(r => r.universe_id === u.id).length} races</span>
            <span>🏛️ {factions.filter(f => f.universe_id === u.id).length} factions</span>
          </div>
          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-cinzel text-sm group-hover:bg-primary/20 group-hover:glow-gold transition-all">
              ✦ Ouvrir ce tome ✦
            </span>
          </div>
        </div>
      </Link>
    ),
  }));

  return (
    <Layout>
      <GrimoireBook
        title="Les Univers"
        subtitle="Chaque tome renferme un monde entier à découvrir"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucun univers n'a encore été inscrit dans ce grimoire...</p> }]}
      />
    </Layout>
  );
};

export default UniversPage;
