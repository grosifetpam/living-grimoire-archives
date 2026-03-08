import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full"
        >
          <div className="relative bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] border-2 border-primary/40 rounded-sm p-12 md:p-16 text-center shadow-[inset_0_0_60px_rgba(0,0,0,0.3),0_0_30px_hsl(var(--gold)/0.2)]">
            {/* Book spine */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary/30 to-transparent" />
            <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/20" />

            {/* Corner ornaments */}
            <div className="absolute top-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute top-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              📖
            </motion.div>

            <div className="border-t border-b border-primary/30 py-6 my-4">
              <h1 className="font-cinzel text-6xl font-bold text-primary text-glow-gold">404</h1>
              <p className="font-cinzel text-xl text-foreground/70 mt-2">Page Perdue</p>
            </div>

            <p className="font-crimson text-muted-foreground italic text-lg mb-8">
              Ce chapitre du grimoire semble avoir été arraché par des forces obscures...
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-cinzel text-sm hover:bg-primary/20 hover:border-primary/50 transition-all hover:glow-gold"
            >
              <BookOpen size={16} />
              Retourner au Grimoire
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default NotFound;
