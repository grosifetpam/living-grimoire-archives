import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useFactions, useUniverses, useCharacters, useCharacterFactions } from "@/hooks/useSupabaseData";
import { useSectionImage } from "@/hooks/useSectionImage";

const FactionsPage = () => {
  const { data: factions = [] } = useFactions();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: charFactions = [] } = useCharacterFactions();

  const getFactionMembers = (factionId: string) => {
    const charIds = charFactions.filter(cf => cf.faction_id === factionId).map(cf => cf.character_id);
    return characters.filter(c => charIds.includes(c.id));
  };

  const chapters = factions.map(f => {
    const members = getFactionMembers(f.id);
    const universeName = universes.find(u => u.id === f.universe_id)?.name || "Inconnu";
    return {
      title: f.name,
      icon: <span>🏛️</span>,
      content: (
        <div className="space-y-4">
          <p className="text-primary/50 font-crimson italic text-center text-lg">"{f.motto}"</p>
          <p className="text-xs text-center text-muted-foreground">🌍 {universeName} · 👥 {members.length} membres</p>
          <p className="font-crimson text-foreground/80 text-lg leading-relaxed">{f.description}</p>
          {members.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary/15">
              <h4 className="font-cinzel text-sm text-primary/60 mb-3">Membres notables ({members.length})</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {members.map(c => (
                  <Link key={c.id} to={`/personnages/${c.id}`} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-primary/20 flex-shrink-0">
                      {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">⚔️</div>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-cinzel text-sm text-primary group-hover:text-primary/80 truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <Layout>
      <GrimoireBook
        title="Factions"
        subtitle="Les ordres et confréries du multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucune faction inscrite...</p> }]}
      />
    </Layout>
  );
};

export default FactionsPage;
