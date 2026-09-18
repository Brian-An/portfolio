# Portfolio

Brian An's portfolio, built with Next.js, React, and Tailwind CSS.

- `/` - About
- `/gallery` - Photography
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

Browser tests cover desktop and mobile navigation, keyboard access to photos, social link labels, and camera cleanup with immediate and delayed permission responses.
The camera tests use Chromium's fake camera and never access a physical webcam.
