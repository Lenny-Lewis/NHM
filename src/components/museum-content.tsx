import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Clock3, Minus, Plus, X } from "lucide-react";
import dinosaur from "@/assets/01.png";
import fossil from "@/assets/02.png";
import reptile from "@/assets/03.png";
import marine from "@/assets/04.png";
import giant from "@/assets/05.png";
import "./museum-content.css";

const stories = [
  {
    id: "dinosaurs",
    number: "01",
    title: "Meet the giants.",
    category: "Dinosaurs & fossils",
    image: dinosaur,
    alt: "Tyrannosaurus rex skeleton, showing its skull, ribs and long tail",
    intro:
      "A tooth. A footprint. An entire lost world. Discover what dinosaurs left behind.",
    paragraphs: [
      "A dinosaur skeleton is a puzzle with a very long history. The shape of a tooth can suggest what an animal ate; the joints of a leg offer clues to how it moved. Paleontologists bring those clues together to build a picture of life in the distant past.",
      "Look beyond the enormous teeth. Notice the long tail that helped balance the body, the spaces between bones, and the difference between the powerful hind limbs and smaller forelimbs. Every part has a story to tell.",
      "Try this in the collection: compare two specimens. Which features do they share, and which are different? Start with what you can observe before deciding what it might mean.",
    ],
  },
  {
    id: "ancient-life",
    number: "02",
    title: "Life leaves a trace.",
    category: "The fossil record",
    image: fossil,
    alt: "Ancient fossil specimen presented against a dark background",
    intro:
      "Not every fossil is a bone. Follow the small clues that help us read Earth’s history.",
    paragraphs: [
      "Fossils are preserved remains or traces of past life. They can include shells and bones, but also footprints, burrows and impressions left by plants. A trace fossil records an activity rather than the body of the animal that made it.",
      "Fossilisation is unusual. Remains often need to be buried quickly, protected from scavengers and decay. Over time, sediment can become rock and minerals can replace or fill parts of the original remains.",
      "The fossil record is incomplete, which makes each discovery valuable. Scientists consider the rock around a fossil as well as the fossil itself: where it was found can be as revealing as what it looks like.",
    ],
  },
  {
    id: "prehistoric-giants",
    number: "03",
    title: "Beyond the land.",
    category: "Prehistoric worlds",
    image: marine,
    alt: "Prehistoric marine fossil specimen from the collection",
    intro:
      "The age of dinosaurs was also an age of extraordinary life in the sea and sky.",
    paragraphs: [
      "Not every prehistoric reptile was a dinosaur. Pterosaurs were flying reptiles, while groups such as ichthyosaurs and plesiosaurs lived in the sea. They shared the Mesozoic world with dinosaurs but belonged to different branches of the reptile family tree.",
      "Different environments favour different body shapes. Compare the features that help an animal move through water with those used to walk on land or fly. Limbs can be adapted into flippers or wings over many generations.",
      "Explore the marine gallery and the reptiles chapter together. Look for similarities, then ask how each animal’s surroundings might have shaped the way it lived.",
    ],
  },
];

const periods = [
  {
    name: "Triassic",
    years: "252–201",
    label: "A world beginning again.",
    image: reptile,
    text: "The first dinosaurs appeared during the Triassic. Much of the land was joined in the supercontinent Pangaea, and early dinosaurs lived alongside many other kinds of reptiles.",
    clue: "Think about it: how might connected continents help animals spread?",
  },
  {
    name: "Jurassic",
    years: "201–145",
    label: "The age of great giants.",
    image: giant,
    text: "As Pangaea began to break apart, new coastlines and environments formed. Long-necked sauropods became a familiar part of many landscapes, and the earliest known birds appeared.",
    clue: "Look closely: what would a long neck help a plant-eater reach?",
  },
  {
    name: "Cretaceous",
    years: "145–66",
    label: "A changing planet.",
    image: dinosaur,
    text: "Flowering plants spread and dinosaur communities continued to change. Tyrannosaurus and Triceratops lived near the end of this period, before the mass extinction that ended the age of non-avian dinosaurs.",
    clue: "Make a connection: birds are the living descendants of dinosaurs.",
  },
];

const trails = [
  {
    name: "The highlights",
    time: "30–45 min",
    for: "A first look",
    description:
      "Start with the dinosaur skeletons, compare the marine fossils, then take a trip through the timeline.",
    stops: ["Age of Dinosaurs", "Marine Fossil Gallery", "Deep-time timeline"],
    chapter: 0,
  },
  {
    name: "The curious family",
    time: "45–60 min",
    for: "Explore together",
    description:
      "Turn your visit into a fossil hunt. Look for teeth, count limbs and imagine the world each animal called home.",
    stops: [
      "Fossils of Ancient Life",
      "Reptiles of the Mesozoic",
      "Questions for curious minds",
    ],
    chapter: 1,
  },
  {
    name: "The deep dive",
    time: "60–90 min",
    for: "Take your time",
    description:
      "Explore all five collection chapters, read the field notes and trace the connections between land, sea and sky.",
    stops: [
      "All five collection chapters",
      "Stories from the collection",
      "The three Mesozoic periods",
    ],
    chapter: 4,
  },
];

