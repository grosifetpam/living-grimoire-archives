import { useState } from "react";
import Layout from "@/components/Layout";
import { timelineEvents, getUniverseName } from "@/data/mockData";
import { motion } from "framer-motion";

const ChronologiePage = () => {
  const eras = [...new Set(timelineEvents.map(e => e.era))];
  const [selectedEra, setSelectedEra] = useState<string>("all");
  
  const filtered = selectedEra === "all"
    ? [...timelineEvents].sort((a, b) => a.year - b.year)
    : [...timelineEvents].filter(e => e.era === selectedEra).sort((a, b) => a.year - b.year);

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-4xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Chronologie</h1>
        <p className="text-center text-muted-foreground mb-8 font-crimson text-lg">Le fil du temps à travers le multivers</p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => setSelectedEra("all")} className={`px-3 py-1.5 rounded font-cinzel text-xs transition-all ${selectedEra === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
            Toutes
          </button>
          {eras.map(era => (
            <button key={era} onClick={() => setSelectedEra(era)} className={`px-3 py-1.5 rounded font-cinzel text-xs transition-all ${selectedEra === era ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
              {era}
            </button>
          ))}
        </div>

        <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-8 pb-10 group"
            >
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary glow-gold group-hover:glow-gold-strong transition-all" />
              <div className="grimoire-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-cinzel text-sm font-bold text-primary">
                    {e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`}
                  </span>
                  <span className="text-xs text-muted-foreground">· {e.era} · 🌍 {getUniverseName(e.universeId)}</span>
                </div>
                <h3 className="font-cinzel text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="font-crimson text-foreground/80 text-sm mt-2">{e.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default ChronologiePage;
