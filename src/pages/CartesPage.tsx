import Layout from "@/components/Layout";
import { characters, getUniverseName, getRaceName, getFactionName } from "@/data/mockData";
import { motion } from "framer-motion";

const CartesPage = () => {
  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Cartes</h1>
        <p className="text-center text-muted-foreground mb-12 font-crimson text-lg">Les cartes de personnages du multivers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="grimoire-card overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 text-center border-b border-primary/20">
                <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center text-4xl border-2 border-primary/40 group-hover:glow-gold-strong transition-all">
                  ⚔️
                </div>
                <h3 className="font-cinzel text-xl font-bold text-primary">{c.name}</h3>
                <p className="text-sm text-primary/60 font-crimson italic">{c.title}</p>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>🌍 {getUniverseName(c.universeId)}</span>
                  <span>🧬 {getRaceName(c.raceId)}</span>
                </div>
                {c.factionId && (
                  <p className="text-xs text-muted-foreground">🏛️ {getFactionName(c.factionId)}</p>
                )}

                {/* Mini Stats */}
                <div className="grid grid-cols-5 gap-1 mt-3">
                  {Object.entries(c.stats).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-primary font-cinzel font-bold">{val}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{key.slice(0, 3)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-4">
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                    style={{ width: `${(Object.values(c.stats).reduce((a, b) => a + b, 0) / 50) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-1 font-cinzel">
                  Puissance totale: {Object.values(c.stats).reduce((a, b) => a + b, 0)}/50
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default CartesPage;
