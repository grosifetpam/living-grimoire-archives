

# L'Archive Vivante du Multivers

## Vision
An immersive dark fantasy encyclopedia site that feels like exploring a living magical grimoire. The uploaded image serves as the full-screen background with a dark overlay for readability.

## Design System
- **Colors**: Deep black (#0a0a0a), ancient brown/amber (#8B6914, #D4A843), gold (#FFD700), parchment (#2a1f14)
- **Typography**: Serif fonts for headings (medieval feel), clean readable body text
- **Effects**: Subtle golden particle animations, glowing hover effects, candlelight-style glows
- **Cards**: Parchment-textured borders with golden trim, hover glow animations

## Pages & Features

### 1. Navigation
- Fixed top navbar with mystical styling (semi-transparent dark with gold accents)
- Menu items: Accueil, Univers, Personnages, Races, Factions, Chronologie, Lieux, Bestiaire, Cartes
- Global search bar with golden glow effect
- Mobile hamburger menu

### 2. Accueil (Home)
- Full-screen hero with the uploaded image as background + dark overlay
- Animated title "L'Archive Vivante du Multivers" with golden glow
- "Explorer le Multivers" CTA button with shimmer effect
- Animated stat counters: Univers, Personnages, Races, Factions, Événements
- Floating golden particles animation

### 3. Univers
- Grid of clickable "book" cards (styled as ancient tomes)
- Each book opens a dedicated universe page with: description, linked characters, races, factions, and timeline
- Hover effect: book glows and slightly opens

### 4. Personnages (Characters)
- Card grid with character image placeholder + name
- Click opens a detailed character sheet (modal or page) with stats, backstory, universe, race, faction
- Hover: golden border glow

### 5. Races
- List/card layout with name + description
- Sort/filter buttons (alphabetical, by universe)
- Parchment-styled cards

### 6. Factions
- Similar to Races: list with name + description + sort/filter
- Faction emblem placeholder + member count

### 7. Chronologie (Timeline)
- Vertical interactive timeline with year markers and event descriptions
- Sort by era/universe
- Glowing connection lines between events

### 8. Lieux (Locations)
- Card grid with location name, description, and universe tag
- Hover reveals more details

### 9. Bestiaire (Bestiary)
- Creature cards with image placeholder, name, danger level
- Click opens detailed creature sheet

### 10. Cartes (Maps)
- Fantasy-styled character/location cards gallery
- Large display format for map viewing

## Technical Approach
- All data stored as local JSON/TypeScript mock data (no backend needed initially)
- React Router for all pages
- CSS particle animation for ambient effects
- Responsive design with mobile-first approach
- Background image used via CSS with dark overlay

## Data Structure
- Mock data files for: universes, characters, races, factions, events, locations, creatures
- Cross-referenced by IDs (e.g., characters linked to universes and factions)

