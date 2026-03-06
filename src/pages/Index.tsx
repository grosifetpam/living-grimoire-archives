import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCounter from "@/components/StatCounter";
import { universes, characters, races, factions, timelineEvents } from "@/data/mockData";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-4xl"
        >
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-7xl font-bold text-primary text-glow-gold mb-6 leading-tight">
            L'Archive Vivante
            <br />
            <span className="text-foreground">du Multivers</span>
          </h1>
          <p className="font-crimson text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Explorez les secrets d'un multivers infini. Chaque page est un portail vers un monde oublié, 
            chaque mot une clé vers des mystères anciens.
          </p>
          <Link
            to="/univers"
            className="inline-block shimmer-btn text-primary-foreground font-cinzel font-semibold px-8 py-4 rounded-lg text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            ✦ Explorer le Multivers ✦
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12"
        >
          <StatCounter icon="🌍" label="Univers" end={universes.length} />
          <StatCounter icon="⚔️" label="Personnages" end={characters.length} />
          <StatCounter icon="🧬" label="Races" end={races.length} />
          <StatCounter icon="🏛️" label="Factions" end={factions.length} />
          <StatCounter icon="📅" label="Événements" end={timelineEvents.length} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 text-primary/50"
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="font-cinzel text-3xl font-bold text-primary text-glow-gold text-center mb-12">
          Univers à Explorer
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {universes.map((u) => (
            <Link key={u.id} to={`/univers/${u.id}`} className="grimoire-card p-6 block group">
              <div className="flex items-start gap-4">
                <span className="text-4xl">📖</span>
                <div>
                  <h3 className="font-cinzel text-xl font-semibold text-primary group-hover:text-glow-gold transition-all">
                    {u.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{u.era}</p>
                  <p className="font-crimson text-foreground/80 mt-3 line-clamp-2">{u.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
