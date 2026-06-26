# Titan Fitness — Premium Gym Website

A production-quality, dark-luxury fitness website built with vanilla HTML5, CSS3, and ES6+ JavaScript. No frameworks, no build step — just open `index.html`.

## Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── images/   (place your own hero/program photos here)
    ├── videos/   (drop a hero video here and uncomment the <video> in index.html if desired)
    └── icons/
```

Images currently load from Unsplash CDN so the site is visually complete out of the box. Swap the `src` attributes in `index.html` to point at files in `assets/images/` whenever you have your own photography.

## Features included

- Sticky glass navbar with scroll state, active-link tracking, and mobile hamburger menu
- Full-screen hero with Ken Burns background, dark-gradient overlay, animated typing line, and animated counters
- About section with photo + floating badge, mission/vision pillars, and stat cards
- 8 program cards (weight training, cardio, CrossFit, powerlifting, yoga, HIIT, strength, bodybuilding)
- Membership pricing with monthly/yearly toggle (auto-recalculates), 3 tiers, "Most Popular" highlight
- Trainer cards with social handles
- **BMI calculator** with validation and color-coded scale marker
- **Calorie calculator** using Mifflin–St Jeor + activity multiplier (maintain / lose / gain)
- Progress counter strip (gradient red→orange band)
- Transformation gallery with category filters and full keyboard-accessible lightbox (← → Esc)
- Auto-playing testimonial slider with dots, swipe support, pause-on-hover
- FAQ accordion (single-open behaviour)
- Blog preview cards
- Contact form with inline validation + Google Map embed
- Footer with newsletter signup
- Floating WhatsApp, call, and back-to-top buttons
- Newsletter popup (delayed 12s, sessionStorage dismissal)
- Loading screen, scroll-progress bar, custom cursor (desktop only)
- Dark / light theme toggle (persisted in localStorage)
- Scroll-reveal animations via Intersection Observer
- Button ripple effects
- Hero parallax
- Fully responsive (1080 / 760 / 420 breakpoints)
- `prefers-reduced-motion` respected
- Keyboard-accessible, semantic HTML, ARIA labels, visible focus states
- Open Graph meta tags, inline SVG favicon

## To customise

- **Colours** — top of `style.css`, the `:root` block. Brand is `--red: #FF3B30` with `--orange: #FF6B00` accent.
- **Fonts** — Poppins (display) + Inter (body) loaded from Google Fonts.
- **Copy** — all written inline in `index.html`.
- **Hero video** — replace the `<img>` inside `.hero-media` with a `<video autoplay muted loop playsinline>` and point at `assets/videos/hero.mp4`.

## Browser support

Chrome / Edge / Firefox / Safari (last 2 versions). Uses Intersection Observer, CSS Grid, custom properties, `backdrop-filter`. No polyfills bundled.
