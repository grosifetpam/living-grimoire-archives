import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { universes, getCharactersByUniverse, getRacesByUniverse, getFactionsByUniverse } from "@/data/mockData";
import { motion } from "framer-motion";

const UniversPage = () => {
  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4"
        >
          Les Univers
        </motion.h1>
        <p className="text-center text-muted-foreground mb-12 font-crimson text-lg">
          Chaque tome renferme un monde entier à découvrir
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {universes.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={`/univers/${u.id}`}
                className="grimoire-card p-8 block group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-6xl mb-4 group-hover:animate-float">📕</div>
                  <h2 className="font-cinzel text-2xl font-bold text-primary group-hover:text-glow-gold transition-all">
                    {u.name}
                  </h2>
                  <p className="text-sm text-primary/60 font-cinzel mt-1">{u.era}</p>
                  <p className="font-crimson text-foreground/80 mt-4">{u.description}</p>
                  <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                    <span>⚔️ {getCharactersByUniverse(u.id).length} personnages</span>
                    <span>🧬 {getRacesByUniverse(u.id).length} races</span>
                    <span>🏛️ {getFactionsByUniverse(u.id).length} factions</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default UniversPage;
