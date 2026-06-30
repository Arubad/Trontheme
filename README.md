# ARUSH BADHE // PORTFOLIO

> A Tron Legacy–inspired personal portfolio website built with Next.js 14.

---

## Features

- **Scroll-synced experience** — a full-page video background (`tron_scroll.mp4`) synced to scroll position via a custom snap-scroll engine
- **Sections**: Hobbies · Education · Skills · Archives · Logs · Uplink (contact)
- **Live skill stats** — real-time API integrations pulling stats from GitHub, LeetCode, Codeforces, Kaggle, NeetCode, and Striver
- **Markdown blog** (`/logs`) — file-based posts rendered with a custom Tron-styled markdown renderer
- **Contact form** — email delivery via Nodemailer (SMTP)
- **Tron aesthetic** — Orbitron + Share Tech Mono fonts, cyan glow effects, dark grid UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Fonts | Google Fonts — Orbitron, Share Tech Mono |
| Email | Nodemailer |
| Markdown | gray-matter + react-markdown |
| Deployment | Vercel |

---

## Project Structure

```
app/
├── page.js                  # Entry point → renders TronScroll
├── layout.js                # Root layout (fonts, metadata)
├── globals.css              # Global styles
└── api/
    ├── contact/             # POST /api/contact — sends email via SMTP
    ├── logs/
    │   └── [slug]/          # GET /api/logs/[slug] — returns parsed markdown post
    └── skills/              # Live stat endpoints (GitHub, LeetCode, etc.)

components/
└── TronScroll.js            # Core scroll engine + all section renderers

contents/                    # Markdown blog posts (.md files)
public/                      # Static assets (images, tron_scroll.mp4)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Gmail account with [App Passwords](https://myaccount.google.com/apppasswords) enabled (for the contact form)

### Installation

```bash
git clone https://github.com/Arubad/Trontheme.git
cd Trontheme
npm install
```

### Environment Variables

Copy the example file and fill in your SMTP credentials:

```bash
cp .env.local.example .env.local
```

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_TO=your-gmail@gmail.com
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Writing Blog Posts

Add `.md` files to the `contents/` directory. Use standard frontmatter:

```md
---
title: My Post Title
date: 2026-04-14
---

Post content here...
```

Posts are served at `/logs/[slug]` where slug is the filename without `.md`.

---

## Deployment

The project includes a `vercel.json` and is ready to deploy on [Vercel](https://vercel.com). Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.
