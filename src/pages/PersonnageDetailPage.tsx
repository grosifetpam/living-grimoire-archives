import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCharacters, useUniverses, useRaces, useFactions, useCharacterFactions, useCharacterRaces } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
  const sameRaceChars = characterRaceIds.length > 0
    ? characters.filter(c => c.id !== character.id && charRaces.some(cr => cr.character_id === c.id && characterRaceIds.includes(cr.race_id)))
    : [];
  const sameFactionChars = characterFactionIds.length > 0
    ? characters.filter(c => c.id !== character.id && charFactions.some(cf => cf.character_id === c.id && characterFactionIds.includes(cf.faction_id)))
    : [];

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
      <section className="min-h-screen py-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-primary/50 font-cinzel mb-6 flex-wrap">
            <Link to="/univers" className="hover:text-primary transition-colors">Univers</Link>
            <ChevronRight size={12} />
            {universe && <Link to={`/univers/${universe.id}`} className="hover:text-primary transition-colors">{universe.name}</Link>}
            <ChevronRight size={12} />
            <span className="text-primary">{character.name}</span>
          </div>

          {/* Hero */}
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-4 overflow-hidden border-2 border-primary/40 glow-gold">
              {character.image ? <img src={character.image} alt={character.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">⚔️</div>}
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold">{character.name}</h1>
            <p className="text-primary/60 font-crimson italic text-lg mt-1">{character.title}</p>

            {/* Tags with links */}
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {universe && (
                <Link to={`/univers/${universe.id}`} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-sm text-primary/70 hover:text-primary hover:border-primary/50 transition-all font-cinzel">
                  🌍 {universe.name}
                </Link>
              )}
              {characterRaces.map(r => (
                <span key={r.id} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-sm text-primary/70 font-cinzel">
                  🧬 {r.name}
                </span>
              ))}
              {characterFactions.map(f => (
                <span key={f.id} className="px-3 py-1 rounded-full bg-secondary/60 border border-primary/20 text-sm text-primary/70 font-cinzel">
                  🏛️ {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
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
                      <motion.div initial={{ width: 0 }} animate={{ width: `${val * 10}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full" />
                    </div>
                    <span className="font-cinzel text-sm text-primary w-8 text-right">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backstory */}
          <div className="mt-6 grimoire-card p-6">
            <h2 className="font-cinzel text-xl font-bold text-primary mb-4">Histoire</h2>
            <p className="font-crimson text-foreground/90 leading-relaxed text-lg">{character.backstory}</p>
          </div>

          {/* Race details */}
          {race && (
            <div className="mt-6 grimoire-card p-6">
              <h2 className="font-cinzel text-xl font-bold text-primary mb-2">Race : {race.name}</h2>
              <p className="text-sm text-foreground/80 font-crimson">{race.description}</p>
              {race.traits && race.traits.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {race.traits.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 font-cinzel">✦ {t}</span>
                  ))}
                </div>
              )}
              {sameRaceChars.length > 0 && (
                <div className="mt-3 pt-2 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground font-cinzel mb-1">Autres {race.name} :</p>
                  <div className="flex flex-wrap gap-2">
                    {sameRaceChars.map(c => (
                      <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold transition-all font-cinzel">
                        ⚔️ {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Faction details */}
          {characterFactions.map(faction => (
            <div key={faction.id} className="mt-6 grimoire-card p-6">
              <h2 className="font-cinzel text-xl font-bold text-primary mb-1">Faction : {faction.name}</h2>
              <p className="text-xs text-primary/50 font-crimson italic mb-2">"{faction.motto}"</p>
              <p className="text-sm text-foreground/80 font-crimson">{faction.description}</p>
              {(() => {
                const otherMembers = characters.filter(c => c.id !== character.id && charFactions.some(cf => cf.character_id === c.id && cf.faction_id === faction.id));
                return otherMembers.length > 0 ? (
                  <div className="mt-3 pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground font-cinzel mb-1">Autres membres :</p>
                    <div className="flex flex-wrap gap-2">
                      {otherMembers.map(c => (
                        <Link key={c.id} to={`/personnages/${c.id}`} className="text-xs px-2 py-1 rounded bg-secondary/50 text-primary hover:text-glow-gold transition-all font-cinzel">
                          ⚔️ {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ))}

          {/* Same universe characters */}
          {sameUniverseChars.length > 0 && (
            <div className="mt-6 grimoire-card p-6">
              <h2 className="font-cinzel text-xl font-bold text-primary mb-3">Autres personnages de {universe?.name}</h2>
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
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default PersonnageDetailPage;
