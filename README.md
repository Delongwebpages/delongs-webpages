# Delong's Webpages

Marketing + sales site for Delong's Webpages. Built with Astro 5, Tailwind v4, GSAP, and Lenis. Deploys to Cloudflare Pages.

## Quick start

```powershell
npm install
npm run dev      # local dev at http://localhost:4321
npm run build    # production build to dist/
npm run preview  # serve dist/ locally
```

Requires Node 18+ (you're on 25.9 — fine).

## Project layout

```
.
├── astro.config.mjs            # Astro + Tailwind + sitemap config
├── package.json
├── public/                     # static assets served as-is
│   ├── favicon.svg
│   ├── og-image.svg            # social share preview (1200×630)
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── Base.astro          # HTML shell, meta tags, JSON-LD
│   ├── components/
│   │   ├── Wordmark.astro
│   │   ├── Nav.astro           # sticky blur-on-scroll nav + mobile menu
│   │   ├── Hero.astro          # headline + dual CTA + animated bg
│   │   ├── SocialProof.astro   # animated counters
│   │   ├── ProblemPromise.astro
│   │   ├── Services.astro
│   │   ├── Process.astro       # 4-step timeline
│   │   ├── Portfolio.astro     # 3 placeholder project cards
│   │   ├── Pricing.astro       # $1k/page + 3-tier maintenance
│   │   ├── Testimonials.astro  # 3 placeholder quotes
│   │   ├── FAQ.astro           # 8-question accordion
│   │   ├── About.astro         # photo placeholder + bio
│   │   ├── FinalCTA.astro      # full-bleed CTA + form
│   │   ├── ContactForm.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   └── motion.ts           # GSAP ScrollTrigger + Lenis + form handling
│   ├── styles/
│   │   └── global.css          # Tailwind + design tokens
│   └── pages/
│       └── index.astro         # the one page
└── functions/
    └── api/
        └── contact.ts          # Cloudflare Pages Function (form handler)
```

## Customizing

### Brand colors (one file)

Edit the `@theme` block in `src/styles/global.css`. All colors are CSS variables —
change one value, the whole site rebrands.

```css
--color-bg: #0A0E1A;
--color-accent: #7C5CFF;
--color-cta: #FF6B4A;
/* …etc */
```

### Add real portfolio screenshots

1. Drop screenshots in `public/portfolio/` (e.g. `northpoint.webp`)
2. Edit `src/components/Portfolio.astro` — replace the placeholder `projects` array
   with real `name`, `type`, `description`, and add an `image` field pointing to your file
3. Replace the gradient placeholder div with `<img src={p.image} ... />`

### Add your photo to the About section

1. Drop `public/about/portrait.jpg` (square, 800×800 minimum)
2. In `src/components/About.astro`, replace the placeholder `<div>` block with the commented-out `<img>` tag (instructions inline in that file)

### Real testimonials

Edit the `quotes` array in `src/components/Testimonials.astro`. Remove the
"Sample testimonials shown" line at the bottom of that component once they're real.

### Change the contact recipient

Set `CONTACT_RECIPIENT` in the Cloudflare Pages dashboard (Settings → Environment Variables).
Defaults to `cdelong@majormetals.net` if unset.

### Wire real email delivery

The form works without setup — submissions log to the Cloudflare Pages function tail.
For real email delivery via [Resend](https://resend.com):

1. Sign up at resend.com (free tier: 100 emails/day, 3,000/mo)
2. Verify your domain (after you buy it)
3. Add env vars in Cloudflare Pages:
   - `RESEND_API_KEY` = your `re_…` key
   - `RESEND_FROM` = `Delong's Webpages <hello@yourdomain.com>` (must be from a verified domain)
   - `CONTACT_RECIPIENT` = where leads go
4. Redeploy

Until then, view submissions live with `npx wrangler pages deployment tail`.

### Cloudflare Web Analytics

1. Cloudflare Dashboard → Analytics → Web Analytics → Add a site
2. Copy the beacon token
3. Uncomment the script tag at the bottom of `src/layouts/Base.astro` and paste the token

---

## Deployment: GitHub + Cloudflare Pages

### Step 1 — push to GitHub

```powershell
# Already-initialized repo
git add .
git commit -m "Initial commit"

# Create a repo on GitHub.com (private or public, your call), then:
git remote add origin https://github.com/<your-user>/delongs-webpages.git
git branch -M main
git push -u origin main
```

### Step 2 — connect Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorize GitHub if you haven't, pick the `delongs-webpages` repo
3. Set up the build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** *(leave blank)*
   - **Node version:** add env var `NODE_VERSION` = `20` (or `22`) — Cloudflare's default is older
4. Click **Save and Deploy**

First build takes ~2 minutes. You'll get a URL like `delongs-webpages.pages.dev`.

### Step 3 — add custom domain (after domain purchase)

1. Buy your domain (e.g. `delongswebpages.com`) anywhere — Cloudflare Registrar is cheapest
2. In the Pages project: **Custom domains** → **Set up a custom domain** → enter your domain
3. If the domain is on Cloudflare DNS, it's automatic. Otherwise, add the CNAME record they show you
4. HTTPS is automatic, free, forever

### Step 4 — set env vars (for the contact form)

Pages project → **Settings** → **Environment variables** → **Production**:
- `CONTACT_RECIPIENT` (required) — your inbox
- `RESEND_API_KEY` (optional, for email delivery)
- `RESEND_FROM` (optional)

Then trigger a redeploy (Deployments → Retry deployment).

### Step 5 — submit to Google

1. [Google Search Console](https://search.google.com/search-console) → Add property
2. Verify via DNS TXT or HTML tag
3. Submit `https://yourdomain.com/sitemap-index.xml`

---

## Performance notes

- Astro ships **zero JS by default**. The only JS bundle is `motion.ts` (GSAP + Lenis + form handler), ~52 KB gzipped.
- All animations respect `prefers-reduced-motion`.
- Fonts loaded with `display=swap` and preconnected for fastest LCP.
- Images: when you add real ones, use Astro's `<Image>` component — auto WebP/AVIF + lazy loading.
- JSON-LD ProfessionalService schema embedded for rich Google results.

## License

Private. © Delong's Webpages.
