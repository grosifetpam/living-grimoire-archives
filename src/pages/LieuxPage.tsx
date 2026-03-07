import Layout from "@/components/Layout";
import { useLocations, useUniverses } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";

const LieuxPage = () => {
  const { data: locations = [] } = useLocations();
  const { data: universes = [] } = useUniverses();

  const getUniverseName = (id: string) => universes.find(u => u.id === id)?.name || "Inconnu";

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary text-glow-gold text-center mb-4">Lieux</h1>
        <p className="text-center text-muted-foreground mb-12 font-crimson text-lg">Les terres et sanctuaires du multivers</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="grimoire-card p-6 group">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-cinzel text-lg font-bold text-primary group-hover:text-glow-gold transition-all">{l.name}</h3>
              <div className="flex gap-2 mt-1 text-xs text-muted-foreground"><span>{l.type}</span><span>· 🌍 {getUniverseName(l.universe_id)}</span></div>
              <p className="font-crimson text-foreground/80 text-sm mt-3">{l.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default LieuxPage;
