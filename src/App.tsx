import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, usePresence, type Variants } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Bone,
  Dna,
  Leaf,
  BookOpen,
} from "lucide-react";

import ch1 from "./assets/01.png";
import ch2 from "./assets/02.png";
import ch3 from "./assets/03.png";
import ch4 from "./assets/04.png";
import ch5 from "./assets/05.png";
import pterodactylImg from "./assets/pterodactyl.png";
import heroVideo from "./assets/hero-video.mp4";
import MuseumFooter from "@/components/museum-footer";
import MuseumContent from "@/components/museum-content";

const chaptersData = [
  {
    name: "Age of Dinosaurs",
    image: ch1,
    description: "Study the anatomy of a land predator. Compare its teeth, powerful hind limbs and balancing tail to discover how a skeleton offers clues to a life long gone.",
    prompt: "Look for the balance between the skull and tail.",
  },
  {
    name: "Fossils of Ancient Life",
    image: ch2,
    description: "Fossils preserve more than the shapes of ancient animals. They hold evidence of growth, movement and environments that have disappeared from the modern world.",
    prompt: "What can you observe before making an interpretation?",
  },
  {
    name: "Reptiles of the Mesozoic",
    image: ch3,
    description: "Dinosaurs shared their world with many other reptiles. Explore the variety of body shapes and ask how different features helped animals survive in different habitats.",
    prompt: "Compare the arrangement and proportions of the limbs.",
  },
  {
    name: "Marine Fossil Gallery",
    image: ch4,
    description: "Ancient seas were home to remarkable creatures. Look at the features of marine specimens and consider how life in water shaped the way they moved and fed.",
    prompt: "Which features might reduce resistance in water?",
  },
  {
    name: "Prehistoric Giants",
    image: ch5,
    description: "Size changes the way an animal lives. Explore the structures that support a large body, and think about the food, space and energy a giant would need.",
    prompt: "Follow the skeleton from its supporting limbs to its spine.",
  },
];

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock: Variants = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface SandTransitionImageProps {
  src: string;
  alt: string;
  className?: string;
}

function SandTransitionImage({ src, alt, className = "" }: SandTransitionImageProps) {
  const [isPresent, safeToRemove] = usePresence();
  const filterIdRef = useRef(`sand-${Math.random().toString(36).slice(2, 9)}`);
  const filterId = filterIdRef.current;

  const [state, setState] = useState({
    scale: 150,
    dx: -30,
    dy: -80,
    blur: 6,
    opacity: 0,
    isSettled: false,
  });

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 900;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(Math.max(elapsed / duration, 0), 1);

      if (isPresent) {
        // Entering: quartic ease-out
        const progress = 1 - Math.pow(1 - t, 4);
        const factor = 1 - progress;

        const scale = factor * 150;
        const dx = factor * -30;
        const dy = factor * -80;
        const blur = factor * 6;
        const opacity = Math.min(Math.max(1 - factor * 1.2, 0), 1);

        setState({
          scale,
          dx,
          dy,
          blur,
          opacity,
          isSettled: t >= 1,
        });

        if (t < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        // Exiting: cubic
        const progress = Math.pow(t, 3);

        const scale = progress * 150;
        const dx = progress * 30;
        const dy = progress * 120;
        const blur = progress * 6;
        const opacity = Math.max(1 - progress * 1.2, 0);

        setState({
          scale,
          dx,
          dy,
          blur,
          opacity,
          isSettled: false,
        });

        if (t < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          safeToRemove?.();
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPresent, safeToRemove]);

  const alphaMatrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${state.opacity.toFixed(3)} 0`;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={state.scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset
              in="displaced"
              dx={state.dx}
              dy={state.dy}
              result="offset"
            />
            <feGaussianBlur
              in="offset"
              stdDeviation={state.blur}
              result="blurred"
            />
            <feColorMatrix
              in="blurred"
              type="matrix"
              values={alphaMatrix}
            />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className={className}
        style={{
          filter: state.isSettled ? "none" : `url(#${filterId})`,
          opacity: state.opacity,
          transition: "none",
        }}
      />
    </div>
  );
}

