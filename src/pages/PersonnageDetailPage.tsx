import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import GrimoireBook from "@/components/GrimoireBook";
import { useCharacters, useUniverses, useRaces, useFactions, useCharacterFactions, useCharacterRaces } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const PersonnageDetailPage = () => {
  const { id } = useParams();
  const { data: characters = [] } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: races = [] } = useRaces();
  const { data: factions = [] } = useFactions();
  const { data: charFactions = [] } = useCharacterFactions();
  const { data: charRaces = [] } = useCharacterRaces();

  const character = characters.find(c => c.id === id);
  if (!character) return <Layout><div className="min-h-screen flex items-center justify-center font-cinzel text-foreground">Personnage introuvable</div></Layout>;

  const universe = universes.find(u => u.id === character.universe_id);
  const characterRaceIds = charRaces.filter(cr => cr.character_id === character.id).map(cr => cr.race_id);
  const characterRaces = races.filter(r => characterRaceIds.includes(r.id));
  const characterFactionIds = charFactions.filter(cf => cf.character_id === character.id).map(cf => cf.faction_id);
  const characterFactions = factions.filter(f => characterFactionIds.includes(f.id));
  const sameUniverseChars = characters.filter(c => c.universe_id === character.universe_id && c.id !== character.id);

  const stats = character.stats as Record<string, number>;
  const statLabels = [
    { key: "force", label: "Force", icon: "💪" },
    { key: "agilite", label: "Agilité", icon: "🏃" },
    { key: "intelligence", label: "Intelligence", icon: "🧠" },
    { key: "magie", label: "Magie", icon: "✨" },
    { key: "charisme", label: "Charisme", icon: "👑" },
  ];

  const headerContent = (
    <div className="text-center mb-6">
      <div className="w-28 h-28 rounded-full bg-secondary mx-auto mb-3 overflow-hidden border-2 border-primary/40 glow-gold">
        {character.image ? <img src={character.image} alt={character.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">⚔️</div>}
      </div>
      <p className="text-primary/60 font-crimson italic text-lg">{character.title}</p>
      <div className="flex justify-center gap-2 mt-3 flex-wrap">
        {universe && (
          <Link to={`/univers/${universe.id}`} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-xs text-primary/70 hover:text-primary transition-all font-cinzel">
            🌍 {universe.name}
          </Link>
        )}
        {characterRaces.map(r => (
          <span key={r.id} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-xs text-primary/70 font-cinzel">🧬 {r.name}</span>
        ))}
        {characterFactions.map(f => (
          <span key={f.id} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-xs text-primary/70 font-cinzel">🏛️ {f.name}</span>
        ))}
      </div>
      {/* Music player */}
      {(character as any).music_url && (
        <div className="mt-4 max-w-sm mx-auto">
          <p className="text-xs text-primary/50 font-cinzel mb-1">🎵 Thème musical</p>
          <audio controls src={(character as any).music_url} className="w-full h-8" />
        </div>
      )}
      <Link to="/personnages" className="block text-xs font-cinzel text-primary/40 hover:text-primary transition-colors mt-3">← Retour aux Personnages</Link>
    </div>
  );

  const chapters = [];

  // Stats
  chapters.push({
    title: "Statistiques",
    icon: <span>📊</span>,
    content: (
      <div className="space-y-3">
        {statLabels.map(({ key, label, icon }) => {
          const val = stats[key] ?? 5;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="font-cinzel text-sm w-24 text-foreground/80">{label}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${val * 10}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full" style={{ background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--gold)))" }} />
              </div>
              <span className="font-cinzel text-sm text-primary w-8 text-right">{val}</span>
            </div>
          );
        })}
        <div className="text-center mt-4 pt-3 border-t border-primary/15">
          <span className="font-cinzel text-sm text-primary/60">Puissance totale : {Object.values(stats).reduce((a, b) => a + b, 0)} / 50</span>
        </div>
      </div>
    ),
  });

  // Histoire
  chapters.push({
    title: "Histoire",
    icon: <span>📜</span>,
    content: (
      <p className="font-crimson text-foreground/90 leading-relaxed text-lg">{character.backstory || "L'histoire de ce personnage reste à écrire..."}</p>
    ),
  });

  // Carte Oracle
  if ((character as any).card_image) {
    chapters.push({
      title: "Carte Oracle",
      icon: <span>🃏</span>,
      content: (
        <div className="text-center">
          <div className="inline-block rounded-xl border-2 border-primary/30 overflow-hidden shadow-[0_0_30px_hsl(var(--gold)/0.2)] hover:shadow-[0_0_50px_hsl(var(--gold)/0.4)] transition-shadow">
            <img src={(character as any).card_image} alt={`Carte oracle de ${character.name}`} className="max-w-xs w-full" />
          </div>
          <p className="text-sm text-muted-foreground font-crimson italic mt-3">Carte oracle de {character.name}</p>
        </div>
      ),
    });
  }

  // Races
  if (characterRaces.length > 0) {
    chapters.push({
      title: `Races (${characterRaces.length})`,
      icon: <span>🧬</span>,
      content: (
        <div className="space-y-4">
          {characterRaces.map(race => {
            const otherMembers = characters.filter(c => c.id !== character.id && charRaces.some(cr => cr.character_id === c.id && cr.race_id === race.id));
            return (
              <div key={race.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                <h3 className="font-cinzel text-lg font-semibold text-primary">{race.name}</h3>
                <p className="text-sm text-foreground/80 font-crimson mt-1">{race.description}</p>
                {race.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {race.traits.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-cinzel">✦ {t}</span>)}
                  </div>
                )}
                {otherMembers.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground font-cinzel mb-1">Autres {race.name} :</p>
                    <div className="flex flex-wrap gap-2">
                      {otherMembers.map(c => (
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
  if (characterFactions.length > 0) {
    chapters.push({
      title: `Factions (${characterFactions.length})`,
      icon: <span>🏛️</span>,
      content: (
        <div className="space-y-4">
          {characterFactions.map(faction => {
            const otherMembers = characters.filter(c => c.id !== character.id && charFactions.some(cf => cf.character_id === c.id && cf.faction_id === faction.id));
            return (
              <div key={faction.id} className="p-4 rounded-lg bg-secondary/20 border border-primary/10">
                <h3 className="font-cinzel text-lg font-semibold text-primary">{faction.name}</h3>
                <p className="text-xs text-primary/50 font-crimson italic mb-2">"{faction.motto}"</p>
                <p className="text-sm text-foreground/80 font-crimson">{faction.description}</p>
                {otherMembers.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground font-cinzel mb-1">Autres membres :</p>
                    <div className="flex flex-wrap gap-2">
                      {otherMembers.map(c => (
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

  // Other characters
  if (sameUniverseChars.length > 0) {
    chapters.push({
      title: `Compagnons de ${universe?.name || "l'univers"}`,
      icon: <span>⚔️</span>,
      content: (
        <div className="grid sm:grid-cols-2 gap-2">
          {sameUniverseChars.map(c => (
            <Link key={c.id} to={`/personnages/${c.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-primary/20 flex-shrink-0">
                {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">⚔️</div>}
              </div>
              <div className="min-w-0">
                <p className="font-cinzel text-sm text-primary group-hover:text-glow-gold truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground font-crimson truncate">{c.title}</p>
              </div>
            </Link>
          ))}
        </div>
      ),
    });
  }

  return (
    <Layout>
      <GrimoireBook
        title={character.name}
        subtitle={character.title}
        headerContent={headerContent}
        chapters={chapters}
      />
    </Layout>
  );
};

export default PersonnageDetailPage;
