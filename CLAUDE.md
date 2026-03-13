# CLAUDE.md — Oloisiri Namanga Hotel Website

## Always Do First
1. Read `brand-assets.html` — every colour, font, tone, and spacing decision lives there. Never stray from it.
2. Read `.claude/skills/frontend-design/SKILL.md` before writing any frontend code. No exceptions.

---

## Tech Stack
- Next.js (App Router)
- CSS Modules
- Fonts via `next/font/google` — Cormorant Garamond (display) + Jost (body/UI)
- Images via `next/image` with placeholder until real photos provided
- One `layout.tsx` — fixed sidebar + page shell. Never repeat per page.

---

## This Project
A luxury safari hotel on the Kenya–Tanzania border. The guest is an affluent traveller booking a premium stay. They are discerning. Every page must feel: unhurried, intentional, and worth it.

Aesthetic: **safari luxury** — organic, refined, deeply rooted in place. Reference brand assets for all visual decisions. Think Singita or Cottar's 1920s Camp, not a generic hotel template.

---

## Layout: Fixed Left Sidebar

The entire site uses a **fixed left sidebar** — always visible on desktop, collapses to a hamburger on mobile. Main content area scrolls independently to the right of the sidebar.

**Sidebar structure (top to bottom):**
- Oloisiri logo + "Namanga Hotel" wordmark
- Navigation links — each links to a **separate page** (see Pages below)
- Phone number with icon at the bottom
- Sidebar background: `--color-teal-dark` (`#082f2c`)
- Active page link: gold left-border indicator + slightly brighter text
- Hover: slow gold underline, CSS only

**Main content area:** `calc(100vw - sidebar-width)`, starts at left edge of content, scrolls normally.

---

## Pages & Sections

Build one **section** per prompt. Screenshot and approve before moving on. Never regenerate an approved section.

### Page 1: Home (`/`)
1. **Hero** — Full-height image slider (2–3 slides). Frosted glass / blurred arch card overlaid on image containing: eyebrow stars, headline, subheadline, CTA button ("Discover Suites"). Prev/next arrows. Slide counter (1/2).
2. **Reservation Bar** — Sticky bar below hero: Check In date | Check Out date | Adults counter (−/+) | Children counter (−/+) | "Check Availability" button. Dark background, gold accents.
3. **Welcome** — Eyebrow label, large serif heading, star rating + review count. Two arched portrait images flanking the text block (left and right).
4. **Amenities** — 6-tile icon grid: Bush Restaurant, Pool, Spa, Safari Drives, Cultural Tours, Laundry. Each tile: arched icon container, title, short description.
5. **Suites** — Eyebrow + heading. Three arched room image cards in a carousel. Each card: image fills arch, name + guest count + size overlaid at bottom. Prev/next arrows.
6. **Facilities** — Eyebrow + heading. Two large side-by-side image cards. Each has a stat overlay at the bottom (e.g. "24 Suites Available", "3 Dining Experiences") with a gold/teal banner.
7. **Instagram Feed** — Eyebrow "Our Instagram", large handle as heading, horizontal strip of 7 square images with Instagram icon overlay on hover.
8. **Footer** — Three columns: Address | Logo + social icons (Facebook, Instagram, X, YouTube) | Contact (phone + email). Dark background. Copyright line below.

### Page 2: Suites (`/suites`)
1. Page hero — atmospheric header image, page title overlaid
2. Suite listings — each suite: arched image, name, short description, guests, size, rate from, CTA ("Reserve")
3. Booking prompt — brief copy + "Begin Planning Your Visit" button

### Page 3: Experiences (`/experiences`)
1. Page hero
2. Experience cards — Safari Drives, Bush Dining, Spa & Wellness, Cultural Tours — image, title, description
3. Bespoke note — short copy block about tailored itineraries

### Page 4: About (`/about`)
1. Brand story — the land, the vision, the founders
2. Team — warm, brief, not corporate
3. Sustainability — Maasai community partnerships, land stewardship

### Page 5: Contact & Reservations (`/contact`)
1. Minimal header — logo only
2. Short intro copy
3. Reservation form — name, email, phone, arrival, departure, guests, suite preference, special requests
4. Alternate contact — email and phone only
5. Submit → inline thank-you (slides in, no page jump)

---

## Copy Tone
Always match brand assets tone-of-voice. Warm, unhurried, literary. Never salesy.

**Headline register:** "Where the wild meets the refined." / "A sanctuary at the edge of two nations."
**CTA register:** "Reserve Your Stay" / "Discover Suites" / "Begin Planning Your Visit"
**Never:** "Book NOW", "Best Price", "Don't Miss Out", exclamation marks

---

## Interactions — Non-Negotiable

**Scroll reveals**
- Every section fades in + translates up on viewport entry (IntersectionObserver, no library)
- Suite and amenity cards stagger in one by one with short delay
- Hero text layers in: headline first, then subheadline, then CTA

**Sidebar**
- Active page: gold left-border + slightly brighter text
- Hover: slow gold underline, CSS only
- Mobile: slides in from left with a dark overlay behind it

**Hero slider**
- Crossfade between slides (opacity transition, not slide)
- Frosted glass arch card stays fixed while background image changes behind it

**Suite & experience cards**
- Subtle lift on hover (`transform: translateY` only)
- Inner image slow zoom on hover (`transform: scale` on `img`)
- Overlay text fades up slightly on hover

**Reservation bar**
- Counter buttons (−/+) have immediate press feedback (scale down slightly)
- Date fields open a minimal native date picker

**Facilities stat banners**
- Large number counts up from 0 when section enters viewport (vanilla JS counter)

**Reservation form**
- Gold border focus states, no default browser outline
- Inline validation on submit
- Submit → loading state → slides into thank-you message, no page jump

**General animation rules**
- Only animate `transform` and `opacity` — never `width`, `height`, or `margin`
- Never use `transition-all`
- Reveals: 500–700ms, hover: 200ms
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` — refined, never bouncy
- No looping animations

---

## Hard Rules
- One section per prompt. Screenshot and approve before next.
- Always check brand assets before any colour, font, or copy decision.
- Never center-align body text (headings centred where layout calls for it).
- Never use generic hotel template patterns — this brand is specific.
- Never simplify or replace the reservation form.
- Never use `transition-all`.
- All images are `next/image` — use a teal placeholder until real photos are provided.
- Spacing is generous. When in doubt, add more whitespace.
- No WhatsApp anywhere on this site.
