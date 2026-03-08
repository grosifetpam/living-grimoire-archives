import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useCharacters, useUniverses, useRaces, useCharacterRaces } from "@/hooks/useSupabaseData";
import { useSectionImage } from "@/hooks/useSectionImage";

const PersonnagesPage = () => {
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const { data: charRaces = [] } = useCharacterRaces();
  const [filter, setFilter] = useState("");

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getCharRaceNames = (charId: string) => {
    const raceIds = charRaces.filter(cr => cr.character_id === charId).map(cr => cr.race_id);
    return races.filter(r => raceIds.includes(r.id)).map(r => r.name);
  };

  const filtered = characters.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) || c.title.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by universe
  const grouped = universes
    .map(u => ({
      universe: u,
      chars: filtered.filter(c => c.universe_id === u.id),
    }))
    .filter(g => g.chars.length > 0);

  const chapters = grouped.map(g => ({
    title: `${g.universe.name} (${g.chars.length})`,
    icon: <span>⚔️</span>,
    content: (
      <div className="grid sm:grid-cols-2 gap-3">
        {g.chars.map(c => {
          const raceNames = getCharRaceNames(c.id);
          return (
            <Link key={c.id} to={`/personnages/${c.id}`} className="group flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-primary/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-secondary flex-shrink-0 overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 group-hover:glow-gold transition-all">
                {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">⚔️</div>}
              </div>
              <div className="min-w-0">
                <h3 className="font-cinzel font-semibold text-primary group-hover:text-glow-gold truncate">{c.name}</h3>
                <p className="text-sm text-muted-foreground font-crimson italic truncate">{c.title}</p>
                {raceNames.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {raceNames.map(n => (
                      <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-cinzel">🧬 {n}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    ),
  }));

  const headerContent = (
    <div className="max-w-md mx-auto mb-6">
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Rechercher un personnage..."
        className="w-full bg-secondary/50 border border-primary/30 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-crimson focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
      />
    </div>
  );

  return (
    <Layout>
      <GrimoireBook
        title="Personnages"
        subtitle="Les héros et légendes du multivers"
        headerContent={headerContent}
        chapters={chapters.length > 0 ? chapters : [{ title: "Registre vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucun personnage trouvé...</p> }]}
      />
    </Layout>
  );
};

export default PersonnagesPage;
