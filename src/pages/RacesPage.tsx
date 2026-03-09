import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useRaces, useUniverses, useCharacters, useCharacterRaces } from "@/hooks/useSupabaseData";
import { useSectionImage } from "@/hooks/useSectionImage";

const RacesPage = () => {
  const { data: races = [] } = useRaces();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const { data: charRaces = [] } = useCharacterRaces();
  const sectionImage = useSectionImage("races");

  const getRaceMembers = (raceId: string) => {
    const junctionIds = charRaces.filter(cr => cr.race_id === raceId).map(cr => cr.character_id);
    return characters.filter(c => junctionIds.includes(c.id) || c.race_id === raceId);
  };

  const chapters = races.map(r => {
    const members = getRaceMembers(r.id);
    const universeName = universes.find(u => u.id === r.universe_id)?.name || "Inconnu";
    return {
      title: r.name,
      icon: <span>🧬</span>,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-primary/50 font-cinzel">🌍 {universeName}</p>
          <p className="font-crimson text-foreground/80 text-lg leading-relaxed">{r.description}</p>
          {r.traits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {r.traits.map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/80 font-cinzel border border-primary/20">✦ {t}</span>
              ))}
            </div>
          )}
          {members.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary/15">
              <h4 className="font-cinzel text-sm text-primary/60 mb-3">Personnages de cette race ({members.length})</h4>
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
        title="Races"
        subtitle="Les peuples du multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucune race inscrite...</p> }]}
        coverImage={sectionImage}
      />
    </Layout>
  );
};

export default RacesPage;
