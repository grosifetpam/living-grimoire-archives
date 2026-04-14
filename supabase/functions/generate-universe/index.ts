import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name } = await req.json();
    if (!name) throw new Error("Le nom de l'univers est requis");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Tu es un worldbuilder expert. À partir du titre "${name}", invente un univers complet, riche et cohérent en français.

Génère un JSON valide avec EXACTEMENT cette structure (sans commentaires, sans markdown):
{
  "universe": {
    "name": "${name}",
    "description": "Description immersive de l'univers (5-8 phrases avec contexte, ambiance, enjeux)",
    "era": "Nom de l'ère actuelle",
    "history": "Histoire complète de l'univers depuis sa création jusqu'à l'époque actuelle (10-15 phrases)"
  },
  "races": [
    {
      "name": "Nom de la race",
      "description": "Description détaillée avec culture, apparence, mode de vie (3-5 phrases)",
      "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"]
    }
  ],
  "factions": [
    {
      "name": "Nom de la faction",
      "description": "Description avec objectifs, idéologie, territoire (3-5 phrases)",
      "member_count": 500,
      "motto": "Devise emblématique"
    }
  ],
  "families": [
    {
      "name": "Nom de la famille/lignée",
      "description": "Histoire de la lignée, réputation, rôle dans l'univers (3-5 phrases)",
      "motto": "Devise familiale",
      "faction_name": "Nom de la faction alliée (si applicable)"
    }
  ],
  "characters": [
    {
      "name": "Prénom Nom",
      "title": "Titre/surnom épique",
      "backstory": "Histoire personnelle détaillée avec motivations, traumatismes, objectifs (5-8 phrases)",
      "stats": { "force": 7, "agilite": 5, "intelligence": 8, "magie": 6, "charisme": 7 },
      "race_name": "Nom de la race",
      "faction_name": "Nom de la faction",
      "family_name": "Nom de la famille (si applicable, sinon null)",
      "relations": [
        { "target_name": "Nom d'un autre personnage", "type": "rival|allié|mentor|élève|amant|ennemi|parent|enfant|frère/sœur" }
      ]
    }
  ],
  "timeline_events": [
    {
      "year": -5000,
      "era": "Nom de l'ère",
      "title": "Titre de l'événement",
      "description": "Description avec conséquences et personnages impliqués (2-4 phrases)"
    }
  ],
  "locations": [
    {
      "name": "Nom du lieu",
      "description": "Description immersive avec ambiance, dangers, histoire (3-5 phrases)",
      "type": "Citadelle|Forêt|Montagne|Désert|Océan|Souterrain|Ville|Ruines|Temple|Marais"
    }
  ],
  "creatures": [
    {
      "name": "Nom de la créature",
      "description": "Description avec comportement, apparence, légendes associées (3-5 phrases)",
      "danger_level": 3,
      "habitat": "Habitat naturel",
      "abilities": ["Capacité 1", "Capacité 2", "Capacité 3"]
    }
  ]
}

