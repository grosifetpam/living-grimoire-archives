import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useTimelineEvents, useUniverses, useCharacters } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { useSectionImage } from "@/hooks/useSectionImage";

const ChronologiePage = () => {
  const { data: timelineEvents = [] } = useTimelineEvents();
  const { data: universes = [] } = useUniverses();
  const { data: characters = [] } = useCharacters();
  const sectionImage = useSectionImage("chronologie");

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";
  const getUniverseChars = (universeId: string) => characters.filter(c => c.universe_id === universeId);

  // Group by era
  const eras = [...new Set(timelineEvents.map(e => e.era))].filter(Boolean);
  const sorted = [...timelineEvents].sort((a, b) => a.year - b.year);

  const buildTimelineContent = (events: typeof timelineEvents) => {
    // Get unique universe IDs from events
    const eventUniverseIds = [...new Set(events.map(e => e.universe_id))];
    const relatedChars = characters.filter(c => eventUniverseIds.includes(c.universe_id));

    return (
      <div className="space-y-6">
        <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
          {events.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
              <div className="absolute -left-[29px] w-3.5 h-3.5 rounded-full bg-primary glow-gold border-2 border-background" />
              <div className="flex items-baseline gap-3">
                <span className="font-cinzel text-sm text-primary font-bold whitespace-nowrap">
                  {e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`}
                </span>
                <span className="text-xs text-muted-foreground">· 🌍 {getUniverseName(e.universe_id)}</span>
              </div>
              <h3 className="font-cinzel font-semibold text-foreground mt-0.5">{e.title}</h3>
              <p className="text-sm text-muted-foreground font-crimson">{e.description}</p>
            </motion.div>
          ))}
        </div>
        {relatedChars.length > 0 && (
          <div className="pt-4 border-t border-primary/15">
            <h4 className="font-cinzel text-sm text-primary/60 mb-3">⚔️ Personnages liés ({relatedChars.length})</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {relatedChars.map(c => (
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
    );
  };

  const chapters = eras.map(era => {
    const eraEvents = sorted.filter(e => e.era === era);
    return {
      title: `${era} (${eraEvents.length})`,
      icon: <span>📅</span>,
      content: buildTimelineContent(eraEvents),
    };
  });

  // If no eras, show all as one chapter
  if (chapters.length === 0 && sorted.length > 0) {
    chapters.push({
      title: `Tous les événements (${sorted.length})`,
      icon: <span>📅</span>,
      content: buildTimelineContent(sorted),
    });
  }

  return (
    <Layout>
      <GrimoireBook
        title="Chronologie"
        subtitle="Le fil du temps à travers le multivers"
        chapters={chapters.length > 0 ? chapters : [{ title: "Vide", icon: <span>📖</span>, content: <p className="text-center text-muted-foreground font-crimson italic">Aucun événement inscrit...</p> }]}
        coverImage={sectionImage}
      />
    </Layout>
  );
};

export default ChronologiePage;
