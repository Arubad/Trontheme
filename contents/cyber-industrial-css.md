---
title: The Cyber-Industrial Design System — Dark UI in the Grid
date: "2025.08.22"
tags: ["CSS", "Design", "Tron"]
---

# The Cyber-Industrial Design System

There's a particular aesthetic that's been quietly dominating developer portfolios and SaaS dashboards: **dark, grid-heavy, neon-accented UI**. I call it Cyber-Industrial.

This is my documented design system for building it.

---

## Color Palette

The palette is minimal — maximum contrast, zero noise:

| Token | Value | Usage |
|---|---|---|
| `--tron-black` | `#000000` | Page background |
| `--tron-dark` | `#020810` | Panel backgrounds |
| `--tron-cyan` | `#00c8ff` | Primary accent, glows |
| `--tron-red` | `#ff2200` | Danger, alerts |
| `--tron-white` | `#e8f4f8` | Body text |
| `--tron-muted` | `#4a7a8a` | Labels, metadata |

> **Rule:** Never use pure white (`#ffffff`) for text on dark backgrounds. The slight blue tint in `#e8f4f8` reduces eye strain and feels more "digital."

---

## The Grid Overlay

The signature grid effect is pure CSS — two crossing gradients:

```css
.tron-grid-overlay {
  background-image:
    linear-gradient(rgba(0, 200, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}
```

**Key:** The opacity is `0.04` — barely visible. A stronger grid becomes noise. The goal is depth, not pattern.

---

## Glassmorphism Panels

Every content panel uses this combo:

```css
.tron-panel {
  background: rgba(0, 12, 28, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 4px;
}
```

Three things at work:
1. **Dark translucent fill** — lets the video/background bleed through subtly
2. **Backdrop blur** — creates the frosted glass depth effect
3. **1px cyan border** — the defining edge of the Tron aesthetic

---

## Neon Text Glow

Don't use `text-shadow` on large text — it's expensive and causes visual blur. Reserve it for **small display text**:

```css
.tron-accent {
  color: var(--tron-cyan);
  text-shadow:
    0 0 15px var(--tron-cyan),
    0 0 40px rgba(0, 200, 255, 0.5);
}
```

For headings, use **color alone** — clean and sharp.

---

## Animation Philosophy

Two rules:

1. **GPU-only transforms** — only animate `transform` and `opacity`. Never `width`, `height`, `top`, `left`.
2. **Hardware promotion** — add `will-change: transform` to elements that animate frequently.

```css
.skill-bar-fill {
  animation: fillBar 1.4s ease-out forwards;
  will-change: transform; /* promotes to GPU layer */
}
```

The **ease-out-quart** curve is the signature motion feel:

```css
transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
```

Fast launch, smooth landing. Feels premium and intentional.

---

## Scanline Effect

The subtle scanline overlay adds texture without noise:

```css
.tron-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.12) 3px,
    rgba(0, 0, 0, 0.12) 4px
  );
  animation: scanline-drift 8s linear infinite;
}
```

A drift animation moves the scanlines slowly — referencing CRT monitors without being gimmicky.

---

## Watch This for Inspiration

::youtube[6NkN5K1f0_U]

---

## Summary

The system works because it's **constrained**. One accent color. One font pair. One motion curve. Constraints create cohesion. Cohesion creates premium feel.

Build your own version — pick one neon, one dark, one mono font. The rest is just craft.
