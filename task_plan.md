# Task Plan: Delong's Webpages — Sales Site

**Owner:** delong.cullen@gmail.com
**Created:** 2026-05-05
**Status:** in_progress

## Goal
Build and deploy an advanced, conversion-focused single-page (or low-multi-page) marketing site at **delongswebpages.com** (or chosen domain) that sells web design / web build services. Every section should funnel the visitor toward a single "Yes" — booking a call or submitting the lead form.

## Success Criteria
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- LCP < 2.0s, CLS < 0.05, INP < 200ms on mid-range mobile
- Renders cleanly on iPhone 13, Pixel 7, 1366×768 laptop, 4K desktop
- Lead form delivers submissions to inbox without spam noise
- Site deployed live on Cloudflare Pages with HTTPS + custom domain
- At least 3 distinct, intentional animation moments (hero, scroll reveals, micro-interactions) — not gratuitous

## Tech Stack (decided defaults — see Phase 1 for rationale)
- **Framework:** Astro 4.x (zero-JS by default, ships components hydrated only where needed)
- **Styling:** Tailwind CSS v4 + custom CSS variables for design tokens
- **Animation:** GSAP + ScrollTrigger for hero/scroll choreography; CSS animations for micro-interactions; Lenis for smooth scroll
- **Icons:** Lucide (tree-shakeable SVG)
- **Forms:** Cloudflare Pages Functions → email via Resend (or Web3Forms as a no-backend fallback)
- **Analytics:** Cloudflare Web Analytics (privacy-friendly, free)
- **Hosting:** Cloudflare Pages (Git-connected to GitHub)
- **Repo:** GitHub `delongswebpages` (or similar)

## Phases

### Phase 1: Discovery & Brand Strategy — `complete`
Define the offer, audience, voice, and single primary CTA. Gather brand assets (logo, colors, fonts, photography). Decide page architecture.
- Deliverables: `findings.md` updated with target persona, offer tiers, value props, objections, CTA copy, brand tokens
- Critical decisions: domain name, primary CTA ("Book a free 15-min call" vs "Get a quote"), tone, package tiers

### Phase 2: Design System & Wireframe — `complete`
Lock visual direction: color palette, type scale, spacing, motion language. Sketch sections in markdown wireframe.
- Deliverables: `design-system.md` with tokens; `wireframe.md` with section-by-section layout
- Sections planned: Hero → Social Proof → Problem/Promise → Services → Process → Portfolio → Pricing → Testimonials → FAQ → Final CTA → Footer

### Phase 3: Project Scaffold — `complete`
Initialize Astro project, Tailwind, GSAP, prettier/eslint, git, GitHub remote. Verify dev server runs.
- Deliverables: working `npm run dev`, committed initial scaffold, `.gitignore`, README
- Files: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `src/layouts/Base.astro`

### Phase 4: Hero + Navigation + Above-the-Fold — `complete`
The 5-second sell. Headline, subhead, primary CTA, secondary CTA, trust signal strip. Animated entrance (text reveal, gradient mesh, or canvas effect).
- Deliverables: `Hero.astro`, `Nav.astro` (sticky, blur-on-scroll), animated background

### Phase 5: Services + Process + Portfolio Sections — `complete`
What you do, how you do it, proof you've done it. Cards with hover states, scroll-triggered reveals.
- Deliverables: `Services.astro`, `Process.astro`, `Portfolio.astro` (placeholder slots if no work yet — use mockups)

### Phase 6: Pricing + Testimonials + FAQ — `complete`
Address objections head-on. Three-tier pricing with featured tier highlighted. Testimonial carousel or grid. Accordion FAQ.
- Deliverables: `Pricing.astro`, `Testimonials.astro`, `FAQ.astro`

### Phase 7: Final CTA + Contact Form + Footer — `complete`
The closer. Big, unmissable CTA section. Form posts to Pages Function → email. Footer with secondary links, social, legal.
- Deliverables: `CTA.astro`, `ContactForm.astro`, `Footer.astro`, `functions/api/contact.ts`

### Phase 8: Animation Choreography & Polish — `complete`
Apply GSAP ScrollTrigger reveals consistently. Lenis smooth scroll. Reduced-motion media query respected. Cursor effects (optional). Page transitions.
- Deliverables: `src/scripts/motion.ts`, `prefers-reduced-motion` fallbacks tested

### Phase 9: Performance, A11y, SEO Audit — `complete`
Lighthouse run, fix issues. Image optimization (Astro `<Image>` + AVIF/WebP). Meta tags, OG image, sitemap, robots.txt. Keyboard nav. Color contrast. Alt text.
- Deliverables: passing scores, `sitemap.xml`, `robots.txt`, OG image generated

### Phase 10: Deploy to GitHub + Cloudflare Pages — `pending (user action)`
Push to GitHub. Connect repo in Cloudflare Pages dashboard. Configure build (`npm run build`, output `dist`). Add custom domain, verify DNS, force HTTPS.
- Status: code is committed locally (commit `449a783`), README has step-by-step instructions
- Deliverables: live URL on `*.pages.dev` and on custom domain

### Phase 11: Post-Launch — `pending (user action)`
Submit sitemap to Google Search Console. Verify Cloudflare Web Analytics. Smoke test contact form end-to-end. Set up uptime monitoring (optional). Drop in real photo + portfolio screenshots + testimonials.
- Deliverables: live URL, real assets in place, form smoke-tested

## Errors Encountered
| Phase | Error | Attempt | Resolution |
|-------|-------|---------|------------|
| — | — | — | — |

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-05 | Astro over Next.js | Marketing site — Astro ships near-zero JS, faster LCP, simpler Cloudflare Pages deploy |
| 2026-05-05 | GSAP over Framer Motion | Astro is component-agnostic; GSAP works without React, ScrollTrigger is best-in-class |
| 2026-05-05 | Cloudflare Pages over Workers | Pages = static + Functions, simpler for marketing site; Workers overkill |
