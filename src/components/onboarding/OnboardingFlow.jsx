import React, { useEffect, useMemo, useState } from "react";
import ParrotMascot from "./ParrotMascot";
import OptionIcon from "./OnboardingIcons";
import { assetUrl } from "../../lib/assetUrl";
import "./onboarding.css";

/**
 * OnboardingFlow — Tourifique Passport
 * ---------------------------------------------------------------
 * A clean, gamified, mobile-first onboarding quiz. Drop this
 * component into any React app — it only uses class names
 * prefixed with `onboarding-` and never touches global styles.
 *
 *   import OnboardingFlow from "./components/onboarding";
 *   <OnboardingFlow />
 *
 * Props (all optional):
 *  - onComplete(answers)       — fired when the quiz finishes. Hook your
 *                                own passport / next screen here; the
 *                                component renders nothing after this.
 *  - storageKey                — localStorage key (default: "tourifique.onboarding")
 *  - parrotSrc                 — animated parrot asset path. Defaults to
 *                                "/assets/survey-parrot.gif" (rendered as <img>).
 *                                You can pass an .svg/.png OR a .mp4/.mov/.webm
 *                                and ParrotMascot auto-detects which tag to use.
 *  - parrotParts               — multi-part mascot config (used when SHOW_PARROT)
 *  - fullScreen                — fills viewport (default false → embed inline)
 *  - className / style         — extra class/style on the outer root
 * ---------------------------------------------------------------
 */

/* =========================================================
   ▼  Parrot mascot toggle  ▼
   Set to `false` to hide the parrot completely. Set to `true`
   to show the compact mascot+bubble strip at the top of the
   card during intro / quiz / loading. The parrot uses the
   existing idle / happy / thinking / loading animations from
   onboarding.css — no extra animation work needed.
   ========================================================= */
const SHOW_PARROT = true;
/* ========================================================= */

/* =========================================================
   ▼▼▼  CUSTOMIZE QUIZ QUESTIONS HERE  ▼▼▼
   Each option is `{ label, icon, description?, recommended? }`:
     • label        — the answer text (required)
     • icon         — a name from OnboardingIcons.jsx (e.g.
                      "video-camera", "city", "diamond")
     • description  — optional helper text shown under the title
                      (Duolingo-style); leave out for a clean look
     • recommended  — optional. When true, shows a "Recommended"
                      pill in the top-right of the card.
   The progress bar adapts to the length of this array.
   ========================================================= */
const QUESTIONS = [
  {
    id: "q1",
    text: "What kind of content do you create?",
    options: [
      { label: "Travel vlogs",            icon: "video-camera" },
      { label: "Food reviews",            icon: "utensils" },
      { label: "Hotel/luxury stays",      icon: "bed" },
      { label: "Culture/history content", icon: "temple" },
      { label: "Adventure content",       icon: "mountains" },
      { label: "Lifestyle content",       icon: "sparkles" },
    ],
  },
  {
    id: "q2",
    text: "Where do you want your next collaboration?",
    options: [
      { label: "Skopje",                  icon: "city" },
      { label: "Ohrid",                   icon: "water-wave" },
      { label: "Balkans",                 icon: "mountain-range" },
      { label: "Europe",                  icon: "globe" },
      { label: "Anywhere / surprise me",  icon: "dice" },
    ],
  },
  {
    id: "q3",
    text: "What is your travel style?",
    options: [
      { label: "Budget explorer",         icon: "backpack" },
      { label: "Luxury traveler",         icon: "diamond" },
      { label: "Hidden-gems hunter",      icon: "search" },
      { label: "Food lover",              icon: "bowl" },
      { label: "Culture explorer",        icon: "mask" },
      { label: "Adventure seeker",        icon: "parachute" },
    ],
  },
  {
    id: "q4",
    text: "What platforms do you use most?",
    options: [
      { label: "TikTok",                  icon: "music-note" },
      { label: "Instagram Reels",         icon: "camera-square" },
      { label: "YouTube Shorts",          icon: "play-vertical" },
      { label: "YouTube long videos",     icon: "play-horizontal" },
      { label: "Blog/website",            icon: "document" },
    ],
  },
  {
    id: "q5",
    text: "What makes you stop scrolling?",
    options: [
      { label: "Beautiful hotels",        icon: "palm" },
      { label: "Delicious food",          icon: "pizza" },
      { label: "Hidden places",           icon: "key" },
      { label: "Adventure videos",        icon: "lightning" },
      { label: "Local culture",           icon: "palette" },
      { label: "Luxury experiences",      icon: "champagne" },
      { label: "Funny travel moments",    icon: "laugh" },
    ],
  },
];
/* =========================================================
   ▲▲▲  END QUESTIONS  ▲▲▲
   ========================================================= */

