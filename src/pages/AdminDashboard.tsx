import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import {
  useUniverses, useCharacters, useRaces, useFactions,
  useTimelineEvents, useLocations, useCreatures,
  useCharacterFactions, useSetCharacterFactions,
  useUpsert, useDelete,
} from "@/hooks/useSupabaseData";
import type { Universe, Character, Race, Faction, TimelineEvent, Location, Creature } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

type Tab = "universes" | "characters" | "races" | "factions" | "events" | "locations" | "creatures";

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "universes", label: "Univers", icon: "🌍" },
  { key: "characters", label: "Personnages", icon: "⚔️" },
  { key: "races", label: "Races", icon: "🧬" },
  { key: "factions", label: "Factions", icon: "🏛️" },
  { key: "events", label: "Chronologie", icon: "📅" },
  { key: "locations", label: "Lieux", icon: "📍" },
  { key: "creatures", label: "Bestiaire", icon: "🐉" },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("universes");

  if (authLoading) return <Layout><div className="min-h-screen flex items-center justify-center text-foreground">Chargement...</div></Layout>;
  if (!user) { navigate("/admin/login"); return null; }
  if (!isAdmin) return <Layout><div className="min-h-screen flex items-center justify-center text-foreground font-cinzel">⚠️ Accès réservé aux administrateurs</div></Layout>;

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-primary text-glow-gold">Dashboard Admin</h1>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }} className="font-cinzel gap-2">
            <LogOut size={16} /> Déconnexion
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded font-cinzel text-sm transition-all ${activeTab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === "universes" && <UniversesAdmin />}
        {activeTab === "characters" && <CharactersAdmin />}
        {activeTab === "races" && <RacesAdmin />}
        {activeTab === "factions" && <FactionsAdmin />}
        {activeTab === "events" && <EventsAdmin />}
        {activeTab === "locations" && <LocationsAdmin />}
        {activeTab === "creatures" && <CreaturesAdmin />}
      </section>
    </Layout>
  );
};

// ============ CRUD SECTIONS ============

