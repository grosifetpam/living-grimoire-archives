import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  universes, getCharactersByUniverse, getRacesByUniverse,
  getFactionsByUniverse, getEventsByUniverse, getLocationsByUniverse
} from "@/data/mockData";
import { motion } from "framer-motion";

const UniversDetailPage = () => {
  const { id } = useParams();
  const universe = universes.find((u) => u.id === id);
  if (!universe) return <Layout><div className="min-h-screen flex items-center justify-center text-foreground">Univers introuvable</div></Layout>;

  const chars = getCharactersByUniverse(universe.id);
  const rcs = getRacesByUniverse(universe.id);
  const facs = getFactionsByUniverse(universe.id);
  const evts = getEventsByUniverse(universe.id);
  const locs = getLocationsByUniverse(universe.id);

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/univers" className="text-primary/60 hover:text-primary text-sm font-cinzel">← Retour aux Univers</Link>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold mt-4">{universe.name}</h1>
          <p className="text-primary/60 font-cinzel mt-1">{universe.era}</p>
          <p className="font-crimson text-lg text-foreground/90 mt-6 leading-relaxed">{universe.description}</p>
        </motion.div>

        {/* Characters */}
        {chars.length > 0 && (
          <div className="mt-12">
            <h2 className="font-cinzel text-2xl font-bold text-primary mb-6">⚔️ Personnages</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {chars.map(c => (
                <Link key={c.id} to={`/personnages/${c.id}`} className="grimoire-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">⚔️</div>
                  <div>
                    <h3 className="font-cinzel font-semibold text-primary">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Races */}
        {rcs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-cinzel text-2xl font-bold text-primary mb-6">🧬 Races</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {rcs.map(r => (
                <div key={r.id} className="grimoire-card p-4">
                  <h3 className="font-cinzel font-semibold text-primary">{r.name}</h3>
                  <p className="text-sm text-foreground/80 mt-2 font-crimson">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Factions */}
        {facs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-cinzel text-2xl font-bold text-primary mb-6">🏛️ Factions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {facs.map(f => (
                <div key={f.id} className="grimoire-card p-4">
                  <h3 className="font-cinzel font-semibold text-primary">{f.name}</h3>
                  <p className="text-xs text-primary/60 italic font-crimson">"{f.motto}"</p>
                  <p className="text-sm text-foreground/80 mt-2 font-crimson">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {evts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-cinzel text-2xl font-bold text-primary mb-6">📅 Chronologie</h2>
            <div className="space-y-4 border-l-2 border-primary/30 pl-6">
              {evts.sort((a, b) => a.year - b.year).map(e => (
                <div key={e.id} className="relative">
                  <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-primary glow-gold" />
                  <p className="font-cinzel text-sm text-primary">{e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`}</p>
                  <h3 className="font-cinzel font-semibold text-foreground">{e.title}</h3>
                  <p className="text-sm text-muted-foreground font-crimson">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        {locs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-cinzel text-2xl font-bold text-primary mb-6">📍 Lieux</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {locs.map(l => (
                <div key={l.id} className="grimoire-card p-4">
                  <h3 className="font-cinzel font-semibold text-primary">{l.name}</h3>
                  <p className="text-xs text-primary/60">{l.type}</p>
                  <p className="text-sm text-foreground/80 mt-2 font-crimson">{l.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default UniversDetailPage;