/* =========================================================
   ▼▼▼  CUSTOMIZE MASCOT MESSAGES HERE  ▼▼▼
   These speech-bubble lines sit next to the parrot at the top
   of every stage. The quiz step replaces them with the current
   question text — but `questionBubbles` is a backup if you'd
   rather show a friendly intro per step instead of the literal
   question.
   ========================================================= */
const MASCOT_MESSAGES = {
  intro: "Hi! I'm Tori. Let's build your Travelpreneur Passport!",
  loading: "Cooking up your Passport…",
  result: "Tadaa! Here's your Passport.",
  questionBubbles: [
    "Let's start with the fun stuff!",
    "Where do you want to fly next?",
    "How do you love to travel?",
    "Where do your stories live?",
    "Last one — be honest!",
  ],
};
/* =========================================================
   ▲▲▲  END MASCOT MESSAGES  ▲▲▲
   To change COLORS open `onboarding.css` and edit the
   variables inside the "CUSTOMIZE COLORS" block.
   ========================================================= */

/* localStorage helper that won't crash in privacy mode / SSR */
const safeStorage = {
  get(key) {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / privacy errors */
    }
  },
  remove(key) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

/* ---------- Decorative dotted world map ------------------ */
/* Detailed continent silhouettes are combined into one
   <clipPath>, then a dense small-dot pattern is clipped to
   that path. Dots only appear inside continent shapes,
   producing a recognisable dotted world map. Pure SVG. */
const WORLD_CONTINENTS_PATH = [
  /* North America */
  "M 8,30 L 18,26 L 30,25 L 42,26 L 55,25 L 68,25 L 82,26 L 95,28 L 105,30 L 115,32 L 125,32 L 135,34 L 145,38 L 150,48 L 148,56 L 144,64 L 138,70 L 132,75 L 134,80 L 136,82 L 132,84 L 128,78 L 120,76 L 112,75 L 105,76 L 103,80 L 105,84 L 107,88 L 105,92 L 100,96 L 95,100 L 90,104 L 87,107 L 84,104 L 82,100 L 80,96 L 78,90 L 75,86 L 70,80 L 65,74 L 55,68 L 45,62 L 35,54 L 25,44 L 15,35 Z",
  /* Greenland */
  "M 148,18 L 158,16 L 166,20 L 170,28 L 170,38 L 164,44 L 154,44 L 146,38 L 144,28 Z",
  /* South America */
  "M 88,108 L 100,106 L 110,108 L 118,114 L 124,124 L 126,134 L 124,144 L 120,154 L 115,162 L 109,168 L 103,170 L 96,166 L 92,158 L 90,148 L 88,138 L 86,128 L 88,118 Z",
  /* Europe */
  "M 175,32 L 182,30 L 188,32 L 195,30 L 205,28 L 215,30 L 222,34 L 225,38 L 224,42 L 220,44 L 220,48 L 215,48 L 215,52 L 210,50 L 208,52 L 210,54 L 208,58 L 205,60 L 202,57 L 198,54 L 195,55 L 192,52 L 188,52 L 185,50 L 180,48 L 175,46 L 173,42 L 174,38 Z",
  /* Africa */
  "M 185,66 L 195,64 L 205,64 L 215,66 L 222,70 L 230,76 L 235,84 L 233,90 L 230,98 L 232,105 L 228,114 L 224,124 L 218,134 L 214,142 L 208,148 L 200,150 L 195,148 L 190,142 L 186,134 L 184,124 L 182,114 L 179,104 L 178,94 L 178,84 L 180,76 L 183,70 Z",
  /* Asia (with India peninsula + Arabian Peninsula) */
  "M 218,34 L 240,32 L 260,30 L 280,30 L 300,30 L 320,32 L 340,34 L 355,36 L 362,42 L 362,50 L 358,58 L 350,64 L 345,70 L 340,76 L 335,80 L 328,84 L 322,88 L 316,92 L 312,96 L 308,100 L 305,104 L 302,108 L 296,106 L 290,104 L 285,108 L 280,114 L 275,120 L 270,126 L 266,130 L 262,126 L 258,118 L 254,110 L 250,102 L 246,98 L 240,98 L 234,96 L 230,90 L 228,84 L 230,78 L 228,74 L 226,68 L 228,62 L 224,56 L 222,50 L 222,42 L 220,36 Z",
  /* Indonesia island 1 (Sumatra) */
  "M 296,110 L 308,108 L 318,114 L 314,118 L 304,118 L 298,114 Z",
  /* Indonesia island 2 (Borneo) */
  "M 322,114 L 332,113 L 342,116 L 344,122 L 336,124 L 326,122 Z",
  /* Indonesia island 3 (New Guinea) */
  "M 348,124 L 360,124 L 364,128 L 358,132 L 350,130 Z",
  /* Java + Bali */
  "M 308,128 L 318,128 L 324,130 L 322,134 L 314,134 L 308,132 Z",
  /* Australia */
  "M 310,138 L 318,136 L 328,136 L 338,138 L 346,142 L 352,148 L 352,154 L 348,160 L 340,164 L 330,166 L 318,164 L 308,160 L 302,154 L 302,148 L 306,142 Z",
  /* Tasmania */
  "M 332,170 L 340,170 L 342,174 L 336,176 L 330,174 Z",
].join(" ");

