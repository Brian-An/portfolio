# Portfolio

Brian An's portfolio, built with Next.js, React, and Tailwind CSS.

- `/` - About
- `/photography` - Photography
- `/projects` - Software projects

## Development

```sh
npm ci
npm run dev
```

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests cover desktop and mobile navigation, photo captions, keyboard access, portrait animation, website previews, and social links.

Photo dates and locations are maintained in `constants/gallery.ts`.
The `date` field supplies the caption and image labels.

Portrait dots are stored in `constants/portrait-dots.json`.
To regenerate them from a transparent cutout, run `node scripts/generate-portrait-dots.mjs path/to/cutout.png`.
Source portraits stay in the ignored `.portrait-source/` folder.