RÈGLES CRITIQUES:
- 6-8 personnages principaux avec des histoires interconnectées
- 4-5 races distinctes avec cultures uniques
- 4-5 factions en conflit ou alliance
- 3-4 familles/lignées importantes avec des liens aux factions
- 8-12 événements chronologiques ordonnés couvrant plusieurs ères
- 5-7 lieux emblématiques
- 5-7 créatures uniques
- Chaque personnage DOIT avoir au moins 2 relations avec d'autres personnages
- Les stats sont entre 1 et 10, variées selon le personnage
- Le danger_level est entre 1 et 5
- Les personnages doivent référencer des races, factions et familles existantes
- L'histoire doit être riche en conflits, trahisons, alliances
- Tout doit être cohérent et interconnecté
- Réponds UNIQUEMENT avec le JSON`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI API error: ${aiRes.status} - ${errText}`);
    }

    const aiData = await aiRes.json();
    let content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("Pas de réponse de l'IA");

    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const generated = JSON.parse(content);

    // Save to Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // 1. Universe
    const { data: uniData, error: uniErr } = await sb
      .from("universes")
      .insert({
        name: generated.universe.name,
        description: `${generated.universe.description}\n\n---\n\n**Histoire:**\n${generated.universe.history || ""}`,
        era: generated.universe.era,
      })
      .select()
      .single();
    if (uniErr) throw uniErr;
    const universeId = uniData.id;

    // 2. Races
    const racesInsert = (generated.races || []).map((r: any) => ({
      name: r.name, description: r.description, traits: r.traits, universe_id: universeId,
    }));
    const { data: racesData, error: racesErr } = await sb.from("races").insert(racesInsert).select();
    if (racesErr) throw racesErr;

    // 3. Factions
    const factionsInsert = (generated.factions || []).map((f: any) => ({
      name: f.name, description: f.description, member_count: f.member_count || 0, motto: f.motto || "", universe_id: universeId,
    }));
    const { data: factionsData, error: factionsErr } = await sb.from("factions").insert(factionsInsert).select();
    if (factionsErr) throw factionsErr;

    // Build lookup maps
    const raceMap: Record<string, string> = {};
    for (const r of racesData!) raceMap[r.name.toLowerCase()] = r.id;
    const factionMap: Record<string, string> = {};
    for (const f of factionsData!) factionMap[f.name.toLowerCase()] = f.id;

    // 4. Characters
    const charIdMap: Record<string, string> = {};
    const allRelations: { sourceName: string; targetName: string; type: string }[] = [];

    for (const c of generated.characters || []) {
      const raceId = raceMap[c.race_name?.toLowerCase()] || null;
      const factionId = factionMap[c.faction_name?.toLowerCase()] || null;

      // Include family info in backstory
      let backstory = c.backstory || "";
      if (c.family_name) {
        backstory = `**Famille:** ${c.family_name}\n\n${backstory}`;
      }

      const { data: charData, error: charErr } = await sb
        .from("characters")
        .insert({
          name: c.name, title: c.title, backstory,
          stats: c.stats, universe_id: universeId,
          race_id: raceId, faction_id: factionId,
        })
        .select()
        .single();
      if (charErr) throw charErr;
      charIdMap[c.name.toLowerCase()] = charData.id;

      if (raceId) await sb.from("character_races").insert({ character_id: charData.id, race_id: raceId });
      if (factionId) await sb.from("character_factions").insert({ character_id: charData.id, faction_id: factionId });

      // Collect relations
      for (const rel of c.relations || []) {
        allRelations.push({ sourceName: c.name, targetName: rel.target_name, type: rel.type });
      }
    }

    // Store relations as enriched backstories (append to each character)
    for (const rel of allRelations) {
      const sourceId = charIdMap[rel.sourceName.toLowerCase()];
      const targetId = charIdMap[rel.targetName?.toLowerCase()];
      if (sourceId && targetId) {
        // Fetch current backstory and append relation
        const { data: current } = await sb.from("characters").select("backstory").eq("id", sourceId).single();
        if (current) {
          const updatedBackstory = `${current.backstory}\n\n**Relation:** ${rel.type} de ${rel.targetName}`;
          await sb.from("characters").update({ backstory: updatedBackstory }).eq("id", sourceId);
        }
      }
    }

    // 5. Timeline
    const eventsInsert = (generated.timeline_events || []).map((e: any) => ({
      year: e.year, era: e.era, title: e.title, description: e.description, universe_id: universeId,
    }));
    await sb.from("timeline_events").insert(eventsInsert);

    // 6. Locations
    const locsInsert = (generated.locations || []).map((l: any) => ({
      name: l.name, description: l.description, type: l.type, universe_id: universeId,
    }));
    await sb.from("locations").insert(locsInsert);

    // 7. Creatures
    const creaturesInsert = (generated.creatures || []).map((cr: any) => ({
      name: cr.name, description: cr.description,
      danger_level: Math.min(5, Math.max(1, cr.danger_level || 1)),
      habitat: cr.habitat, abilities: cr.abilities || [], universe_id: universeId,
    }));
    await sb.from("creatures").insert(creaturesInsert);

    // 8. Families as factions with special description
    for (const fam of generated.families || []) {
      const linkedFactionId = factionMap[fam.faction_name?.toLowerCase()] || null;
      const famDesc = `🏰 **Lignée Noble**\n\n${fam.description}\n\n**Devise:** ${fam.motto || "—"}${linkedFactionId ? `\n\n*Alliée à la faction correspondante*` : ""}`;
      await sb.from("factions").insert({
        name: `Maison ${fam.name}`,
        description: famDesc,
        member_count: Math.floor(Math.random() * 50) + 10,
        motto: fam.motto || "",
        universe_id: universeId,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      universe_id: universeId,
      summary: {
        characters: (generated.characters || []).length,
        races: (generated.races || []).length,
        factions: (generated.factions || []).length,
        families: (generated.families || []).length,
        events: (generated.timeline_events || []).length,
        locations: (generated.locations || []).length,
        creatures: (generated.creatures || []).length,
        relations: allRelations.length,
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
