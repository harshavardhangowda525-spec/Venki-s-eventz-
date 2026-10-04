# Venki's Eventz — Website

A premium, cinematic single-page website for **Venki's Eventz**, a wedding planning & event management business in Bengaluru South.

It is a static site with no build step. Open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel hosting).

## Project structure

```
index.html        Page markup, SEO meta tags, LocalBusiness structured data
css/styles.css    All styling (palette tokens at the top in :root)
js/config.js      ← EDIT THIS: business info, images, gallery, stats, testimonials
js/main.js        Rendering, animations, cursor, lightbox, form, map
assets/           Favicon (put real photos in assets/photos/)
robots.txt, sitemap.xml
```

## Editing content (js/config.js)

| What | Where |
|---|---|
| Phone, WhatsApp number, address, hours, map search text | `business` |
| WhatsApp pre-filled message | `business.whatsappMessage` |
| Instagram / Facebook / YouTube icons | `business.social` (icons appear once a URL is added) |
| Hero, about, service, CTA images | `images` |
| Gallery photos | `gallery` (add/remove/reorder; `tall: true` = portrait tile) |
| Statistics | `stats` (stats with `value: null` stay hidden until you add a real number) |
| Testimonials | `testimonials` (set `placeholder: false` once a review is real) |

> **Stock photos and sample testimonials are placeholders.** Replace them with real event photos and genuine client reviews before launch. Save photos in `assets/photos/` and use paths like `"assets/photos/wedding-01.jpg"`. Aim for JPG/WebP images about 1600–2000px wide and under 400 KB.

If you change the phone number or address, also update the JSON-LD block and meta description in `index.html` (the SEO copy that search engines read).

## Enquiry form

By default **Send Enquiry** opens WhatsApp with every form field already filled in, so it works with no backend.

If you'd rather get enquiries by email, create a free form at [Formspree](https://formspree.io) or a similar service and paste its URL into `formEndpoint` in `config.js`. Submissions are then POSTed there, and WhatsApp is offered as a fallback.

## Before going live

- The site currently points to its GitHub Pages address (`https://harshavardhangowda525-spec.github.io/Venki-s-eventz-/`). When you move to a custom domain, replace that URL in `index.html`, `robots.txt` and `sitemap.xml`.
- Claim or verify the business on **Google Business Profile**. This matters most for "wedding planners near me" searches.
- Replace placeholder photos and reviews.

## Motion & performance notes

- Animations use GSAP + ScrollTrigger and Lenis smooth scroll, loaded from CDN.
- If the CDNs fail to load, the site still works with all content visible.
- `prefers-reduced-motion` turns off the intro, particles, parallax and smooth scrolling.
- Images are lazy-loaded, and the Google Map loads only when you scroll near it.
- Particle canvases pause when they're off-screen or the tab is hidden.
- The intro animation plays once per browser session.
