# Thayná Müller · Portfolio v2

Personal portfolio of a **Frontend Engineer & UI/UX Designer** building AI-powered SaaS products.

🔗 **[thaynamuller.com](https://www.thaynamuller.com)**

Built with plain HTML, CSS and JavaScript — no framework, no build step. Motion and 3D come from GSAP and Three.js loaded via CDN.

---

## Sections

| Section | What's there |
| --- | --- |
| **Hero** | Full-bleed Shibuya Crossing photo, "Human-crafted UI / Not NPC design" headline, CTA to the case studies, and a scrolling ribbon marquee. |
| **About** | Short bio and background. |
| **Case Studies** | Project list with a fixed preview stage that crossfades a looping video when an item is hovered or focused. On touch devices, the stage follows the item closest to the center of the screen while scrolling. |
| **Melt transition** | Section divider made of SVG gooey filters with specular/diffuse lighting; drips animate on scroll with GSAP ScrollTrigger. A lighter filter is used on mobile. |
| **Skills & Tools** | Experience, education, languages and tools around a 3D avatar (`.glb`) that rotates and reacts to the mouse. Animated SVG connectors draw lines from each block to the avatar. |
| **Contact** | Game-inspired "Press start to connect" screen with a letter-glitch canvas background and cards for LinkedIn, e-mail (copies the address to the clipboard) and Instagram. |

### Case studies

| # | Project | Stack / tools | Link |
| --- | --- | --- | --- |
| 01 | My Trip Buddy | Expo, React Native, Node.js, Supabase | [GitHub](https://github.com/7hayMuller/my-trip-buddy) |
| 02 | Party Studio | Anthropic API, React, TypeScript, Node.js, Supabase | [Live](https://party-studio.vercel.app/) |
| 03 | Remedia | Figma, React Native, TypeScript, Expo | [Medium](https://medium.com/design-bootcamp/problem-analysis-market-research-3aefb2f3b8cf) |
| 04 | Itaú Financial | Figma | [Behance](https://www.behance.net/gallery/224709785/Itau-Financial-Planner) |
| 05 | Nearby | React Native, TypeScript, Expo | [GitHub](https://github.com/7hayMuller/nlw-nearby) |

---

## Features

- **i18n (PT / EN):** language is detected from the browser (`navigator.language`) and applied to every element with `data-i18n` / `data-i18n-alt`.
- **Performance:** preloaded display font, `srcset` for the hero image, lazy-loaded images, and the Three.js avatar only initializes when `#skills` enters the viewport (render loop pauses when out of view).
- **SEO:** meta description, canonical URL, Open Graph and Twitter cards, `Person` JSON-LD, `sitemap.xml` and `robots.txt`.
- **Responsive:** breakpoints at 1024, 900, 768 and 480px.

---

## Tech stack

| Area | Technologies |
| --- | --- |
| Core | HTML5, CSS3 (custom properties), vanilla JavaScript |
| Animation | GSAP 3.12 + ScrollTrigger, SVG filters, Canvas |
| 3D | Three.js r128 + GLTFLoader |
| Typography | Dirtyline (self-hosted), Cormorant Garamond, DM Mono (Google Fonts) |
| Deploy | GitHub Actions → AWS S3 + CloudFront |

### Design tokens

```css
--bg: #0a0a0f;
--white: #f5f2ed;
--accent: #7b2fff;
--font-display: "Dirtyline", sans-serif;
--font-body: "DM Mono", monospace;
```

---

## Project structure

```
index.html              Markup, metadata and inline SVG filters
css/main.css            Styles, tokens and breakpoints
js/
  main.js               Melt transition, 3D avatar, skill connectors,
                        project preview stage, e-mail copy
  i18n.js               PT/EN dictionaries and language detection
  letter-glitch.js      Canvas letter-glitch effect (contact background)
assets/
  fonts/                DirtyLine.woff2
  images/               Hero, about and decorative images
  models/avatar.glb     3D avatar
  videos/               Case study previews (.webm)
sitemap.xml, robots.txt
.github/workflows/      Deploy pipeline
```

---

## Running locally

No install needed. Serve the folder with any static server (opening `index.html` directly blocks the `.glb` model from loading):

```bash
git clone https://github.com/7hayMuller/portfolio-v2.git
cd portfolio-v2
python3 -m http.server 8000
# or: npx serve .
```

Then open `http://localhost:8000`.

---

## Deploy

Every push to `main` (or a manual `workflow_dispatch`) runs `.github/workflows/deploy.yml`, which:

1. Syncs the repository to the `thaynamuller-portfolio` S3 bucket (excluding `.git`, `.github` and `.claude`).
2. Invalidates the CloudFront cache.

Required repository secrets: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

---

## Contact

[LinkedIn](https://linkedin.com/in/thaynamuller) · [Instagram](https://instagram.com/th4ymuller) · thaynamuller88@gmail.com

© 2026 Thayná Müller. All rights reserved.
