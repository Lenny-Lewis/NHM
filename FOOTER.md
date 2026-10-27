# Wild Hunt footer

The app already has React 19, TypeScript, Tailwind CSS 4 (via the Vite plugin), and Lucide. The footer needs no additional packages, state store, or context providers.

Reusable UI components live in `src/components/ui`, mapped to `@/components/ui`. Keeping this directory gives shadcn and copied components a consistent import destination; with this project's `src` layout, a second root-level `components/ui` directory is unnecessary. Global styles are in `src/index.css`; the footer's scoped `.whf-` styles live with its component.

`src/components/museum-footer.tsx` supplies the NHM wordmark, Unsplash dinosaur photograph, museum copy, existing section links, and creator credit. `src/components/ui/demo.tsx` renders that configuration as a standalone example. The matching transparent cutout is optional and is omitted for the stock photograph.

The original four palettes, bitmap wordmark, dither dissolve, grain, flourish, pointer reticle, letter scatter, and click scanline are supported. Links switch from four columns to two on narrow screens. The footer reserves room for its navigation on short screens, pauses drawing offscreen and in hidden tabs, and respects reduced motion. Its illustration is labeled for assistive technology and its real links/buttons remain keyboard accessible.

The `@/` alias is configured for Vite and TypeScript. `components.json` records the shadcn directory conventions. If adding other shadcn components later, initialize their shared utilities and theme dependencies with `npx shadcn@latest init` and then use `npx shadcn@latest add <component>`; the current footer does not use shadcn primitives or a `cn` utility.

Photo: [Willian Justen de Vasconcellos on Unsplash](https://unsplash.com/photos/a-large-dinosaur-skeleton-is-in-a-museum-dX0cXtj7ohk), served from Unsplash's image CDN. The reusable component also retains the supplied Wild Hunt painting defaults for other uses.

Run `npm run dev` to preview and `npm run build` for TypeScript validation and a production build.
