# SIGMA Life RPG

A static productivity RPG that turns real-world tasks into quests, XP, levels, streaks, attributes, gold, and unlockable rewards.

The project intentionally avoids a generic dashboard aesthetic. The public page is designed as a high-polish game launch page, while the authenticated command center stays fast and task-focused.

## What is implemented

- Local campaign setup and browser persistence with `localStorage`.
- Quest, XP, streak, inventory, and activity data stay on the user's device. No backend or account service is required.
- Full quest CRUD with client-side validation.
- Client-side reward rules with no network dependency.
- Non-linear XP thresholds, level-up events, attribute gains, timezone-aware daily streaks, gold economy, shop, inventory, themes, and badges.
- Responsive layouts, semantic controls, keyboard navigation, focus states, reduced-motion support, and screen-reader status regions.
- SEO metadata, Open Graph/Twitter metadata, JSON-LD, semantic page structure, and lightweight local assets.
- Automated unit tests for the progression and reward rules.

## Stack

This submission deliberately uses a small dependency surface:

- **Frontend:** semantic HTML + CSS + vanilla JavaScript
- **Storage:** browser `localStorage`

Node.js is only needed to run the optional unit tests.

## Run locally

Open `public/index.html`, or serve the `public/` directory with any static file server.

No package installation or environment variables are required.

## Test before submission

```bash
npm test
```

## Deployment

### GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` publishes `public/` directly to GitHub Pages. Enable Pages in the repository settings with **GitHub Actions** as the source. No repository secrets are needed.

Campaigns are device-local. Clearing browser storage or changing browsers will not transfer progress.

### Production checklist

1. Enable GitHub Pages with GitHub Actions as the source.
2. Open the live URL in a private browser window and create a fresh campaign.
4. Create and complete a quest, refresh the page, then sign out/in again.
5. Check the browser console for runtime errors.
6. Test at 360px mobile width and desktop width.
7. Confirm the landing page and command center work from the published Pages URL.

## Project structure

```text
life-rpg/
├── public/
│   ├── index.html       # SEO-focused public landing page
│   ├── landing.js       # auth dialog + reveal interactions
│   ├── app.html         # authenticated game UI
│   ├── app.js           # quest/shop/inventory client logic
│   ├── styles.css       # responsive visual system
│   ├── favicon.svg
│   └── og-card.svg
├── src/                # retained game-rule tests
└── package.json
```

## Privacy

There is no backend, account database, analytics service, or network API. Campaign data is stored only in this browser's local storage.

## Accessibility

The app uses native buttons/forms/dialogs, skip links, visible keyboard focus, ARIA live regions for async feedback, labels on inputs, semantic headings, responsive layouts, and `prefers-reduced-motion`. Core actions work with Tab + Enter/Space because they use native interactive elements rather than clickable `<div>` elements.

## SEO

The public page includes title/description metadata, canonical URL, Open Graph/Twitter metadata, SoftwareApplication JSON-LD, semantic headings, crawl rules, a generated sitemap, and fast local assets with no third-party font/script request.

## Demo video plan

Use `VIDEO_SCRIPT.md` to record a 90–180 second walkthrough that proves campaign setup, task creation, quest completion, level progression, and local persistence after refresh.

## License

MIT. See `LICENSE`.
# SIGMA_RPG