function UniversesAdmin() {
  const { data = [], isLoading } = useUniverses();
  const upsert = useUpsert("universes");
  const del = useDelete("universes");
  const [editing, setEditing] = useState<Partial<Universe> | null>(null);

  const save = async () => {
    if (!editing?.name) return;
    try {
      await upsert.mutateAsync(editing as Record<string, unknown>);
      toast({ title: "Sauvegardé ✓" });
      setEditing(null);
    } catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet univers ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => setEditing({ name: "", description: "", era: "", image: null })} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter un Univers</Button>

      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Ère" value={editing.era ?? ""} onChange={e => setEditing({ ...editing, era: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[80px]" />
          <ImageUpload currentImage={editing.image} onImageChange={url => setEditing({ ...editing, image: url })} folder="universes" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.map(u => (
          <div key={u.id} className="grimoire-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {u.image && <img src={u.image} alt={u.name} className="w-10 h-10 rounded object-cover" />}
              <div>
                <h3 className="font-cinzel font-bold text-primary">{u.name}</h3>
                <p className="text-xs text-muted-foreground">{u.era}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setEditing(u)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(u.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharactersAdmin() {
  const { data = [], isLoading } = useCharacters();
  const { data: universes = [] } = useUniverses();
  const { data: racesList = [] } = useRaces();
  const { data: factionsList = [] } = useFactions();
  const { data: charFactions = [] } = useCharacterFactions();
  const upsert = useUpsert("characters");
  const del = useDelete("characters");
  const setCharFactions = useSetCharacterFactions();
  const [editing, setEditing] = useState<Partial<Character> | null>(null);
  const [selectedFactionIds, setSelectedFactionIds] = useState<string[]>([]);

  const getCharFactionIds = (charId: string) => charFactions.filter(cf => cf.character_id === charId).map(cf => cf.faction_id);

  const startEdit = (c?: Character) => {
    if (c) {
      setEditing(c);
      setSelectedFactionIds(getCharFactionIds(c.id));
    } else {
      setEditing({ name: "", title: "", backstory: "", universe_id: universes[0]?.id, image: null, stats: { force: 5, agilite: 5, intelligence: 5, magie: 5, charisme: 5 } });
      setSelectedFactionIds([]);
    }
  };

  const toggleFaction = (fid: string) => {
    setSelectedFactionIds(prev => prev.includes(fid) ? prev.filter(id => id !== fid) : [...prev, fid]);
  };

  const save = async () => {
    if (!editing?.name || !editing?.universe_id) return;
    try {
      const record = { ...editing };
      delete (record as any).faction_id; // ignore legacy field
      await upsert.mutateAsync(record as Record<string, unknown>);
      // Save factions via junction table
      const charId = editing.id || (await supabase.from("characters").select("id").eq("name", editing.name).single()).data?.id;
      if (charId) {
        await setCharFactions.mutateAsync({ characterId: charId, factionIds: selectedFactionIds });
      }
      toast({ title: "Sauvegardé ✓" });
      setEditing(null);
    } catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce personnage ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => startEdit()} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter un Personnage</Button>

      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Titre" value={editing.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            <option value="">-- Univers --</option>
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <select value={editing.race_id ?? ""} onChange={e => setEditing({ ...editing, race_id: e.target.value || null })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            <option value="">-- Race (optionnel) --</option>
            {racesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {/* Multi-select factions */}
          <div>
            <p className="text-sm font-cinzel text-foreground/70 mb-2">Factions (sélection multiple) :</p>
            <div className="flex flex-wrap gap-2">
              {factionsList.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFaction(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-cinzel transition-all border ${
                    selectedFactionIds.includes(f.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-foreground/60 border-primary/20 hover:border-primary/50"
                  }`}
                >
                  🏛️ {f.name}
                </button>
              ))}
            </div>
          </div>

          <textarea placeholder="Histoire" value={editing.backstory ?? ""} onChange={e => setEditing({ ...editing, backstory: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[80px]" />
          <ImageUpload currentImage={editing.image} onImageChange={url => setEditing({ ...editing, image: url })} folder="characters" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.map(c => {
          const cFactions = getCharFactionIds(c.id);
          const fNames = cFactions.map(fid => factionsList.find(f => f.id === fid)?.name).filter(Boolean);
          return (
            <div key={c.id} className="grimoire-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {c.image && <img src={c.image} alt={c.name} className="w-10 h-10 rounded object-cover" />}
                <div>
                  <h3 className="font-cinzel font-bold text-primary">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.title}{fNames.length > 0 && ` · 🏛️ ${fNames.join(", ")}`}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil size={16} /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(c.id)} className="text-destructive"><Trash2 size={16} /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
  const { data = [], isLoading } = useRaces();
  const { data: universes = [] } = useUniverses();
  const upsert = useUpsert("races");
  const del = useDelete("races");
  const [editing, setEditing] = useState<Partial<Race> | null>(null);
  const [traitsInput, setTraitsInput] = useState("");

  const startEdit = (r?: Race) => {
    if (r) { setEditing(r); setTraitsInput(r.traits.join(", ")); }
    else { setEditing({ name: "", description: "", universe_id: universes[0]?.id, traits: [] }); setTraitsInput(""); }
  };

  const save = async () => {
    if (!editing?.name || !editing?.universe_id) return;
    const record = { ...editing, traits: traitsInput.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      await upsert.mutateAsync(record as Record<string, unknown>);
      toast({ title: "Sauvegardé ✓" }); setEditing(null);
    } catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => startEdit()} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter une Race</Button>
      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[60px]" />
          <Input placeholder="Traits (séparés par des virgules)" value={traitsInput} onChange={e => setTraitsInput(e.target.value)} className="bg-secondary/50 border-primary/30" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {data.map(r => (
          <div key={r.id} className="grimoire-card p-4 flex items-center justify-between">
            <div><h3 className="font-cinzel font-bold text-primary">{r.name}</h3><p className="text-xs text-muted-foreground">{r.traits.join(", ")}</p></div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => startEdit(r)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FactionsAdmin() {
  const { data = [], isLoading } = useFactions();
  const { data: universes = [] } = useUniverses();
  const upsert = useUpsert("factions");
  const del = useDelete("factions");
  const [editing, setEditing] = useState<Partial<Faction> | null>(null);

  const save = async () => {
    if (!editing?.name || !editing?.universe_id) return;
    try { await upsert.mutateAsync(editing as Record<string, unknown>); toast({ title: "Sauvegardé ✓" }); setEditing(null); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => setEditing({ name: "", description: "", motto: "", member_count: 0, universe_id: universes[0]?.id })} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter une Faction</Button>
      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Devise" value={editing.motto ?? ""} onChange={e => setEditing({ ...editing, motto: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input type="number" placeholder="Membres" value={editing.member_count ?? 0} onChange={e => setEditing({ ...editing, member_count: parseInt(e.target.value) || 0 })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[60px]" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {data.map(f => (
          <div key={f.id} className="grimoire-card p-4 flex items-center justify-between">
            <div><h3 className="font-cinzel font-bold text-primary">{f.name}</h3><p className="text-xs text-muted-foreground italic">"{f.motto}" · {f.member_count} membres</p></div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setEditing(f)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(f.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsAdmin() {
  const { data = [], isLoading } = useTimelineEvents();
  const { data: universes = [] } = useUniverses();
  const upsert = useUpsert("timeline_events");
  const del = useDelete("timeline_events");
  const [editing, setEditing] = useState<Partial<TimelineEvent> | null>(null);

  const save = async () => {
    if (!editing?.title || !editing?.universe_id) return;
    try { await upsert.mutateAsync(editing as Record<string, unknown>); toast({ title: "Sauvegardé ✓" }); setEditing(null); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => setEditing({ title: "", description: "", era: "", year: 0, universe_id: universes[0]?.id })} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter un Événement</Button>
      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Titre" value={editing.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input type="number" placeholder="Année" value={editing.year ?? 0} onChange={e => setEditing({ ...editing, year: parseInt(e.target.value) || 0 })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Ère" value={editing.era ?? ""} onChange={e => setEditing({ ...editing, era: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[60px]" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {[...data].sort((a, b) => a.year - b.year).map(e => (
          <div key={e.id} className="grimoire-card p-4 flex items-center justify-between">
            <div><h3 className="font-cinzel font-bold text-primary">{e.title}</h3><p className="text-xs text-muted-foreground">{e.year > 0 ? `An ${e.year}` : `${Math.abs(e.year)} av.`} · {e.era}</p></div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setEditing(e)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(e.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationsAdmin() {
  const { data = [], isLoading } = useLocations();
  const { data: universes = [] } = useUniverses();
  const upsert = useUpsert("locations");
  const del = useDelete("locations");
  const [editing, setEditing] = useState<Partial<Location> | null>(null);

  const save = async () => {
    if (!editing?.name || !editing?.universe_id) return;
    try { await upsert.mutateAsync(editing as Record<string, unknown>); toast({ title: "Sauvegardé ✓" }); setEditing(null); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => setEditing({ name: "", description: "", type: "", universe_id: universes[0]?.id })} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter un Lieu</Button>
      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Type" value={editing.type ?? ""} onChange={e => setEditing({ ...editing, type: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[60px]" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {data.map(l => (
          <div key={l.id} className="grimoire-card p-4 flex items-center justify-between">
            <div><h3 className="font-cinzel font-bold text-primary">{l.name}</h3><p className="text-xs text-muted-foreground">{l.type}</p></div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setEditing(l)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(l.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreaturesAdmin() {
  const { data = [], isLoading } = useCreatures();
  const { data: universes = [] } = useUniverses();
  const upsert = useUpsert("creatures");
  const del = useDelete("creatures");
  const [editing, setEditing] = useState<Partial<Creature & { image?: string | null }> | null>(null);
  const [abilitiesInput, setAbilitiesInput] = useState("");

  const startEdit = (c?: Creature) => {
    if (c) { setEditing(c); setAbilitiesInput(c.abilities.join(", ")); }
    else { setEditing({ name: "", description: "", habitat: "", danger_level: 1, universe_id: universes[0]?.id, abilities: [], image: null }); setAbilitiesInput(""); }
  };

  const save = async () => {
    if (!editing?.name || !editing?.universe_id) return;
    const record = { ...editing, abilities: abilitiesInput.split(",").map(a => a.trim()).filter(Boolean) };
    try { await upsert.mutateAsync(record as Record<string, unknown>); toast({ title: "Sauvegardé ✓" }); setEditing(null); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    try { await del.mutateAsync(id); toast({ title: "Supprimé ✓" }); }
    catch (e: any) { toast({ title: "Erreur", description: e.message, variant: "destructive" }); }
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <Button onClick={() => startEdit()} className="mb-4 font-cinzel gap-2 shimmer-btn"><Plus size={16} /> Ajouter une Créature</Button>
      {editing && (
        <div className="grimoire-card p-6 mb-6 space-y-3">
          <Input placeholder="Nom" value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <Input placeholder="Habitat" value={editing.habitat ?? ""} onChange={e => setEditing({ ...editing, habitat: e.target.value })} className="bg-secondary/50 border-primary/30" />
          <select value={editing.danger_level ?? 1} onChange={e => setEditing({ ...editing, danger_level: parseInt(e.target.value) as any })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>Danger: {n}/5</option>)}
          </select>
          <select value={editing.universe_id ?? ""} onChange={e => setEditing({ ...editing, universe_id: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground">
            {universes.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <textarea placeholder="Description" value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-secondary/50 border border-primary/30 rounded-md px-3 py-2 text-foreground min-h-[60px]" />
          <Input placeholder="Capacités (séparées par des virgules)" value={abilitiesInput} onChange={e => setAbilitiesInput(e.target.value)} className="bg-secondary/50 border-primary/30" />
          <ImageUpload currentImage={(editing as any)?.image} onImageChange={url => setEditing({ ...editing, image: url })} folder="creatures" />
          <div className="flex gap-2">
            <Button onClick={save} className="font-cinzel shimmer-btn">Sauvegarder</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="font-cinzel">Annuler</Button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {data.map(c => (
          <div key={c.id} className="grimoire-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(c as any).image && <img src={(c as any).image} alt={c.name} className="w-10 h-10 rounded object-cover" />}
              <div><h3 className="font-cinzel font-bold text-primary">{c.name}</h3><p className="text-xs text-muted-foreground">Danger: {c.danger_level}/5 · {c.habitat}</p></div>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(c.id)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