export default function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2); // starts at "Reptiles of the Mesozoic"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSpecimenDetails, setShowSpecimenDetails] = useState(false);

  // showVideo flips to true after a 2800ms delay
  useEffect(() => {
    const videoTimer = setTimeout(() => {
      setShowVideo(true);
    }, 2800);
    return () => clearTimeout(videoTimer);
  }, []);

  const navLinks = ["Visit", "Exhibitions", "Discover", "Learn", "About"];
  const exploreChapter = (index: number) => {
    setActiveChapter(index);
    document.getElementById("collections")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div className="relative w-full bg-[#fcfcfc] text-[#111] selection:bg-black selection:text-white overflow-x-hidden font-sans">
      {/* SECTION 1: HERO (full viewport height) */}
      <section id="home" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* 1D. BACKGROUND VIDEO */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src={heroVideo}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1A. HEADER & LOGO */}
        <motion.header
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="pt-6 px-6 md:px-16 z-20 w-full relative"
        >
          {/* SVG LOGO */}
          <motion.h1
            variants={{
              initial: { scale: 1.03 },
              animate: {
                scale: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  staggerChildren: 0.06,
                  delayChildren: 0.1,
                },
              },
            }}
            className="w-full"
          >
            <svg
              viewBox="0 0 840 100"
              className="w-full h-auto max-h-[14vh] fill-[#111] overflow-visible"
              aria-label="Natural History Museum NHM"
            >
              {/* Letter N */}
              <g transform="translate(0,0)">
                <motion.polygon
                  variants={letterBlock}
                  points="0,0 14,0 14,100 0,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="200,0 214,0 214,100 200,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="0,0 33,0 214,100 181,100"
                />
              </g>

              {/* Letter H */}
              <g transform="translate(280,0)">
                <motion.polygon
                  variants={letterBlock}
                  points="0,0 14,0 14,100 0,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="200,0 214,0 214,100 200,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="14,43 200,43 200,57 14,57"
                />
              </g>

              {/* Letter M */}
              <g transform="translate(560,0)">
                <motion.polygon
                  variants={letterBlock}
                  points="0,0 14,0 14,100 0,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="266,0 280,0 280,100 266,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="0,0 26,0 153,100 127,100"
                />
                <motion.polygon
                  variants={letterBlock}
                  points="254,0 280,0 153,100 127,100"
                />
              </g>
            </svg>
          </motion.h1>

          {/* 1B. SUB-NAV BAR */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase relative"
          >
            {/* Left column (15% width) */}
            <div className="w-[15%] hidden sm:flex flex-col text-[#111] leading-tight font-mono">
              <span>Natural</span>
              <span>History</span>
              <span>Museum</span>
            </div>

            {/* Arrow separator (5% width, hidden on mobile) */}
            <div className="w-[5%] hidden md:flex items-center justify-center pt-1 text-gray-400">
              <ArrowRight size={14} strokeWidth={1} />
            </div>

            {/* Center column (flex-1 on mobile, 30% on desktop) */}
            <div className="flex-1 md:w-[30%] md:flex-initial text-gray-800 leading-relaxed font-mono pr-4 sm:pr-0">
              <p className="hidden md:block">
                Exploring the story of life on earth<br />
                through science, discovery<br />
                and wonder.
              </p>
              <p className="block md:hidden">
                Exploring the story<br />
                of life on earth through<br />
                science, discovery<br />
                and wonder.
              </p>
            </div>

            {/* Arrow separator (5% width, hidden on mobile) */}
            <div className="w-[5%] hidden md:flex items-center justify-center pt-1 text-gray-400">
              <ArrowRight size={14} strokeWidth={1} />
            </div>

            {/* Right column (15% width, hidden on mobile) */}
            <nav className="w-[15%] hidden md:flex flex-col space-y-1 text-gray-800">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-black hover:underline transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Hamburger button (far right, z-60) */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="relative z-60 md:hidden flex flex-col justify-center items-end gap-[6px] p-2 group cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 origin-center ${
                  isMobileMenuOpen
                    ? "w-8 rotate-45 translate-y-[3.75px]"
                    : "w-8 group-hover:w-6"
                }`}
              />
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 origin-center ${
                  isMobileMenuOpen
                    ? "w-8 -rotate-45 -translate-y-[3.75px]"
                    : "w-8 group-hover:w-10"
                }`}
              />
            </button>
          </motion.div>
        </motion.header>

        {/* 1C. MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-36 left-0 w-full bg-[#fcfcfc] border-b border-gray-200 shadow-xl z-50 md:hidden p-8 flex flex-col space-y-6"
            >
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-mono tracking-[0.2em] uppercase text-gray-800 hover:text-black transition-colors"
                >
                  {link}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN HERO CONTENT (Sidebars) */}
        <div className="flex-1 flex justify-between items-start px-6 md:px-16 z-10 relative">
          {/* 1E. LEFT SIDEBAR CONTENT */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: { staggerChildren: 0.15, delayChildren: 0.6 },
              },
            }}
            className="mt-16 sm:mt-24 md:mt-28 w-full max-w-[320px] z-10 flex flex-col items-start"
          >
            {/* Section indicator */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-mono mb-6"
            >
              <span className="font-semibold tracking-wider">01</span>
              <span className="w-16 h-[1.5px] bg-black/20" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] text-[#111] mb-6"
            >
              TIMELESS
              <br />
              WONDERS
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-[13px] md:text-[14px] text-gray-700 w-[240px] leading-[1.6] mb-8 font-sans"
            >
              Step into the natural world and discover the stories written millions of years ago.
            </motion.p>

            {/* CTA Button ("Explore Now") */}
            <motion.a
              href="#exhibitions"
              variants={fadeUp}
              className="group relative overflow-hidden bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm transition-all duration-300 hover:-translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-none inline-flex items-center gap-3 cursor-pointer"
            >
              {/* Sliding background panel */}
              <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />

              {/* Custom SVG leaf/plant shape (4 paths) */}
              <span className="relative z-10 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1">
                <svg
                  className="w-4 h-4 text-white group-hover:text-[#111] transition-colors duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22C12 22 12 13 12 7" />
                  <path d="M12 14C8.5 12 6 8 8 4C11 4 12 7 12 7" />
                  <path d="M12 11C15.5 9 18 5 16 2C13 2 12 5 12 5" />
                  <path d="M12 17C15 15.5 17 12 15.5 9.5C13.5 9.5 12 12 12 12" />
                </svg>
              </span>

              {/* Text */}
              <span className="relative z-10 text-[15px] font-medium text-white group-hover:text-[#111] transition-colors duration-300">
                Explore Now
              </span>
            </motion.a>
          </motion.div>

          {/* 1F. RIGHT SIDEBAR (hidden on mobile) */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: { staggerChildren: 0.15, delayChildren: 0.9 },
              },
            }}
            className="w-[200px] mt-12 md:mt-20 hidden md:flex flex-col space-y-6 z-10"
          >
            {/* Specimen info */}
            <motion.div variants={fadeUp} className="flex flex-col space-y-1">
              <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-black">
                Tyrannosaurus Rex
              </span>
              <span className="text-[12px] text-gray-600 leading-[1.6]">
                Late Cretaceous period<br />
                68–66 million years ago
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="space-y-3 pt-2">
              <div>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-gray-500">
                  Length
                </span>
                <span className="text-[13px] font-medium text-black">
                  12.3 m
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-gray-500">
                  Height
                </span>
                <span className="text-[13px] font-medium text-black">
                  4.0 m
                </span>
              </div>
            </motion.div>

            {/* View Details button */}
            <motion.button
              variants={fadeUp}
              type="button"
              onClick={() => setShowSpecimenDetails((shown) => !shown)}
              aria-expanded={showSpecimenDetails}
              aria-controls="specimen-details"
              className="group flex items-center gap-3 pt-2 cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-[#111]">
                <Plus
                  size={16}
                  strokeWidth={1.5}
                  className="text-gray-700 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-gray-800 group-hover:text-black transition-colors">
                View Details
              </span>
            </motion.button>
            {showSpecimenDetails && (
              <p id="specimen-details" className="text-[11px] leading-relaxed text-gray-600 border-l border-gray-300 pl-3" role="region" aria-label="Tyrannosaurus rex details">
                One of the largest known land predators, with powerful jaws and keen senses.
              </p>
            )}
          </motion.div>
        </div>

        {/* 1G. BOTTOM-LEFT "SCROLL TO EXPLORE" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="absolute bottom-10 left-[2.5rem] md:left-[4rem] hidden md:flex items-center gap-4 z-10 pointer-events-none"
        >
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px]">
            <span className="w-[1px] h-[12px] bg-gray-600" />
            <span className="w-[1px] h-[12px] bg-gray-600" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">
            Scroll to explore
          </span>
        </motion.div>
      </section>

      {/* SECTION 2: "EXPLORE OUR WORLD" */}
      <section id="exhibitions" className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
        {/* 2A. SECTION LABEL */}
        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12">
          <span className="text-gray-500 mr-2">[ 02 ]</span>
          <span className="text-gray-900 font-bold uppercase">Explore Our World</span>
        </div>

        {/* 2B. MAIN HEADING */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] max-w-[1000px] text-center px-6"
        >
          Unearth the stories of our planet's past{" "}
          <br className="hidden md:inline" />
          through fossils, prehistoric life, and ancient wonders.
        </motion.h2>

        {/* 2C. ACTION PILLS */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            initial: {},
            animate: {
              transition: { staggerChildren: 0.1, delayChildren: 0.3 },
            },
          }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 mb-10 md:mb-24 px-6 z-10"
        >
          {[
            { label: "Dinosaurs", icon: Bone, chapter: 0 },
            { label: "Ancient Life", icon: Dna, chapter: 1 },
            { label: "Marine Life", icon: Leaf, chapter: 3 },
            { label: "Prehistoric Giants", icon: Bone, chapter: 4 },
            { label: "Learn More", icon: BookOpen, chapter: null },
          ].map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.button
                key={pill.label}
                type="button"
                onClick={() => {
                  if (pill.chapter !== null) exploreChapter(pill.chapter);
                  else document.getElementById("learn")?.scrollIntoView({ behavior: "smooth" });
                }}
                variants={fadeUp}
                className="rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 px-6 py-2.5 flex items-center gap-2.5 cursor-pointer transition-all duration-300 hover:border-black hover:bg-black hover:text-white group"
              >
                <Icon size={14} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                <span>{pill.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* 2D. SPACER for Pterodactyl overlap */}
        <div className="w-full min-h-[220px] md:min-h-[450px]" />

        {/* 2E. BOTTOM TEXT */}
        <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-8 md:pb-12 pointer-events-none flex justify-between items-center z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium hidden md:block">
            WE DON'T JUST TELL STORIES.
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium hidden md:block">
            PALEONTOLOGY &copy; 2026
          </span>
        </div>
      </section>

      {/* SECTION 3: "ANCIENT COLLECTION" (Dark Section) */}
      <section id="collections" className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30">
        {/* 3A. PTERODACTYL IMAGE (Overlapping upward) */}
        <motion.div
          initial={{ y: "-65%", opacity: 0 }}
          whileInView={{ y: "-78%", opacity: 1 }}
          viewport={{ margin: "100px" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 w-[160vw] md:w-[1100px]"
        >
          <img
            src={pterodactylImg}
            alt="Pterodactyl Fossil Specimen"
            className="w-full h-auto object-contain select-none"
          />
        </motion.div>

        {/* 3B. HEADING AREA */}
        <div className="px-8 md:px-16 pt-32 md:pt-48 mb-16 z-20 flex flex-col xl:flex-row justify-between items-start gap-8">
          {/* Left Main heading with inline circle icons */}
          <h3 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-[880px]">
            Curated from millions of years of wonder{" "}
            <span className="inline-flex items-center gap-2 md:gap-3 align-middle mx-2 md:mx-4 -translate-y-1">
              <button type="button" onClick={() => setActiveChapter(0)} aria-label="Show dinosaurs chapter" className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer">
                <Bone size={22} />
              </button>
              <button type="button" onClick={() => setActiveChapter(1)} aria-label="Show ancient life chapter" className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer">
                <Dna size={22} />
              </button>
              <button type="button" onClick={() => setActiveChapter(3)} aria-label="Show marine fossil gallery chapter" className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer">
                <Leaf size={22} />
              </button>
            </span>{" "}
            & discovery.
          </h3>

          {/* Right Tagline + pills */}
          <div className="flex flex-col items-start xl:items-end">
            <p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed text-left xl:text-right">
              WE DON'T JUST DISPLAY FOSSILS
              <br />
              WE SHARE EARTH'S STORY
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Educational", "Authentic", "Inspiring"].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3C. TWO-COLUMN PANEL */}
        <div className="w-full border-t border-gray-800 flex flex-col md:flex-row z-20">
          {/* Left panel (35% width) */}
          <div className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[400px] md:min-h-[500px] flex flex-col justify-between p-8 relative overflow-hidden bg-[#0a0a0a]">
            {/* Top dots */}
            <div className="text-gray-500 text-xl tracking-[0.3em] font-mono select-none">
              ***
            </div>

            {/* Center Chapter image with Sand Transition */}
            <div className="relative w-full h-[280px] md:h-[340px] my-auto flex items-center justify-center">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={chaptersData[activeChapter].image}
                  alt={chaptersData[activeChapter].name}
                  className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten"
                />
              </AnimatePresence>
            </div>

            {/* Bottom chapter counter */}
            <div className="text-[10px] font-mono tracking-widest text-[#888] uppercase flex items-center">
              <div className="overflow-hidden h-4 inline-flex items-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={activeChapter}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-[#888] inline-block font-mono"
                  >
                    {String(activeChapter + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[#333] mx-1.5 font-mono">/</span>
              <span className="text-[#888] font-mono">05</span>
            </div>
          </div>

          {/* Right panel (65% width) */}
          <div className="w-full md:w-[65%] flex flex-col bg-[#0a0a0a]">
            {/* Top bar */}
            <div className="border-b border-gray-800 p-8 text-[10px] font-mono text-gray-400 tracking-widest flex justify-between items-center">
              <span>Explore the past. Understand the present.</span>
              <span className="text-gray-500">
                Chapter 0{activeChapter + 1}
              </span>
            </div>

            <div className="px-8 py-7 border-b border-gray-800" aria-live="polite">
              <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{chaptersData[activeChapter].description}</p>
              <p className="mt-4 text-[10px] font-mono tracking-wider text-[#b6c0a3] uppercase">Observe / {chaptersData[activeChapter].prompt}</p>
            </div>

            {/* Chapter list */}
            <div className="flex flex-col">
              {chaptersData.map((chapter, index) => {
                const isActive = activeChapter === index;
                return (
                  <button
                    key={chapter.name}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveChapter(index)}
                    className={`w-full text-left border-b border-gray-800/80 py-8 px-8 flex items-center justify-between cursor-pointer transition-colors duration-300 ${
                      isActive
                        ? "text-white bg-white/[0.02]"
                        : "text-[#444] hover:text-[#999]"
                    }`}
                  >
                    <span className="text-2xl md:text-[2rem] font-medium tracking-tight">
                      {chapter.name}
                    </span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5, x: -4 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: 4 }}
                            transition={{ duration: 0.25 }}
                          >
                            <ArrowUpRight
                              size={22}
                              strokeWidth={1}
                              className="text-gray-400"
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </section>
      <MuseumContent onExploreChapter={exploreChapter} />
      <MuseumFooter />
    </div>
  );
}
