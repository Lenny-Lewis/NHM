# Museum content and entrance animation

The app uses the existing React, TypeScript, Tailwind 4, Lucide and shadcn-style `src/components/ui` directory. Global styles are in `src/index.css`; the new sections and loader have scoped stylesheet files beside their components. `@/` maps to `src/`. No providers are needed.

## Content

`src/components/museum-content.tsx` adds three readable specimen stories, an interactive Mesozoic timeline, three suggested online exploration trails, expandable educational questions and an about section. Collection chapters also have observation prompts and descriptions. Trails select the relevant chapter in the existing collection. Stories open native modal dialogs with Escape, keyboard focus management and close controls.

Navigation targets: `home`, `exhibitions`, `collections`, `discover`, `learn`, `visit`, `questions`, `about`, and `footer`. Individual story cards have `dinosaurs`, `ancient-life`, and `prehistoric-giants` anchors. Visit describes online exploration rather than advertising an invented physical address, opening schedule or ticket service.

Specimen art uses the existing local fossil assets. The additional museum photographs are [Riccardo Manieri's dinosaur skeleton](https://unsplash.com/photos/a-large-dinosaur-skeleton-in-a-museum-NtjaD_UnBb0) and [Tofan Teodor's museum gallery](https://unsplash.com/photos/a-dinosaur-skeleton-in-a-museum-with-people-looking-at-it-loDom-q2mwA), served from Unsplash with on-page credits.

## First-entry loader

`src/components/ui/skiper39.tsx` contains the supplied crowd canvas adapted with explicit TypeScript types, responsive sizing, GSAP timeline cleanup, reduced motion and hidden-tab pausing. `src/components/ui/skiper39-demo.tsx` is its standalone demo. The people illustration must remain a sprite sheet, so it uses the supplied Open Peeps sheet rather than an unrelated stock photograph.

`src/components/entrance-loader.tsx` wraps the app at its entry point. It shows once per tab session using `sessionStorage`, with a manual Enter museum button. It begins fading after the sprite is ready and the introduction has been shown for about 2.2 seconds; a 4.5-second timeout and image-error handling also allow entry. It adds a 450ms fade, then mounts the museum and restores page scrolling. Reduced-motion users enter directly. Storage restrictions do not prevent entry.

GSAP is installed in `package.json` and the lockfile. The loader visibly credits Open Peeps and Skiper UI, as required by the supplied component's attribution notice.

Automated checks and browser checks are left to the user as requested.
