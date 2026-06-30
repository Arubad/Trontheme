---
title: Building Scroll-Synced Video Experiences with Native Web APIs
date: "2025.12.01"
tags: ["Animation", "JavaScript", "WebAPI"]
---

# Building Scroll-Synced Video Experiences

Scroll-driven animations are one of the most satisfying interactions on the modern web. In this post, I'll break down how I built a **scroll-synced video background** using only native browser APIs — no library overhead, just raw `requestAnimationFrame` and `HTMLVideoElement`.

## The Core Idea

The trick is deceptively simple:

> Map `window.scrollY` to `video.currentTime` on every animation frame.

```javascript
const syncVideo = () => {
  const scrollPct = window.scrollY / maxScroll;
  video.currentTime = scrollPct * video.duration;
};
```

The hard part is making it **feel premium** — no jank, no stutter, no dropped frames.

---

## Why `requestAnimationFrame`?

Naively, you might attach to the `scroll` event directly. But scroll events can fire at 60+ Hz and pile up faster than the browser can paint. Instead, we **batch** updates using `rAF`:

```javascript
let rafId = null;

window.addEventListener('scroll', () => {
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      syncVideo();
      rafId = null;
    });
  }
}, { passive: true });
```

This ensures exactly **one sync per frame** — matching the browser's repaint cycle.

---

## Pausing the Video

A crucial detail: the video must be **paused**. If it plays freely while you also set `currentTime`, you get a race condition. Always:

```javascript
if (!video.paused) video.pause();
video.currentTime = targetTime;
```

## Preloading for Zero-Stutter Scrubbing

For smooth scrubbing, the **entire video must be buffered**. Set:

```html
<video preload="auto" ...>
```

And wait for `canplaythrough` before enabling scroll sync. Attempting to scrub an unbuffered video results in visible seek latency.

---

## Snap Navigation

To complement the scroll-sync, I added a **snap engine** — wheel events are intercepted and the page is snapped to predefined scroll positions using an ease-out-quart curve:

```javascript
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
```

Fast start, smooth landing. Feels premium.

---

## YouTube Embed Demo

Here's a great reference on scroll-driven animation from Google Chrome Developers:

::youtube[oDcb3fvtETs]

---

## Performance Notes

- Use `will-change: transform` on animated elements to promote them to GPU layers
- Avoid setting `video.currentTime` if the delta is < 16ms (one frame)
- Keep video codec as **H.264 + AAC** for broadest hardware decode support
- Test on mobile — seek latency is noticeably higher on slower CPUs

---

The result is a buttery-smooth parallax video experience with zero library overhead. The entire engine is under 100 lines of vanilla JS.