function DecorativeMap({ subtle = false }) {
  const wrapClass = `onboarding-map${subtle ? " onboarding-map--subtle" : ""}`;
  return (
    <div className={wrapClass} aria-hidden="true">
      <svg
        className="onboarding-map-svg"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Dense dot pattern that paints the continents */}
          <pattern
            id="ob-map-dots"
            x="0"
            y="0"
            width="5.5"
            height="5.5"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2.75"
              cy="2.75"
              r="1.05"
              className="onboarding-map-dot"
            />
          </pattern>
          {/* Combined continents — clips the dot fill */}
          <clipPath id="ob-map-clip">
            <path d={WORLD_CONTINENTS_PATH} />
          </clipPath>
        </defs>

        {/* The dotted world map */}
        <rect
          x="0"
          y="0"
          width="400"
          height="200"
          fill="url(#ob-map-dots)"
          clipPath="url(#ob-map-clip)"
        />

        {/* Decorative pins on other continents (hidden on subtle) */}
        <circle className="onboarding-map-decoration-dot" cx="115" cy="62" r="2.2" />
        <circle className="onboarding-map-decoration-dot" cx="340" cy="62" r="2.2" />
        <circle className="onboarding-map-decoration-dot" cx="108" cy="138" r="2.2" />
        <circle className="onboarding-map-decoration-dot" cx="332" cy="154" r="2.2" />

        {/* Labelled pins — Skopje, Ohrid, Balkans (hidden on subtle) */}
        <g className="onboarding-map-pin">
          <circle className="onboarding-map-pin-halo" cx="218" cy="40" r="7" />
          <circle className="onboarding-map-pin-dot" cx="218" cy="40" r="2.8" />
          <text x="218" y="30">BALKANS</text>
        </g>
        <g className="onboarding-map-pin">
          <circle className="onboarding-map-pin-halo" cx="188" cy="48" r="7" />
          <circle className="onboarding-map-pin-dot" cx="188" cy="48" r="2.8" />
          <text x="188" y="66">SKOPJE</text>
        </g>
        <g className="onboarding-map-pin">
          <circle className="onboarding-map-pin-halo" cx="206" cy="56" r="7" />
          <circle className="onboarding-map-pin-dot" cx="206" cy="56" r="2.8" />
          <text x="206" y="74">OHRID</text>
        </g>
      </svg>
    </div>
  );
}

