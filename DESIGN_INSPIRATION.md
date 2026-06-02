# Design Inspiration Notes

Reference set captured May 28, 2026 for the next visual direction of kuberbassi.com.

## Priority

1. https://www.thorgal.com/ - primary inspiration
2. https://enerblock.net/en/ - secondary inspiration
3. https://www.sazabi.com/
4. https://pixila.net/
5. https://mina-massoud.com/

## North Star

Build kuberbassi.com like an interactive identity world, not a normal portfolio. The site should feel cinematic, authored, and navigable through scenes. It should still be usable, but the first impression should be closer to entering a crafted universe than scrolling a resume.

The refined theme direction is mature enchantment: old mystical atmosphere, arcane interface language, restrained sorcery, and a slight cinematic anime influence. It should feel like a serious animated title sequence or interactive codex, not childish fantasy.

The best direction is:

- Thorgal's story-gate structure and atmosphere.
- Enerblock's architectural discipline, numbering, and systems language.
- Sazabi's product-like interface moments and interaction confidence.
- Pixila's high-altitude metaphor and bold typographic staging.
- Mina Massoud's personal mythology, chapter structure, and dramatic identity writing.

## Reference Breakdown

### Thorgal

Use as the strongest guide.

What to borrow:

- A portal or gate-based homepage where sections feel like doors into worlds.
- Numbered navigation such as 01 Universe, 02 Albums, 03 Characters.
- Full-screen atmosphere with minimal text and strong discovery cues.
- Audio-aware affordances only if they add mood and can be muted clearly.
- "Scroll to explore" behavior that makes movement feel intentional.

How it maps to this site:

- Root homepage can become a world-selection interface for Kuber's two identities.
- Developer and music paths can be framed as different "realms" instead of simple cards.
- Use scene transitions, section labels, and large cinematic imagery or generated visuals.

Avoid copying:

- Fantasy-specific medieval styling.
- Overly obscure navigation that hides core portfolio content.

### Enerblock

Use as the structural and systems reference.

What to borrow:

- Editorial grid with technical numbering and precise section labels.
- Industrial confidence: restrained motion, strong hierarchy, controlled whitespace.
- Case-study style project blocks with project codes, titles, and short proof points.
- Repeated system language: approach, solutions, projects, value, certification.

How it maps to this site:

- Developer portfolio should feel like a controlled operating system for projects.
- Projects can use codes like P001, P002, P003.
- Skill areas can be presented as "systems" instead of generic skill chips.

Avoid copying:

- Corporate construction tone.
- Excessively dry copy.

### Sazabi

Use for modern interaction and interface energy.

What to borrow:

- Feature tabs that change the visible product/interface example.
- Chat, alert, terminal, or agent-like UI panels as proof moments.
- Bold section phrases with product confidence.
- Motion that makes UI demos feel alive.

How it maps to this site:

- Developer page can show live-feeling interface cards: GitHub activity, project diagnostics, stack signals, current focus.
- Use "agentic" UI sparingly so it supports Kuber's developer identity rather than turning the whole site into a SaaS page.

Avoid copying:

- Startup landing page formula.
- Too many fake dashboards.

### Pixila

Use for adventurous agency/studio energy.

What to borrow:

- Big fragmented headline composition.
- A clear metaphor that runs through the page.
- Portfolio work presented as milestones on a journey.
- Confident "studio craft" tone.

How it maps to this site:

- Music page can lean into ascent, signal, resonance, stage, frequency, and catalogue as terrain.
- Developer page can use "systems built under pressure" rather than generic web-dev language.

Avoid copying:

- Repeating the mountain theme too literally.
- Decorative symbols that do not serve navigation or content.

### Mina Massoud

Use for personal mythology and intensity.

What to borrow:

- Chapter-based page sections.
- Identity manifesto language.
- Strong personal positioning rather than bland professional biography.
- Mask/ritual/forge-like visual metaphors if adapted to Kuber's own identity.

How it maps to this site:

- Kuber's site can have a sharper personal voice: producer, builder, performer, engineer.
- Replace generic "About me" with a manifesto-style section that still gives real facts.
- Use cinematic portraits or generated symbolic assets for section anchors.

Avoid copying:

- Japanese/samurai motifs unless they are personally authentic to Kuber.
- Excessive dramatic copy that buries practical information.

## Synthesized Direction

### Visual System

- Background: dark, cinematic, textured, with real or generated visual assets; arcane rings, relic light, and old-world atmosphere are welcome when subtle.
- Palette: black/charcoal foundation, bone or parchment text, amber/gold accents, violet/indigo aura, occasional ember red for intensity.
- Typography: large condensed display type for scene titles, clean sans for body, mono for codes and system labels.
- Layout: full-screen scenes, vertical chapters, split identity portals, numbered navigation, codex-like project decks, technical overlays.
- Motion: scroll-driven reveals, parallax depth, gate transitions, floating relics, hover states that expose hidden metadata.

### Information Architecture

Recommended root flow:

1. Entry scene: Kuber Bassi as the first signal, not tiny nav text.
2. Two primary portals: Developer and Music.
3. Identity manifesto: concise statement of what connects both worlds.
4. Featured work: selected projects and tracks/releases.
5. Proof signals: GitHub, streaming, videos, stats, tools.
6. Contact/invite: direct, cinematic, simple.

Recommended developer flow:

1. System boot or entry state.
2. Current role and positioning.
3. Featured project deck.
4. Stack and capabilities as systems.
5. GitHub/live proof.
6. Contact.

Recommended music flow:

1. Stage or signal entry.
2. Featured release.
3. Catalogue.
4. Videos.
5. Streaming links and listener stats.
6. Contact/bookings.

## Concrete Build Ideas

- Replace the root split screen with a Thorgal-like "two doors" experience.
- Add numbered section anchors: 01 Signal, 02 Systems, 03 Catalogue, 04 Proof, 05 Invite.
- Create a reusable `ChapterHeader` component for labels, numbers, and section titles.
- Create a reusable `PortalCard` component for Developer and Music entry points.
- Convert project cards into coded case studies inspired by Enerblock.
- Add one atmospheric generated hero image per identity.
- Use terminal/chat/interface panels on the developer page, inspired by Sazabi.
- Use album art, waveform, and stage-light visuals on the music page.

## Design Rules For This Site

- Do make it immersive, cinematic, and authored.
- Do let the mystical theme read as old, refined, and serious.
- Do keep navigation obvious even when the visuals are dramatic.
- Do let the two identities feel different but part of one larger system.
- Do use real work, real releases, and real project proof wherever possible.
- Do not make it a generic Awwwards clone.
- Do not make the sorcery/anime influence childish, toy-like, or cosplay-heavy.
- Do not borrow fantasy, construction, mountain, or samurai themes literally.
- Do not hide portfolio substance behind effects.
- Do not overuse cards; use full-width scenes and focused repeated items.

## Implementation Order

1. Root homepage direction and layout.
2. Shared design tokens: color, type, spacing, section labels.
3. Portal and chapter components.
4. Developer page project deck redesign.
5. Music page hero and catalogue treatment.
6. Motion polish and accessibility pass.
7. Performance pass for images, WebGL, and scroll effects.
