import WildHuntFooter, {
  type FooterColumn,
} from "@/components/ui/wild-hunt-footer";

const columns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Visit the museum", href: "#visit" },
      { label: "Exhibitions", href: "#exhibitions" },
      { label: "Our collection", href: "#collections" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Dinosaurs & fossils", href: "#dinosaurs" },
      { label: "Ancient life", href: "#ancient-life" },
      { label: "Prehistoric worlds", href: "#prehistoric-giants" },
    ],
  },
  {
    title: "The museum",
    links: [
      { label: "Questions & answers", href: "#questions" },
      { label: "Learn & discover", href: "#learn" },
      { label: "About", href: "#about" },
    ],
  },
  {
    title: "Credits",
    links: [
      { label: "Made by Lennox Lewis", href: "https://lennoxlewis.co.ke" },
      {
        label: "Photo by Willian Justen",
        href: "https://unsplash.com/photos/a-large-dinosaur-skeleton-is-in-a-museum-dX0cXtj7ohk",
      },
    ],
  },
];

export default function MuseumFooter() {
  return (
    <div id="footer">
      <WildHuntFooter
        wordmark="NHM"
        image={{
          src: "https://images.unsplash.com/photo-1647962309326-b77f9732860e?auto=format&fit=crop&w=2400&q=85",
          alt: "Dinosaur skeleton on display at the American Museum of Natural History, photographed by Willian Justen de Vasconcellos",
          position: "50% 42%",
        }}
        imageHeight={0.62}
        dissolve={0.48}
        tagline="Digging into our planet’s past · millions of years of wonder"
        sideNote="Natural History Museum · explore the past · understand the present"
        columns={columns}
        legal={`© ${new Date().getFullYear()} Natural History Museum`}
        colophon="The story of life, written in stone. Explore dinosaurs, fossils and ancient worlds — and discover the extraordinary planet we call home."
        height="clamp(800px, 100svh, 980px)"
      />
    </div>
  );
}
