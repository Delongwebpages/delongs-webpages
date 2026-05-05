# Findings — Delong's Webpages

## User-Confirmed Decisions (2026-05-05)
| Question | Answer |
|----------|--------|
| Domain | TBD — user purchases later. Use `delongswebpages.com` as placeholder in metadata; no DNS work yet. |
| Existing portfolio | User has real work. Component will be built with placeholder slots; user swaps in screenshots/URLs at end. |
| Pricing model | **$1,000 per page** build cost + tiered monthly maintenance (see table below) |
| Logo | Wordmark only — generate as inline SVG / styled type. No graphical mark for v1. |
| About section | Include photo placeholder for the developer. User adds image post-launch. |
| Brand colors | **Undecided** — user will modify post-launch. Use strong default palette via CSS variables so swap is one-file. |
| Form delivery | TBD inbox — wire form with environment variable; user sets `CONTACT_RECIPIENT` after domain purchase. |

## Pricing Table (verbatim from user)

**Build:** $1,000 per page

**Monthly Maintenance Tiers:**

| | Light | Standard | Full |
|---|---|---|---|
| **Monthly price** | $25/mo | $60/mo | $120/mo |
| Hosting & domain renewal | Included | Included | Included |
| Content updates / month | 1 small | Up to 4 | Unlimited |
| New photos added | Add-on | Up to 10/mo | Unlimited |
| Seasonal page changes | Add-on | Included | Included |
| Response time | 48 hours | 24 hours | Same day |
| Phone support | Email only | Yes | Yes, priority |

**Featured tier on site:** Standard ($60/mo) — middle tier psychology, best perceived value.

## Persona
- **Primary:** Local small-business owners (trades, restaurants, boutiques) burned by templates / Wix clutter / half-finished cousin builds
- **Secondary:** Solopreneurs / consultants needing credible one-pager + lead capture
- **Pain points:** "I look unprofessional online," "my site is slow," "I can't update it without a developer," "Facebook isn't a website"
- **Objections:** price, time commitment, trust ("will you ghost me?"), "do I really need this?"

## Value Props
1. **Built fast, built right** — handcrafted, not template-stuffed
2. **Fast where it matters** — loads under 2 seconds, ranks in Google, looks great on every phone
3. **One developer, one point of contact, one clear price** — no agency runaround
4. **You own the code.** No platform lock-in, no surprise migrations.
5. **Maintained for the long haul** — pick a plan, we keep it humming

## Primary CTA — locked
**"Book a free 15-minute call"** as primary; **"See pricing"** as secondary anchor link.

## Brand Tokens (defaults — modifiable in `src/styles/tokens.css`)
- **Bg deep:** `#0A0E1A` (near-black ink)
- **Bg surface:** `#11162A`
- **Accent primary:** `#7C5CFF` (electric violet — premium, modern)
- **Accent secondary:** `#22D3EE` (cyan — supports gradients)
- **CTA / action:** `#FF6B4A` (warm orange — proven high-conversion contrast against violet)
- **Text:** `#F5F6FA` primary, `#A1A8C3` muted
- **Type display:** Fraunces (variable serif, premium feel)
- **Type body/UI:** Inter (variable, clean, fast)

## Section Architecture (page top → bottom)
1. **Nav** — sticky, blur-on-scroll, wordmark left, anchor links + CTA right
2. **Hero** — headline, subhead, dual CTA, animated gradient mesh + text reveal
3. **Social Proof Strip** — "Trusted by [logos / placeholder count]" or stat row
4. **Problem / Promise** — 3-up: "Slow site / Confusing builder / No SEO" → "Fast / Simple / Found"
5. **Services** — what gets built (landing pages, multi-page sites, redesigns)
6. **Process** — 4 steps: Call → Quote → Build → Launch
7. **Portfolio** — 3 project cards (placeholder until user supplies)
8. **Pricing** — $1,000/page card + 3-tier maintenance table (Standard featured)
9. **Testimonials** — 3 cards (placeholder until user supplies)
10. **FAQ** — accordion, 6–8 questions handling top objections
11. **About / Meet Your Developer** — photo placeholder + short bio + final trust nudge
12. **Final CTA** — full-bleed, big, single button + form fallback
13. **Footer** — wordmark, secondary nav, email, social, © year

## Animation Choreography Plan
- **Hero:** GSAP text-split reveal (headline letters/words), gradient mesh canvas drift, CTA pulse
- **Scroll reveals:** GSAP ScrollTrigger fade-up + stagger on every section heading + card grid
- **Micro:** card hover lift + accent border glow, button magnetic hover, FAQ accordion ease
- **Smooth scroll:** Lenis (respects `prefers-reduced-motion`)
- **Reduced motion:** all GSAP timelines feature-detect and bypass

## Open Items (deferred, not blocking)
- Real testimonial copy + author names
- Real portfolio screenshots / URLs (user has them — capture during Phase 5)
- Real "Meet Your Developer" photo + bio paragraph
- Final brand color decision (post-launch)
- Domain purchase + DNS (post-build)
- Email service signup (Resend recommended; or Web3Forms for zero-config)
- `CONTACT_RECIPIENT` env var value
