import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useLocations, useUniverses } from "@/hooks/useSupabaseData";

const LieuxPage = () => {
  const { data: locations = [] } = useLocations();
  const { data: universes = [] } = useUniverses();

  // Group by universe
  const grouped = universes
    .map(u => ({
      universe: u,
      locs: locations.filter(l => l.universe_id === u.id),
    }))
    .filter(g => g.locs.length > 0);

  const chapters = grouped.map(g => ({
    title: `${g.universe.name} (${g.locs.length})`,
    icon: <span>📍</span>,
    content: (
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
    ),
  }));

  return (
    <Layout>
      <GrimoireBook
        title="Lieux"
        subtitle="Les terres et sanctuaires du multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucun lieu inscrit...</p> }]}
      />
    </Layout>
  );
};

export default LieuxPage;
