import { useState } from "react";
import Layout from "@/components/Layout";
import { factions, getUniverseName } from "@/data/mockData";
import { motion } from "framer-motion";

const FactionsPage = () => {
  const [sort, setSort] = useState<"name" | "members">("name");
  const sorted = [...factions].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.memberCount - a.memberCount
  );

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Factions</h1>
        <p className="text-center text-muted-foreground mb-8 font-crimson text-lg">Les ordres et confréries du multivers</p>

        <div className="flex justify-center gap-3 mb-10">
          <button onClick={() => setSort("name")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "name" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>
            Alphabétique
          </button>
          <button onClick={() => setSort("members")} className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${sort === "members" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}>
            Par Membres
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {sorted.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grimoire-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl border border-primary/30">🏛️</div>
                <div className="flex-1">
                  <h3 className="font-cinzel text-xl font-bold text-primary">{f.name}</h3>
                  <p className="text-xs text-primary/60 italic font-crimson">"{f.motto}"</p>
                  <p className="text-xs text-muted-foreground mt-1">🌍 {getUniverseName(f.universeId)} · 👥 {f.memberCount} membres</p>
                  <p className="font-crimson text-foreground/80 text-sm mt-3">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FactionsPage;
