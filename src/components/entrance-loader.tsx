import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Skiper39 from "@/components/ui/skiper39";
import "./entrance-loader.css";

const SESSION_KEY = "nhm-entered";
function hasEntered() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export default function EntranceLoader({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(hasEntered);
  const [leaving, setLeaving] = useState(false);
  const started = useRef(performance.now());
  const readyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const closing = useRef(false);
  const content = useRef<HTMLDivElement>(null);

  const enter = () => {
    if (closing.current) return;
    closing.current = true;
    setLeaving(true);
  };
  const onReady = () => {
    if (readyTimer.current) clearTimeout(readyTimer.current);
    readyTimer.current = setTimeout(
      enter,
      Math.max(0, 2200 - (performance.now() - started.current)),
    );
  };

  useEffect(() => {
    if (entered) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(enter, 4500);
    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(timeout);
      if (readyTimer.current) clearTimeout(readyTimer.current);
    };
  }, [entered]);

  useEffect(() => {
    if (!leaving) return;
    const timeout = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        /* Storage is optional. */
      }
      setEntered(true);
    }, 450);
    return () => clearTimeout(timeout);
  }, [leaving]);

  useEffect(() => {
    if (entered && closing.current)
      content.current?.focus({ preventScroll: true });
  }, [entered]);

  if (entered)
    return (
      <div ref={content} tabIndex={-1} className="museum-entered">
        {children}
      </div>
    );
  return (
    <div className={`museum-loader ${leaving ? "museum-loader-leaving" : ""}`}>
      <div className="museum-loader-top">
        <span>
          NHM <span>/ NATURAL HISTORY MUSEUM</span>
        </span>
        <button type="button" onClick={enter}>
          Enter museum <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="museum-loader-heading">
        <p>FOR THE ENDLESSLY CURIOUS</p>
        <h1>
          A little curiosity.
          <br />
          <em>A whole new world.</em>
        </h1>
        <p role="status" aria-live="polite">
          Opening the museum
          <span className="museum-loader-dots" aria-hidden="true">
            ...
          </span>
        </p>
      </div>
      <div className="museum-loader-crowd">
        <Skiper39 onReady={onReady} onError={enter} />
      </div>
      <div className="museum-loader-bottom">
        <span>COME AS YOU ARE. LEAVE CURIOUS.</span>
        <span>
          Illustrations: <a href="https://www.openpeeps.com/">Open Peeps</a> ·
          Animation: <a href="https://skiper-ui.com/">Skiper UI</a>
        </span>
      </div>
    </div>
  );
}
