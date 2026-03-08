import { useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { BookOpen, Volume2, VolumeX, ChevronLeft } from "lucide-react";
import { playPageTurn, playBookOpen, startAmbientMusic, stopAmbientMusic, isAmbientPlaying, startPaperRustle, updatePaperRustle, stopPaperRustle } from "@/lib/sounds";

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

const SWIPE_THRESHOLD = 60;

const GrimoireBook = ({ title, subtitle, chapters, headerContent }: GrimoireBookProps) => {
  const [openChapter, setOpenChapter] = useState<number>(0);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; size: number; opacity: number; rotation: number }>>([]);
  const particleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const dragRotateY = useTransform(dragX, [-200, 0, 200], [18, 0, -18]);
  const dragSkewY = useTransform(dragX, [-200, 0, 200], [-2, 0, 2]);
  const dragScale = useTransform(dragX, [-200, -100, 0, 100, 200], [0.97, 0.99, 1, 0.99, 0.97]);
  const dragShadow = useTransform(
    dragX,
    [-200, 0, 200],
    [
      "inset 30px 0 40px rgba(0,0,0,0.25), -10px 5px 20px rgba(0,0,0,0.15)",
      "inset 0 0 40px rgba(0,0,0,0.15)",
      "inset -30px 0 40px rgba(0,0,0,0.25), 10px 5px 20px rgba(0,0,0,0.15)",
    ]
  );
  const dragBrightness = useTransform(dragX, [-200, 0, 200], [0.92, 1, 0.92]);
  const dragFilter = useTransform(dragBrightness, (v) => `brightness(${v})`);

  const handleOpen = () => {
    playBookOpen();
    setIsBookOpen(true);
    startAmbientMusic();
    setMusicOn(true);
  };

  const handleClose = () => {
    playBookOpen();
    setIsBookOpen(false);
    stopAmbientMusic();
    setMusicOn(false);
  };

  const toggleMusic = () => {
    if (isAmbientPlaying()) { stopAmbientMusic(); setMusicOn(false); }
    else { startAmbientMusic(); setMusicOn(true); }
  };

  const burstParticles = useCallback((dir: 1 | -1) => {
    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const burst = Array.from({ length: 20 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      return {
        id: particleIdRef.current++,
        x: cx + dir * 40 + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * rect.height * 0.6,
        vx: Math.cos(angle) * speed + dir * 2,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 6 + 2,
        opacity: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 360,
      };
    });
    setParticles(prev => [...prev.slice(-30), ...burst]);
  }, []);

  const goToPage = (index: number) => {
    if (index === openChapter || index < 0 || index >= chapters.length) return;
    const dir = index > openChapter ? 1 : -1;
    setDirection(dir as 1 | -1);
    playPageTurn();
    burstParticles(dir as 1 | -1);
    setOpenChapter(index);
  };

  const nextPage = () => goToPage(openChapter + 1);
  const prevPage = () => goToPage(openChapter - 1);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      nextPage();
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      prevPage();
    }
  };

  // Spawn particles during drag
  const spawnParticles = useCallback((offsetX: number) => {
    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    const count = Math.floor(Math.min(Math.abs(offsetX) / 30, 4)) + 1;
    const newParticles = Array.from({ length: count }, () => {
      const edge = offsetX < 0 ? rect.width : 0;
      return {
        id: particleIdRef.current++,
        x: edge + (Math.random() - 0.5) * 40,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 3 + (offsetX < 0 ? -1 : 1) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * 360,
      };
    });
    setParticles(prev => [...prev.slice(-40), ...newParticles]);
  }, []);

  // Animate & decay particles
  useEffect(() => {
    if (particles.length === 0) return;
    const raf = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.08,
            opacity: p.opacity - 0.015,
            rotation: p.rotation + p.vx * 3,
          }))
          .filter(p => p.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [particles]);

  useEffect(() => {
    return () => { stopAmbientMusic(); };
  }, []);

  // Page flip 3D variants
  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 25 : -25,
      skewY: dir > 0 ? -3 : 3,
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.92,
      filter: "brightness(0.85)",
    }),
    center: {
      rotateY: 0,
      skewY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "brightness(1)",
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -25 : 25,
      skewY: dir > 0 ? 3 : -3,
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.92,
      filter: "brightness(0.85)",
    }),
  };

  return (
    <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {!isBookOpen ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, rotateY: -15 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90, transition: { duration: 0.5 } }}
            className="grimoire-book-cover mx-auto max-w-lg cursor-pointer"
            onClick={handleOpen}
            style={{ perspective: "1200px" }}
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] border-2 border-primary/40 rounded-sm p-12 md:p-16 text-center shadow-[inset_0_0_60px_rgba(0,0,0,0.3),0_0_30px_hsl(var(--gold)/0.2)]">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary/30 to-transparent" />
              <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/20" />
              <div className="absolute top-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute top-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute bottom-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
              <div className="absolute bottom-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>

              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >📖</motion.div>

              <div className="border-t border-b border-primary/30 py-6 my-4">
                <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-primary text-glow-gold leading-tight">{title}</h1>
                {subtitle && <p className="font-crimson text-primary/60 italic mt-3 text-lg">{subtitle}</p>}
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
            {/* Header controls */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button onClick={handleClose} className="inline-flex items-center gap-1 text-primary/40 hover:text-primary text-xs font-cinzel transition-colors">
                  <ChevronLeft size={12} /> Fermer le grimoire
                </button>
                <button onClick={toggleMusic} className="inline-flex items-center gap-1 text-primary/40 hover:text-primary text-xs font-cinzel transition-colors" title={musicOn ? "Couper la musique" : "Lancer la musique"}>
                  {musicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span className="hidden sm:inline">{musicOn ? "Musique ON" : "Musique OFF"}</span>
                </button>
              </div>
              <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-primary text-glow-gold">{title}</h1>
              {subtitle && <p className="font-crimson text-muted-foreground italic mt-2 text-lg">{subtitle}</p>}
            </motion.div>

            {headerContent}

            {/* Chapter dots / mini index */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {chapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all border ${
                    openChapter === i
                      ? "bg-primary/15 border-primary/40 text-primary scale-105"
                      : "bg-transparent border-primary/10 text-primary/35 hover:text-primary/70 hover:border-primary/25"
                  }`}
                >
                  <span className="text-sm">{ch.icon}</span>
                  <span className="hidden md:inline">{ch.title}</span>
                </button>
              ))}
            </div>

            {/* The book page with swipe */}
            <div
              ref={(el) => { containerRef.current = el; pageRef.current = el; }}
              className="grimoire-page relative select-none overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              {/* Golden particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute pointer-events-none z-30"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    opacity: p.opacity,
                    transform: `rotate(${p.rotation}deg)`,
                    background: `radial-gradient(circle, hsl(var(--gold)) 0%, hsl(var(--gold) / 0.3) 100%)`,
                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    boxShadow: `0 0 ${p.size * 2}px hsl(var(--gold) / ${p.opacity * 0.5})`,
                  }}
                />
              ))}
              <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none z-10" />
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none rounded-l-lg z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none rounded-r-lg z-10" />

              {/* Clickable page turn zones */}
              {openChapter > 0 && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-16 z-20 cursor-w-resize group"
                  onClick={prevPage}
                >
                  <div className="absolute inset-0 flex items-center justify-start pl-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                      <ChevronLeft size={16} className="text-primary/60" />
                    </div>
                  </div>
                </div>
              )}
              {openChapter < chapters.length - 1 && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-16 z-20 cursor-e-resize group"
                  onClick={nextPage}
                >
                  <div className="absolute inset-0 flex items-center justify-end pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm rotate-180">
                      <ChevronLeft size={16} className="text-primary/60" />
                    </div>
                  </div>
                </div>
              )}

              <motion.div
                className="bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] rounded-lg min-h-[450px] overflow-hidden"
                style={{
                  boxShadow: isDragging ? dragShadow : "inset 0 0 40px rgba(0,0,0,0.15)",
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={openChapter}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 28,
                      mass: 0.8,
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragStart={() => { setIsDragging(true); startPaperRustle(); }}
                    onDrag={(_, info) => { updatePaperRustle(Math.abs(info.offset.x) / 200); spawnParticles(info.offset.x); }}
                    onDragEnd={(e, info) => { stopPaperRustle(); handleDragEnd(e, info); }}
                    className="p-6 md:p-10 cursor-grab active:cursor-grabbing"
                    style={{
                      x: dragX,
                      rotateY: isDragging ? dragRotateY : 0,
                      skewY: isDragging ? dragSkewY : 0,
                      scale: isDragging ? dragScale : 1,
                      filter: isDragging ? dragFilter : "brightness(1)",
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                  >
                    {/* Page header */}
                    <div className="text-center mb-6 pb-4 border-b border-primary/20">
                      <div className="text-primary/30 text-sm font-cinzel tracking-[0.3em]">
                        ✦ CHAPITRE {romanize(openChapter + 1)} ✦
                      </div>
                      <h2 className="font-cinzel text-2xl font-bold text-primary mt-2 flex items-center justify-center gap-3">
                        <span>{chapters[openChapter]?.icon}</span>
                        {chapters[openChapter]?.title}
                      </h2>
                    </div>

                    {/* Page content */}
                    {chapters[openChapter]?.content}

                    {/* Page footer */}
                    <div className="mt-8 pt-4 border-t border-primary/15 flex items-center justify-center">
                      <span className="text-xs text-primary/30 font-cinzel">
                        — {openChapter + 1} / {chapters.length} —
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Page curl decoration */}
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none z-10">
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-tl from-primary/8 to-transparent rounded-tl-lg" />
              </div>
            </div>

            {/* Swipe hint */}
            <motion.p
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 3, duration: 1 }}
              className="text-center text-xs text-primary/30 font-crimson italic mt-3"
            >
              ← Glissez ou cliquez sur les bords pour tourner les pages →
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function romanize(num: number): string {
  const lookup: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let result = "";
  for (const [value, symbol] of lookup) {
    while (num >= value) { result += symbol; num -= value; }
  }
  return result;
}

export default GrimoireBook;
