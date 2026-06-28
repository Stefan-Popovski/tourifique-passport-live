# Tourifique Passport — Onboarding Module

A self-contained, drop-in React onboarding flow for the **Tourifique Passport**
Travelpreneur quiz. Built so it can be merged into any existing GitHub website
without touching global styles, body styles, or unrelated files.

## What you get

```
src/components/onboarding/
├── OnboardingFlow.jsx     ← the component you import
├── ParrotMascot.jsx       ← animated parrot guide (emoji fallback if image missing)
├── PassportResult.jsx     ← result card + share/download/invite/join buttons
├── onboarding.css         ← all styles, prefixed `onboarding-`
├── index.js               ← barrel export
└── README.md
```

## Isolation guarantees

- **No global styles** — every CSS rule is scoped under `.onboarding-root`. The
  file contains no `body`, `html`, `*`, or other global selectors.
- **No class-name collisions** — every class starts with `onboarding-`.
- **Scoped `box-sizing` reset** — applied only to descendants of
  `.onboarding-root`, so host CSS can't break the layout and the module won't
  affect host elements.
- **No peer dependencies** — only React. No animation, icon, or UI library.
- **Embeddable** — by default the module sizes to its content (no forced
  `100vh`) so you can drop it inside a section, a modal, a tab, etc.
- **Robust at runtime** — missing parrot image → emoji fallback; clipboard API
  unavailable → legacy `execCommand` fallback; localStorage blocked → silently
  skipped.

## 1. Install

Copy the entire `src/components/onboarding/` folder into your React project.

### Mascot asset (today)

Export your `.ai` mascot from Illustrator as **SVG** and drop it at:

```
public/assets/parrot.svg
```

> **Do not import the `.ai` file directly** — Illustrator files aren't a
> web format. Use `File → Export → Export As → SVG` (or PNG) in Illustrator.

If you skip this step, the mascot still renders — it falls back to a parrot
emoji until you add the file.

### Mascot assets (later, multi-part mode)

When you want each part of the parrot to animate independently (wings flap,
eyes blink, beak chirps), export each layer separately at the **same canvas
size** and place them here:

```
public/assets/parrot/body.svg
public/assets/parrot/left-wing.svg
public/assets/parrot/right-wing.svg
public/assets/parrot/eyes.svg
public/assets/parrot/beak.svg
```

Then turn on the `parrotParts` prop (see usage below). Until you do, the
single-image mode is used.

## 2. Use it in `App.jsx`

```jsx
import React from "react";
import OnboardingFlow from "./components/onboarding";

export default function App() {
  return <OnboardingFlow />;
}
```

That's it.

### As a full-screen onboarding page

```jsx
<OnboardingFlow fullScreen />
```

### Embedded inside an existing section (default)

```jsx
<section className="my-page-section">
  <OnboardingFlow />
</section>
```

### With callbacks for your real app

```jsx
<OnboardingFlow
  onComplete={(answers) => console.log("Quiz answers:", answers)}
  onJoin={(passport) => { window.location.href = "/signup"; }}
  storageKey="tourifique.onboarding"
  parrotSrc="/assets/parrot.svg"
/>
```

### With layered SVG parts (when you're ready)

```jsx
{/* Uses the defaults under public/assets/parrot/ */}
<OnboardingFlow parrotParts />

{/* Or override any subset of paths */}
<OnboardingFlow
  parrotParts={{
    body: "/assets/parrot/body.svg",
    leftWing: "/assets/parrot/left-wing.svg",
    rightWing: "/assets/parrot/right-wing.svg",
    eyes: "/assets/parrot/eyes.svg",
    beak: "/assets/parrot/beak.svg",
  }}
/>
```

In parts mode the whole bird still does the idle float, happy jump,
thinking wiggle and celebration. On top of that:
- The wings flap fast during the loading screen and wave on celebrate.
- The eyes blink occasionally and glance up on the thinking mood.
- The beak chirps in time with the loading flap.

## Props

| Prop          | Type                         | Default                    | Description                                                  |
| ------------- | ---------------------------- | -------------------------- | ------------------------------------------------------------ |
| `onComplete`  | `(answers) => void`          | `undefined`                | Fires after fake-AI loading, before the result is displayed. |
| `onJoin`      | `(passport) => void`         | `undefined`                | Fires when the user clicks **Join Tourifique**.              |
| `storageKey`  | `string`                     | `"tourifique.onboarding"`  | localStorage key used to persist progress + answers.         |
| `parrotSrc`   | `string`                     | `"/assets/parrot.svg"`     | Path/URL for the single-image parrot mascot.                 |
| `parrotParts` | `true \| { body, leftWing, rightWing, eyes, beak }` | `undefined` | Turn on multi-part mode. `true` uses defaults under `/assets/parrot/`. |
| `fullScreen`  | `boolean`                    | `false`                    | If true, the module fills the viewport (`min-height: 100vh`). |
| `className`   | `string`                     | `""`                       | Extra class on the outer root.                               |
| `style`       | `React.CSSProperties`        | `undefined`                | Inline style on the outer root.                              |

## Where to customize

Open the matching file and look for the big banner comments
`▼▼▼ CUSTOMIZE … HERE ▼▼▼`.

| What you want to change         | File                  | Marker                                |
| ------------------------------- | --------------------- | ------------------------------------- |
| Quiz questions & options        | `OnboardingFlow.jsx`  | `CUSTOMIZE QUIZ QUESTIONS HERE`       |
| Parrot speech-bubble messages   | `OnboardingFlow.jsx`  | `CUSTOMIZE MASCOT MESSAGES HERE`      |
| Colors / theme / gradient       | `onboarding.css`      | `CUSTOMIZE COLORS / THEME HERE`       |
| Default parrot asset paths      | `ParrotMascot.jsx`    | `CUSTOMIZE MASCOT ASSET PATHS HERE`   |
| Wing / eye / beak pivot points  | `onboarding.css`      | `CUSTOMIZE PARROT PART PIVOTS HERE`   |
| Travelpreneur Type mappings     | `PassportResult.jsx`  | `CUSTOMIZE PASSPORT GENERATION HERE`  |
| Supplier matches per region     | `PassportResult.jsx`  | `CUSTOMIZE PASSPORT GENERATION HERE`  |
| Collab idea / reel templates    | `PassportResult.jsx`  | `CUSTOMIZE PASSPORT GENERATION HERE`  |

## Resetting the flow

The component automatically restores from localStorage. The result screen has
a **Retake the quiz** button that clears the saved state and returns to the
intro screen.
