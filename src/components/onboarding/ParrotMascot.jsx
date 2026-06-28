import React, { useEffect, useState } from "react";
import { assetUrl } from "../../lib/assetUrl";

/**
 * ParrotMascot — the onboarding NPC
 * ---------------------------------------------------------------
 * GIF-first, no emoji fallback. The default asset is the real
 * parrot animation at /assets/survey-parrot.gif rendered with a
 * plain <img> tag (GIFs animate natively, no <video> needed). If
 * the file fails to load the component simply renders nothing —
 * the surrounding layout never reserves space for a missing
 * mascot and no flamingo/emoji placeholder is shown.
 *
 * THREE RENDER MODES
 * ------------------
 * 1) Image mode (default — used for .gif / .png / .svg)
 *      <ParrotMascot imageSrc="/assets/survey-parrot.gif" />
 *    Outputs:
 *      <img class="onboarding-npc-gif" src="..." />
 *
 * 2) Video mode (only if you opt-in by passing a .mp4 / .mov /
 *    .webm path — auto-detected by file extension)
 *      <ParrotMascot imageSrc="/assets/survey-parrot.mp4" />
 *    Outputs:
 *      <video class="onboarding-npc-video" autoplay muted loop
 *             playsInline preload="auto" />
 *
 * 3) Parts mode (optional — multi-SVG layered parrot)
 *      <ParrotMascot parts />
 *      <ParrotMascot parts={{ body: "/x.svg" }} />
 *
 * Props:
 *  - mood: "idle" | "happy" | "thinking" | "loading" | "celebrate"
 *  - imageSrc: asset path (image OR video, auto-detected)
 *  - parts: undefined | true | { body, leftWing, rightWing, eyes, beak }
 */

const MOOD_CLASS = {
  idle: "onboarding-mascot--idle",
  happy: "onboarding-mascot--happy",
  thinking: "onboarding-mascot--thinking",
  loading: "onboarding-mascot--loading",
  celebrate: "onboarding-mascot--celebrate",
};

/* =========================================================
   ▼▼▼  CUSTOMIZE MASCOT ASSET PATHS HERE  ▼▼▼
   • DEFAULT_IMAGE_SRC — video or image (auto-detected).
   • DEFAULT_POSTER_SRC — static parrot shown *immediately*
     under the video while it buffers AND used as a fallback
     if the video codec can't be decoded by the browser.
     Both files live under `public/assets/`.
   ========================================================= */
const DEFAULT_IMAGE_SRC = assetUrl("assets/survey-parrot.gif");
const DEFAULT_POSTER_SRC = assetUrl("assets/parrot_full_transparent.png");

const DEFAULT_PARTS = {
  body: assetUrl("assets/parrot/body.svg"),
  leftWing: assetUrl("assets/parrot/left-wing.svg"),
  rightWing: assetUrl("assets/parrot/right-wing.svg"),
  eyes: assetUrl("assets/parrot/eyes.svg"),
  beak: assetUrl("assets/parrot/beak.svg"),
};
/* =========================================================
   ▲▲▲  END MASCOT ASSET PATHS  ▲▲▲
   ========================================================= */

const VIDEO_EXT = /\.(mov|mp4|webm|m4v|ogv)(\?.*)?$/i;
function isVideoSrc(src) {
  return typeof src === "string" && VIDEO_EXT.test(src);
}

function resolveParts(parts) {
  if (!parts) return null;
  if (parts === true) return DEFAULT_PARTS;
  if (typeof parts === "object") return { ...DEFAULT_PARTS, ...parts };
  return null;
}

export default function ParrotMascot({
  mood = "idle",
  imageSrc = DEFAULT_IMAGE_SRC,
  posterSrc = DEFAULT_POSTER_SRC,
  parts,
}) {
  const moodClass = MOOD_CLASS[mood] || MOOD_CLASS.idle;
  const resolvedParts = resolveParts(parts);
  const [failed, setFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setVideoFailed(false);
  }, [imageSrc, parts]);

  // If the asset can't be loaded the component renders NOTHING.
  // No flamingo, no emoji, no placeholder bird — by design.
  if (failed) return null;

  /* -------- NPC mode (default) -------- */
  /* Bare <img> (for .gif/.png/.svg) or <video> (for .mp4/.mov),
     no wrapping div — so the consumer drops the mascot directly
     inside its own row layout (e.g. .onboarding-npc-row). GIFs
     loop natively in <img>, so the parrot keeps animating while
     the user reads / picks an option. */
  if (!resolvedParts) {
    const isVideo = isVideoSrc(imageSrc);

    // Video chosen but codec couldn't decode → swap to the
    // static poster image (still THE parrot, not an emoji).
    if (isVideo && videoFailed && posterSrc) {
      return (
        <div className="onboarding-npc-wrap" data-mood={mood}>
          <img
            className="onboarding-npc-gif"
            src={posterSrc}
            alt="Tori parrot mascot"
            draggable="false"
            onError={(e) => {
              // eslint-disable-next-line no-console
              console.error("[Onboarding] NPC poster failed to load:", e.currentTarget.src);
              setFailed(true);
            }}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          className="onboarding-npc-video"
          src={imageSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          data-mood={mood}
          onError={() => {
            // eslint-disable-next-line no-console
            console.error("[Onboarding] NPC video failed to decode:", imageSrc, "→ falling back to poster image.");
            setVideoFailed(true);
          }}
        />
      );
    }

    return (
      <div className="onboarding-npc-wrap" data-mood={mood}>
        <img
          className="onboarding-npc-gif"
          src={imageSrc}
          alt="Tori parrot mascot"
          draggable="false"
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.error("[Onboarding] NPC image failed to load:", e.currentTarget.src);
            setFailed(true);
          }}
        />
      </div>
    );
  }

  /* -------- Parts mode (layered SVGs) -------- */
  return (
    <div className="onboarding-mascot-wrap">
      <div
        key={mood}
        className={`onboarding-mascot ${moodClass}`}
        data-mode="parts"
        data-mood={mood}
        aria-hidden="true"
      >
        <div className="onboarding-parrot-parts">
          <img
            className="onboarding-parrot-part onboarding-parrot-part--body"
            src={resolvedParts.body}
            alt=""
            draggable="false"
            onError={() => setFailed(true)}
          />
          <img
            className="onboarding-parrot-part onboarding-parrot-part--right-wing"
            src={resolvedParts.rightWing}
            alt=""
            draggable="false"
            onError={() => setFailed(true)}
          />
          <img
            className="onboarding-parrot-part onboarding-parrot-part--left-wing"
            src={resolvedParts.leftWing}
            alt=""
            draggable="false"
            onError={() => setFailed(true)}
          />
          <img
            className="onboarding-parrot-part onboarding-parrot-part--beak"
            src={resolvedParts.beak}
            alt=""
            draggable="false"
            onError={() => setFailed(true)}
          />
          <img
            className="onboarding-parrot-part onboarding-parrot-part--eyes"
            src={resolvedParts.eyes}
            alt=""
            draggable="false"
            onError={() => setFailed(true)}
          />
        </div>
      </div>
    </div>
  );
}