export default function OnboardingFlow({
  onComplete,
  storageKey = "tourifique.onboarding",
  parrotSrc = assetUrl("assets/survey-parrot.gif"),
  parrotParts,
  fullScreen = false,
  className = "",
  style,
}) {
  /* stage: "quiz" | "loading" | "done" — the flow jumps straight
     into the quiz (no intro screen). When it finishes it fires
     onComplete(answers) and renders nothing, so the host app can
     swap in its own passport / next screen. */
  const [stage, setStage] = useState("quiz");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mascotMood, setMascotMood] = useState("thinking");

  const totalSteps = QUESTIONS.length;
  const currentQuestion = QUESTIONS[stepIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const canContinue = Boolean(currentAnswer);

  /* Restore previous progress (if any) on first mount */
  useEffect(() => {
    const saved = safeStorage.get(storageKey);
    if (!saved) return;
    if (saved.answers) setAnswers(saved.answers);
    if (typeof saved.stepIndex === "number" && saved.stage === "quiz") {
      setStage("quiz");
      setStepIndex(Math.min(Math.max(saved.stepIndex, 0), totalSteps - 1));
    }
  }, [storageKey, totalSteps]);

  /* Persist progress on every meaningful change */
  useEffect(() => {
    safeStorage.set(storageKey, { stage, stepIndex, answers });
  }, [stage, stepIndex, answers, storageKey]);

  /* Fake AI loading -> done */
  useEffect(() => {
    if (stage !== "loading") return undefined;
    setMascotMood("loading");
    const t = window.setTimeout(() => {
      setStage("done");
      setMascotMood("celebrate");
      if (typeof onComplete === "function") {
        try { onComplete(answers); } catch { /* host callback shouldn't crash flow */ }
      }
    }, 2000);
    return () => window.clearTimeout(t);
  }, [stage, answers, onComplete]);

  /* ---------------- Handlers ---------------- */
  const handleSelect = (label) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: label }));
    setMascotMood("happy");
  };

  const handleContinue = () => {
    if (!canContinue) return;
    const isLast = stepIndex >= totalSteps - 1;
    if (isLast) {
      setStage("loading");
    } else {
      setStepIndex((i) => i + 1);
      setMascotMood("thinking");
    }
  };

  const handleBack = () => {
    if (stage !== "quiz") return;
    if (stepIndex === 0) return; // first question — nothing to go back to
    setStepIndex((i) => Math.max(0, i - 1));
    setMascotMood("thinking");
  };

  /* ---------------- Progress + bubble ---------------- */
  const progressPct = useMemo(() => {
    if (stage === "quiz") return (stepIndex / totalSteps) * 100;
    return 100;
  }, [stage, stepIndex, totalSteps]);

  /* The text the parrot "says" next to its head per stage. On
     quiz steps this is the literal question — the parrot lives
     at the TOP of the card alongside the question, not at the
     bottom. */
  const bubbleMessage = useMemo(() => {
    if (stage === "quiz") return currentQuestion?.text || "";
    if (stage === "loading") return MASCOT_MESSAGES.loading;
    return "";
  }, [stage, currentQuestion]);

  /* ---------------- Render helpers ---------------- */
  const renderTopbar = () => {
    if (stage !== "quiz" && stage !== "loading") return null;
    const stepLabel =
      stage === "quiz"
        ? `STEP ${stepIndex + 1} OF ${totalSteps}`
        : "FINALISING…";
    return (
      <>
        <header className="onboarding-topbar">
          <button
            type="button"
            className="onboarding-back"
            onClick={handleBack}
            disabled={stage !== "quiz" || stepIndex === 0}
            aria-label="Go back to previous question"
          >
            {/* Left arrow */}
            {"\u2190"}
          </button>
          <div
            className="onboarding-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPct)}
          >
            <div
              className="onboarding-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </header>
        <p className="onboarding-step-label">{stepLabel}</p>
      </>
    );
  };

  /* NPC + speech bubble — Duolingo-style row. Used at the top
     of intro / quiz / loading so the parrot is always in the
     same spot. The mascot element is rendered BARE (no extra
     wrapper) so the row's flex layout owns the alignment. */
  const renderNPCRow = (bubbleText, moodOverride) => (
    <div className="onboarding-npc-row">
      {SHOW_PARROT ? (
        <ParrotMascot
          mood={moodOverride || mascotMood}
          imageSrc={parrotSrc}
          parts={parrotParts}
        />
      ) : null}
      {bubbleText ? (
        <div
          className="onboarding-question-bubble"
          key={bubbleText}
          role="status"
          aria-live="polite"
        >
          <h2>{bubbleText}</h2>
        </div>
      ) : null}
    </div>
  );

  const renderQuestion = () => (
    <div className="onboarding-question" key={currentQuestion.id}>
      {/* Parrot at the top of the card with the question text in
          its speech bubble — left-anchored, bigger mascot. */}
      {renderNPCRow(currentQuestion.text)}

      <div
        className="onboarding-options"
        role="radiogroup"
        aria-label={currentQuestion.text}
      >
        {currentQuestion.options.map((opt) => {
          const isSelected = currentAnswer === opt.label;
          return (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`onboarding-option${
                isSelected ? " onboarding-option--selected" : ""
              }`}
              onClick={() => handleSelect(opt.label)}
            >
              <span className="onboarding-option-icon" aria-hidden="true">
                <OptionIcon name={opt.icon} />
              </span>
              <span className="onboarding-option-text">
                <span className="onboarding-option-title">{opt.label}</span>
                {opt.description ? (
                  <span className="onboarding-option-desc">
                    {opt.description}
                  </span>
                ) : null}
              </span>
              {opt.recommended ? (
                <span className="onboarding-option-badge">Recommended</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Small gray decorative map between options and Continue */}
      <DecorativeMap subtle />

      <button
        type="button"
        className="onboarding-continue"
        onClick={handleContinue}
        disabled={!canContinue}
      >
        Continue
      </button>
    </div>
  );

  const renderLoading = () => (
    <div className="onboarding-loading">
      {renderNPCRow(bubbleMessage, "loading")}
      <div className="onboarding-spinner" aria-hidden="true" />
      <h3>Finalising your answers…</h3>
      <p>Just a moment.</p>
    </div>
  );

  /* ---------------- Main ---------------- */
  /* Quiz finished — hand off to the host (it fired onComplete in
     the loading effect). Render nothing so the host can show its
     own passport / next screen in this slot. */
  if (stage === "done") return null;

  const rootClass = [
    "onboarding-root",
    fullScreen ? "onboarding-root--fullscreen" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} data-stage={stage} style={style}>
      <div className="onboarding-card">
        {renderTopbar()}
        {stage === "quiz" && currentQuestion && renderQuestion()}
        {stage === "loading" && renderLoading()}
      </div>
    </div>
  );
}