const questions = [
  {
    question: "Are all prehistoric animals dinosaurs?",
    answer:
      "No. Pterosaurs, marine reptiles and animals such as mammoths belonged to other groups. Dinosaurs are a particular branch of reptiles, and birds are part of that branch too.",
  },
  {
    question: "What is the difference between a fossil and a cast?",
    answer:
      "A fossil is a preserved remain or trace of ancient life. A cast is a replica made from a mould or a digital model. Casts let museums share rare discoveries and reconstruct skeletons while protecting original material.",
  },
  {
    question: "How do we know what dinosaurs looked like?",
    answer:
      "Scientists study bones, trackways, skin impressions and, in some cases, preserved feathers. Comparisons with living animals help fill in the picture. Some details remain uncertain, and reconstructions change as new evidence appears.",
  },
  {
    question: "Where should I start exploring?",
    answer:
      "Choose a trail above or jump straight into the five collection chapters. Each chapter has a specimen to study. Then visit the timeline to place those animals within the wider story of the Mesozoic.",
  },
];

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <p className="museum-eyebrow">
      <span>[ {number} ]</span>
      {children}
    </p>
  );
}

export default function MuseumContent({
  onExploreChapter,
}: {
  onExploreChapter: (index: number) => void;
}) {
  const [period, setPeriod] = useState(0);
  const [trail, setTrail] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = periods[period];
  const route = trails[trail];
  const story = stories[storyIndex];

  return (
    <>
      <section id="discover" className="museum-section museum-stories">
        <SectionLabel number="04">Stories from the collection</SectionLabel>
        <div className="museum-section-heading">
          <h2>
            Look closer.
            <br />
            <span>There’s a world in every detail.</span>
          </h2>
          <p>
            Meet the remarkable animals, small discoveries and big questions
            behind the story of life on Earth.
          </p>
        </div>
        <div className="museum-story-grid">
          {stories.map((item, index) => (
            <article id={item.id} className="museum-story" key={item.id}>
              <button
                className="museum-story-image"
                type="button"
                aria-label={`Read ${item.title}`}
                onClick={() => {
                  setStoryIndex(index);
                  dialog.current?.showModal();
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span>{item.number} / FIELD NOTES</span>
                <span className="museum-image-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </button>
              <p className="museum-eyebrow">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.intro}</p>
              <button
                type="button"
                className="museum-text-link"
                onClick={() => {
                  setStoryIndex(index);
                  dialog.current?.showModal();
                }}
              >
                Read the story <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="learn" className="museum-section museum-time">
        <SectionLabel number="05">A journey through deep time</SectionLabel>
        <div className="museum-section-heading">
          <h2>
            Before our time.
            <br />
            <span>Beyond imagination.</span>
          </h2>
          <p>
            Three periods. A changing Earth. Explore the Mesozoic era, from the
            first dinosaurs to the end of their extraordinary reign.
          </p>
        </div>
        <div
          className="museum-period-tabs"
          role="tablist"
          aria-label="Mesozoic periods"
        >
          {periods.map((item, index) => (
            <button
              type="button"
              role="tab"
              id={`period-tab-${index}`}
              aria-selected={period === index}
              aria-controls="period-panel"
              tabIndex={period === index ? 0 : -1}
              key={item.name}
              onClick={() => setPeriod(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight")
                  next = (index + 1) % periods.length;
                else if (event.key === "ArrowLeft")
                  next = (index + periods.length - 1) % periods.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = periods.length - 1;
                else return;
                event.preventDefault();
                setPeriod(next);
                document.getElementById(`period-tab-${next}`)?.focus();
              }}
            >
              <span>{item.name}</span>
              <small>{item.years} million years ago</small>
              <span className="museum-timeline-dot" />
            </button>
          ))}
        </div>
        <div
          id="period-panel"
          role="tabpanel"
          aria-labelledby={`period-tab-${period}`}
          className="museum-period-panel"
          tabIndex={0}
        >
          <div className="museum-period-art">
            <span className="museum-specimen-label">
              THE MESOZOIC / {current.name.toUpperCase()}
            </span>
            <img
              src={current.image}
              alt={`Fossil illustration accompanying the ${current.name} period`}
              loading="lazy"
              decoding="async"
            />
            <span className="museum-specimen-label">
              SPECIMEN STUDY — ILLUSTRATIVE
            </span>
          </div>
          <div className="museum-period-copy">
            <p className="museum-eyebrow">
              {current.years} million years ago · approximate
            </p>
            <h3>{current.label}</h3>
            <p>{current.text}</p>
            <div className="museum-observation">
              <Plus size={18} />
              <p>{current.clue}</p>
            </div>
            <a className="museum-text-link" href="#collections">
              Explore the collection <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="visit" className="museum-section museum-visit">
        <SectionLabel number="06">Make room for wonder</SectionLabel>
        <div className="museum-visit-grid">
          <div className="museum-visit-photo">
            <img
              src="https://images.unsplash.com/photo-1655803346107-ffc081d81d07?auto=format&fit=crop&w=1400&q=85"
              alt="A towering dinosaur skeleton displayed inside a natural history museum"
              loading="lazy"
              decoding="async"
            />
            <a
              href="https://unsplash.com/photos/a-large-dinosaur-skeleton-in-a-museum-NtjaD_UnBb0"
              className="museum-photo-credit"
            >
              Photograph: Riccardo Manieri / Unsplash <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="museum-visit-copy">
            <h2>
              Your curiosity.
              <br />
              <span>Your own pace.</span>
            </h2>
            <p>
              Build your own journey through the online museum. Choose a
              suggested trail, then follow the specimens and stories that catch
              your eye.
            </p>
            <div
              className="museum-trail-options"
              role="group"
              aria-label="Choose an exploration trail"
            >
              {trails.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={trail === index}
                  onClick={() => setTrail(index)}
                >
                  {item.name}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
            <div className="museum-route" aria-live="polite">
              <div className="museum-route-meta">
                <span>{route.for}</span>
                <span>
                  <Clock3 size={14} />
                  {route.time}
                </span>
              </div>
              <h3>{route.name}</h3>
              <p>{route.description}</p>
              <ol>
                {route.stops.map((stop) => (
                  <li key={stop}>{stop}</li>
                ))}
              </ol>
              <p className="museum-route-note">
                Suggested exploration time — stay as long as you like.
              </p>
            </div>
            <button
              type="button"
              className="museum-primary-link"
              onClick={() => onExploreChapter(route.chapter)}
            >
              Start this trail <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="museum-section museum-faq" id="questions">
        <SectionLabel number="07">For curious minds</SectionLabel>
        <div className="museum-faq-grid">
          <h2>
            Big questions.
            <br />
            <span>Start here.</span>
          </h2>
          <div>
            {questions.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <Plus className="museum-faq-plus" size={18} />
                  <Minus className="museum-faq-minus" size={18} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="museum-section museum-about">
        <SectionLabel number="08">Our reason for being</SectionLabel>
        <div className="museum-about-grid">
          <div>
            <h2>
              The past belongs
              <br />
              to <em>the curious.</em>
            </h2>
            <p>
              Natural history connects the smallest trace with the biggest
              picture. This museum is a place to slow down, look carefully and
              find your own way into Earth’s story.
            </p>
            <p>
              Through fossils, prehistoric life and the questions they leave us,
              we invite you to see the living world with fresh eyes. You don’t
              need to be a scientist. You just need to wonder.
            </p>
            <a className="museum-text-link" href="#discover">
              Find your next discovery <ArrowRight size={16} />
            </a>
            <span className="museum-about-signoff">
              EXPLORE THE PAST. UNDERSTAND THE PRESENT.
            </span>
          </div>
          <figure>
            <img
              src="https://images.unsplash.com/photo-1729372463377-ac1adee5090c?auto=format&fit=crop&w=1200&q=85"
              alt="Visitors looking at a dinosaur skeleton in a museum gallery in Milan"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              A different perspective on a shared planet.{" "}
              <a href="https://unsplash.com/photos/a-dinosaur-skeleton-in-a-museum-with-people-looking-at-it-loDom-q2mwA">
                Photo: Tofan Teodor / Unsplash <ArrowUpRight size={12} />
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <dialog
        className="museum-reader"
        ref={dialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="museum-reader-title"
      >
        <div className="museum-reader-inner">
          <button
            type="button"
            className="museum-reader-close"
            onClick={() => dialog.current?.close()}
            aria-label="Close story"
          >
            <X size={22} />
          </button>
          <img src={story.image} alt={story.alt} />
          <p className="museum-eyebrow">Field notes / {story.category}</p>
          <h2 id="museum-reader-title">{story.title}</h2>
          {story.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <button
            type="button"
            className="museum-primary-link"
            onClick={() => {
              dialog.current?.close();
              onExploreChapter(storyIndex === 2 ? 3 : storyIndex);
            }}
          >
            See the specimens <ArrowUpRight size={18} />
          </button>
        </div>
      </dialog>
    </>
  );
}
