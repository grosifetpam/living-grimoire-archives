import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", label: "Accueil", rune: "ᚠ" },
  { path: "/univers", label: "Univers", rune: "ᚢ" },
  { path: "/personnages", label: "Personnages", rune: "ᚦ" },
  { path: "/races", label: "Races", rune: "ᚨ" },
  { path: "/factions", label: "Factions", rune: "ᚱ" },
  { path: "/chronologie", label: "Chronologie", rune: "ᚲ" },
  { path: "/lieux", label: "Lieux", rune: "ᚷ" },
  { path: "/bestiaire", label: "Bestiaire", rune: "ᚹ" },
  { path: "/cartes", label: "Cartes", rune: "ᚺ" },
];

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-cinzel text-lg font-bold text-primary flex items-center gap-2">
            <span className="text-2xl filter drop-shadow-[0_0_8px_hsl(var(--gold)/0.4)]">🐍</span>
            <span className="hidden sm:inline text-glow-gold">L'Archive</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded text-sm font-cinzel transition-all duration-200 hover:text-primary hover:bg-primary/10 group ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/60"
                }`}
              >
                <span className="text-primary/20 text-xs mr-1 group-hover:text-primary/40 transition-colors">{item.rune}</span>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`px-3 py-2 rounded text-sm font-cinzel transition-all duration-200 hover:text-accent hover:bg-accent/10 ${location.pathname === "/admin" ? "text-accent bg-accent/10" : "text-foreground/60"}`}>
                ⚙️ Admin
              </Link>
            )}
            {!isAdmin && (
              <Link to="/admin/login" className="px-3 py-2 rounded text-sm font-cinzel transition-all duration-200 text-foreground/30 hover:text-primary hover:bg-primary/10">
                🔑
              </Link>
            )}
          </div>

          {/* Search & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-48 md:w-64 bg-secondary/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/30"
                />
              </div>
            )}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-foreground/60 hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground/60 hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-primary/10">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded font-cinzel text-sm transition-all ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/60 hover:text-primary hover:bg-primary/10"
                }`}
              >
                <span className="text-primary/20 text-xs mr-2">{item.rune}</span>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded font-cinzel text-sm text-accent bg-accent/10">⚙️ Admin</Link>
            )}
            {!isAdmin && (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded font-cinzel text-sm text-foreground/30 hover:text-primary">🔑 Connexion Admin</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
