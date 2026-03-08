import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface GrimoireChapter {
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

interface GrimoireBookProps {
  title: string;
  subtitle?: string;
  chapters: GrimoireChapter[];
  headerContent?: ReactNode;
}

const GrimoireBook = ({ title, subtitle, chapters, headerContent }: GrimoireBookProps) => {
  const [openChapter, setOpenChapter] = useState<number>(0);
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto">
      {/* Book Cover / Opening */}
      <AnimatePresence mode="wait">
        {!isBookOpen ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90, transition: { duration: 0.5 } }}
            className="grimoire-book-cover mx-auto max-w-lg cursor-pointer"
            onClick={() => { playBookOpen(); setIsBookOpen(true); }}
            style={{ perspective: "1200px" }}
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] border-2 border-primary/40 rounded-sm p-12 md:p-16 text-center shadow-[inset_0_0_60px_rgba(0,0,0,0.3),0_0_30px_hsl(var(--gold)/0.2)]">
              {/* Book spine decoration */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary/30 to-transparent" />
              <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/20" />

              {/* Corner ornaments */}
              <div className="absolute top-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute top-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute bottom-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute bottom-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>

              {/* Central emblem */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                📖
              </motion.div>

              <div className="border-t border-b border-primary/30 py-6 my-4">
                <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-primary text-glow-gold leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="font-crimson text-primary/60 italic mt-3 text-lg">{subtitle}</p>
                )}
              </div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 flex items-center justify-center gap-2 text-primary/60 font-cinzel text-sm"
              >
                <BookOpen size={16} />
                <span>Cliquez pour ouvrir le grimoire</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pages"
            initial={{ opacity: 0, rotateY: -20 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Open book header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <button
                onClick={() => { playBookOpen(); setIsBookOpen(false); }}
                className="inline-flex items-center gap-1 text-primary/40 hover:text-primary text-xs font-cinzel mb-4 transition-colors"
              >
                <ChevronLeft size={12} /> Fermer le grimoire
              </button>
              <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-primary text-glow-gold">
                {title}
              </h1>
              {subtitle && (
                <p className="font-crimson text-muted-foreground italic mt-2 text-lg">{subtitle}</p>
              )}
            </motion.div>

            {headerContent}

            {/* Chapter tabs - like book page tabs */}
            <div className="grimoire-page-tabs flex flex-wrap gap-1 mb-1 justify-center">
              {chapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => { if (i !== openChapter) playPageTurn(); setOpenChapter(i); }}
                  className={`grimoire-tab px-4 py-2.5 font-cinzel text-xs md:text-sm flex items-center gap-2 transition-all rounded-t-lg border border-b-0 ${
                    openChapter === i
                      ? "bg-[hsl(var(--parchment-light))] border-primary/40 text-primary -mb-px z-10 relative"
                      : "bg-[hsl(var(--parchment))]/50 border-primary/15 text-primary/50 hover:text-primary/80 hover:bg-[hsl(var(--parchment))]/80"
                  }`}
                >
                  <span className="text-base">{ch.icon}</span>
                  <span className="hidden sm:inline">{ch.title}</span>
                </button>
              ))}
            </div>

            {/* Book page content */}
            <div className="grimoire-page relative">
              {/* Page border */}
              <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none" />
              {/* Spine shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-lg" />
              {/* Page edge */}
              <div className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

              <div className="bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] rounded-lg p-6 md:p-10 min-h-[400px] shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]">
                {/* Page header ornament */}
                <div className="text-center mb-6 pb-4 border-b border-primary/20">
                  <div className="text-primary/30 text-sm font-cinzel tracking-[0.3em]">
                    ✦ CHAPITRE {romanize(openChapter + 1)} ✦
                  </div>
                  <h2 className="font-cinzel text-2xl font-bold text-primary mt-2 flex items-center justify-center gap-3">
                    <span>{chapters[openChapter]?.icon}</span>
                    {chapters[openChapter]?.title}
                  </h2>
                </div>

                {/* Chapter content with animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={openChapter}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    {chapters[openChapter]?.content}
                  </motion.div>
                </AnimatePresence>

                {/* Page footer with navigation */}
                <div className="mt-8 pt-4 border-t border-primary/15 flex items-center justify-between">
                  <button
                    onClick={() => setOpenChapter(Math.max(0, openChapter - 1))}
                    disabled={openChapter === 0}
                    className="flex items-center gap-1 font-cinzel text-xs text-primary/50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} /> Page précédente
                  </button>
                  <span className="text-xs text-primary/30 font-cinzel">
                    — {openChapter + 1} / {chapters.length} —
                  </span>
                  <button
                    onClick={() => setOpenChapter(Math.min(chapters.length - 1, openChapter + 1))}
                    disabled={openChapter === chapters.length - 1}
                    className="flex items-center gap-1 font-cinzel text-xs text-primary/50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Page suivante <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function romanize(num: number): string {
  const lookup: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of lookup) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export default GrimoireBook;
