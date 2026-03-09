import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useLocations, useUniverses, useCharacters } from "@/hooks/useSupabaseData";
import { useSectionImage } from "@/hooks/useSectionImage";

const LieuxPage = () => {
  const { data: locations = [] } = useLocations();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const sectionImage = useSectionImage("lieux");

  // Group by universe
  const grouped = universes
    .map(u => ({
      universe: u,
      locs: locations.filter(l => l.universe_id === u.id),
    }))
    .filter(g => g.locs.length > 0);

  const chapters = grouped.map(g => {
    const universeChars = characters.filter(c => c.universe_id === g.universe.id);
    return {
      title: `${g.universe.name} (${g.locs.length})`,
      icon: <span>📍</span>,
      content: (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {g.locs.map(l => (
              <div key={l.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                <div className="flex items-center gap-2">
                  <span className="text-primary/60">📍</span>
                  <h3 className="font-cinzel font-semibold text-primary">{l.name}</h3>
                </div>
                <span className="text-xs text-primary/40 font-cinzel">{l.type}</span>
                <p className="text-sm text-foreground/80 font-crimson mt-2">{l.description}</p>
              </div>
            ))}
          </div>
          {universeChars.length > 0 && (
            <div className="mt-4 pt-4 border-t border-primary/15">
              <h4 className="font-cinzel text-sm text-primary/60 mb-3">⚔️ Personnages de {g.universe.name} ({universeChars.length})</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {universeChars.map(c => (
                  <Link key={c.id} to={`/personnages/${c.id}`} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary border border-primary/20 flex-shrink-0">
                      {c.image ? <ImageWithFallback src={c.image} alt={c.name} className="w-full h-full object-cover" fallbackIcon="⚔️" /> : <div className="w-full h-full flex items-center justify-center text-sm">⚔️</div>}
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
        title="Lieux"
        subtitle="Les terres et sanctuaires du multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucun lieu inscrit...</p> }]}
        coverImage={sectionImage}
      />
    </Layout>
  );
};

export default LieuxPage;
