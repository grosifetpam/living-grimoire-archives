import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useUniverses, useCharacters, useRaces, useFactions, useTimelineEvents, useLocations, useCreatures, useCharacterFactions, useCharacterRaces } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { Skull, MapPin, Swords, Shield, ScrollText, Clock, Bug } from "lucide-react";

const DangerStars = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skull key={i} size={14} className={i < level ? "text-destructive" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const UniversDetailPage = () => {
  const { id } = useParams();
  const { data: universes = [] } = useUniverses();
  const { data: allChars = [] } = useCharacters();
  const { data: allRaces = [] } = useRaces();
  const { data: allFactions = [] } = useFactions();
  const { data: allEvents = [] } = useTimelineEvents();
  const { data: allLocations = [] } = useLocations();
  const { data: allCreatures = [] } = useCreatures();
  const { data: charFactions = [] } = useCharacterFactions();
  const { data: charRaces = [] } = useCharacterRaces();

  const universe = universes.find(u => u.id === id);
  if (!universe) return <Layout><div className="min-h-screen flex items-center justify-center text-foreground font-cinzel">Univers introuvable</div></Layout>;

  const chars = allChars.filter(c => c.universe_id === id);
  const races = allRaces.filter(r => r.universe_id === id);
  const facs = allFactions.filter(f => f.universe_id === id);
  const evts = [...allEvents.filter(e => e.universe_id === id)].sort((a, b) => a.year - b.year);
  const locs = allLocations.filter(l => l.universe_id === id);
  const creatures = allCreatures.filter(cr => cr.universe_id === id);

  const getCharRaceNames = (charId: string) => {
    const raceIds = charRaces.filter(cr => cr.character_id === charId).map(cr => cr.race_id);
    return allRaces.filter(r => raceIds.includes(r.id)).map(r => r.name);
  };
  const getCharFactionNames = (charId: string) => {
    const factionIds = charFactions.filter(cf => cf.character_id === charId).map(cf => cf.faction_id);
    return allFactions.filter(f => factionIds.includes(f.id)).map(f => f.name);
  };

  const headerContent = (
    <div className="mb-6">
      {universe.image && (
        <div className="w-full max-w-2xl mx-auto h-48 rounded-lg overflow-hidden mb-4 border border-primary/20 glow-gold">
          <img src={universe.image} alt={universe.name} className="w-full h-full object-cover" />
        </div>
      )}
      <p className="font-cinzel text-primary/50 text-center text-sm tracking-widest uppercase mb-4">{universe.era}</p>
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {[
          { icon: <Swords size={14} />, label: "Personnages", count: chars.length },
          { icon: <Shield size={14} />, label: "Races", count: races.length },
          { icon: <ScrollText size={14} />, label: "Factions", count: facs.length },
          { icon: <Clock size={14} />, label: "Événements", count: evts.length },
          { icon: <MapPin size={14} />, label: "Lieux", count: locs.length },
          { icon: <Bug size={14} />, label: "Créatures", count: creatures.length },
        ].filter(s => s.count > 0).map(s => (
          <div key={s.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-xs text-muted-foreground">
            <span className="text-primary">{s.icon}</span> {s.count} {s.label}
          </div>
        ))}
      </div>
      <Link to="/univers" className="block text-center text-xs font-cinzel text-primary/40 hover:text-primary transition-colors">
        ← Retour aux Univers
      </Link>
    </div>
  );

  const chapters = [];

  // Prologue
  chapters.push({
    title: "Prologue",
    icon: <span>📜</span>,
    content: (
      <p className="font-crimson text-lg md:text-xl text-foreground/90 leading-relaxed italic text-center">
        "{universe.description}"
      </p>
    ),
  });

  // Personnages
  if (chars.length > 0) {
    chapters.push({
      title: `Personnages (${chars.length})`,
      icon: <Swords size={18} />,
      content: (
        <div className="grid sm:grid-cols-2 gap-3">
          {chars.map(c => {
            const raceNames = getCharRaceNames(c.id);
            const factionNames = getCharFactionNames(c.id);
            return (
              <Link key={c.id} to={`/personnages/${c.id}`} className="group flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-full bg-secondary flex-shrink-0 overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 group-hover:glow-gold transition-all">
                  {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">⚔️</div>}
                </div>
                <div className="min-w-0">
                  <h3 className="font-cinzel font-semibold text-primary group-hover:text-glow-gold truncate">{c.name}</h3>
                  <p className="text-sm text-muted-foreground font-crimson italic truncate">{c.title}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {raceNames.map(n => <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-cinzel">🧬 {n}</span>)}
                    {factionNames.map(n => <span key={n} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 font-cinzel">🏛️ {n}</span>)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ),
    });
  }

  // Races
  if (races.length > 0) {
    chapters.push({
      title: `Races (${races.length})`,
      icon: <Shield size={18} />,
      content: (
        <div className="space-y-4">
          {races.map(r => {
            const raceCharIds = charRaces.filter(cr => cr.race_id === r.id).map(cr => cr.character_id);
            const raceChars = chars.filter(c => raceCharIds.includes(c.id));
            return (
              <div key={r.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                <h3 className="font-cinzel text-lg font-semibold text-primary">{r.name}</h3>
                <p className="text-sm text-foreground/80 font-crimson mt-1">{r.description}</p>
                {r.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {r.traits.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-cinzel">✦ {t}</span>)}
                  </div>
                )}
                {raceChars.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground font-cinzel mb-1">Membres :</p>
                    <div className="flex flex-wrap gap-2">
                      {raceChars.map(c => (
                        <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold transition-all font-cinzel">⚔️ {c.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    });
  }

  // Factions
  if (facs.length > 0) {
    chapters.push({
      title: `Factions (${facs.length})`,
      icon: <ScrollText size={18} />,
      content: (
        <div className="space-y-4">
          {facs.map(f => {
            const facCharIds = charFactions.filter(cf => cf.faction_id === f.id).map(cf => cf.character_id);
            const facChars = chars.filter(c => facCharIds.includes(c.id));
            return (
              <div key={f.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                <h3 className="font-cinzel text-lg font-semibold text-primary">{f.name}</h3>
                <p className="text-xs text-primary/50 font-crimson italic">"{f.motto}"</p>
                <p className="text-sm text-foreground/80 font-crimson mt-2">{f.description}</p>
                {facChars.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground font-cinzel mb-1">Membres notables :</p>
                    <div className="flex flex-wrap gap-2">
                      {facChars.map(c => (
                        <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold transition-all font-cinzel">⚔️ {c.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ),
    });
  }

  // Chronologie
  if (evts.length > 0) {
    chapters.push({
      title: `Chronologie (${evts.length})`,
      icon: <Clock size={18} />,
      content: (
        <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
          {evts.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
              <div className="absolute -left-[29px] w-3.5 h-3.5 rounded-full bg-primary glow-gold border-2 border-background" />
              <div className="flex items-baseline gap-3">
                <span className="font-cinzel text-sm text-primary font-bold whitespace-nowrap">
                  {e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`}
                </span>
                {e.era && <span className="text-xs text-primary/40 font-cinzel">— {e.era}</span>}
              </div>
              <h3 className="font-cinzel font-semibold text-foreground mt-0.5">{e.title}</h3>
              <p className="text-sm text-muted-foreground font-crimson">{e.description}</p>
            </motion.div>
          ))}
        </div>
      ),
    });
  }

  // Lieux
  if (locs.length > 0) {
    chapters.push({
      title: `Lieux (${locs.length})`,
      icon: <MapPin size={18} />,
      content: (
        <div className="grid sm:grid-cols-2 gap-3">
          {locs.map(l => (
            <div key={l.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary/60" />
                <h3 className="font-cinzel font-semibold text-primary">{l.name}</h3>
              </div>
              <span className="text-xs text-primary/40 font-cinzel">{l.type}</span>
              <p className="text-sm text-foreground/80 font-crimson mt-2">{l.description}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  // Bestiaire
  if (creatures.length > 0) {
    chapters.push({
      title: `Bestiaire (${creatures.length})`,
      icon: <Bug size={18} />,
      content: (
        <div className="space-y-4">
          {creatures.map(cr => (
            <div key={cr.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10 flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 overflow-hidden border border-primary/20">
                {cr.image ? <img src={cr.image} alt={cr.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🐉</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-cinzel font-semibold text-primary">{cr.name}</h3>
                  <DangerStars level={cr.danger_level} />
                </div>
                <p className="text-xs text-primary/40 font-cinzel">Habitat : {cr.habitat}</p>
                <p className="text-sm text-foreground/80 font-crimson mt-1">{cr.description}</p>
                {cr.abilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cr.abilities.map(a => <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive/80 font-cinzel">⚡ {a}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ),
    });
  }

  // Other universes navigation
  const otherUniverses = universes.filter(u => u.id !== id);
  if (otherUniverses.length > 0) {
    chapters.push({
      title: "Autres Tomes",
      icon: <span>📚</span>,
      content: (
        <div className="flex flex-wrap justify-center gap-4">
          {otherUniverses.map(u => (
            <Link key={u.id} to={`/univers/${u.id}`} className="px-5 py-3 rounded-lg bg-secondary/30 border border-primary/20 hover:border-primary/50 hover:glow-gold text-sm font-cinzel text-primary/70 hover:text-primary transition-all">
              📕 {u.name}
            </Link>
          ))}
        </div>
      ),
    });
  }

  return (
    <Layout>
      <GrimoireBook
        title={universe.name}
        subtitle={`Tome du Multivers — ${universe.era}`}
        headerContent={headerContent}
        chapters={chapters}
      />
    </Layout>
  );
};

export default UniversDetailPage;
