'use client'
import { useRef, useState, useEffect, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'hobbies', start: 0.08, end: 0.2, code: '01', label: 'HOBBIES' },
  { id: 'education', start: 0.25, end: 0.37, code: '02', label: 'EDUCATION' },
  { id: 'skills', start: 0.42, end: 0.54, code: '03', label: 'SKILLS' },
  { id: 'archives', start: 0.59, end: 0.7, code: '04', label: 'ARCHIVES' },
  { id: 'logs', start: 0.74, end: 0.84, code: '05', label: 'LOGS' },
  // {
  //   id: 'testimonials',
  //   start: 0.87,
  //   end: 0.93,
  //   code: '06',
  //   label: 'TESTIMONIALS',
  // },
  { id: 'uplink', start: 0.95, end: 1.0, code: '07', label: 'UPLINK' },
]

const SNAP_POINTS = [0, 0.12, 0.29, 0.46, 0.63, 0.78, 0.97]
const TOTAL_HEIGHT = '1200vh'
const SECTION_FADE = 0.025

// ═══════════════════════════════════════════════════════════════
// CUSTOM TRON SCROLLBAR COMPONENT
function TronScrollBar({ targetRef }) {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const maxScroll = scrollWidth - clientWidth
      const pct = maxScroll > 0 ? scrollLeft / maxScroll : 0

      const thumbWidth = 40
      const trackWidth = clientWidth
      const maxTranslate = Math.max(0, trackWidth - thumbWidth)
      
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${pct * maxTranslate}px)`
      }

      setIsScrolling(true)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    el.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    
    const t = setTimeout(update, 100)

    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(t)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [targetRef])

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    const container = targetRef.current
    if (!track || !thumb || !container) return

    const handleDrag = (clientX) => {
      const trackRect = track.getBoundingClientRect()
      const thumbWidth = 40
      const availableWidth = trackRect.width - thumbWidth
      if (availableWidth <= 0) return

      let relativeX = clientX - trackRect.left - thumbWidth / 2
      relativeX = Math.max(0, Math.min(relativeX, availableWidth))
      
      const pct = relativeX / availableWidth
      const maxScroll = container.scrollWidth - container.clientWidth
      container.scrollLeft = pct * maxScroll
    }

    const onMouseDown = (e) => {
      isDraggingRef.current = true
      document.body.classList.add('is-dragging-scrollbar')
      handleDrag(e.clientX)
      e.preventDefault()
    }

    const onTouchStart = (e) => {
      isDraggingRef.current = true
      document.body.classList.add('is-dragging-scrollbar')
      handleDrag(e.touches[0].clientX)
    }

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return
      handleDrag(e.clientX)
    }

    const onTouchMove = (e) => {
      if (!isDraggingRef.current) return
      if (e.cancelable) e.preventDefault()
      handleDrag(e.touches[0].clientX)
    }

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        document.body.classList.remove('is-dragging-scrollbar')
      }
    }

    track.addEventListener('mousedown', onMouseDown)
    track.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onMouseUp)

    return () => {
      track.removeEventListener('mousedown', onMouseDown)
      track.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [targetRef])

  return (
    <div className={`tron-custom-scrollbar ${isScrolling ? 'is-scrolling' : ''}`}>
      <div ref={trackRef} className="tron-scrollbar-track">
        <div ref={thumbRef} className="tron-scrollbar-thumb">
          <svg
            className="tron-bike-svg"
            width="40"
            height="18"
            viewBox="0 0 40 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 13 L15 13"
              stroke="var(--tron-cyan)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="tron-bike-trail"
            />
            <path
              d="M12 14 C12 14 15 6 22 5 C29 4 33 10 35 12 L38 13 L35 15 C33 15 14 15 12 14 Z"
              fill="#000"
              stroke="var(--tron-cyan)"
              strokeWidth="1.5"
              className="tron-bike-body"
            />
            <path
              d="M22 5 C24 5 28 6 30 9 L24 9 Z"
              fill="var(--tron-cyan)"
              opacity="0.6"
            />
            <circle
              cx="15"
              cy="13"
              r="4"
              fill="#000"
              stroke="var(--tron-cyan)"
              strokeWidth="1.8"
              className="tron-bike-wheel tron-bike-wheel-back"
            />
            <circle
              cx="34"
              cy="13"
              r="4"
              fill="#000"
              stroke="var(--tron-cyan)"
              strokeWidth="1.8"
              className="tron-bike-wheel tron-bike-wheel-front"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}


function lerp(a, b, t) {
  return a + (b - a) * t
}
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

function getSectionOpacity(p, section) {
  const F = SECTION_FADE
  const { start, end } = section
  if (p < start - F || p > end + F) return 0
  if (p >= start && p <= end) return 1
  if (p < start) return Math.min(1, (p - (start - F)) / F)
  return Math.max(0, 1 - (p - end) / F)
}

// ═══════════════════════════════════════════════════════════════
// TRON MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════

function processInlineText(text, keyBase) {
  if (!text) return null
  const parts = []
  const regex =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|\[(.+?)\]\((.+?)\)|!\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match
  let k = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${keyBase}-t${k++}`}>
          {text.slice(lastIndex, match.index)}
        </span>,
      )
    }
    if (match[2]) {
      parts.push(
        <strong key={`${keyBase}-${k++}`} className="md-bold">
          <em>{match[2]}</em>
        </strong>,
      )
    } else if (match[3]) {
      parts.push(
        <strong key={`${keyBase}-${k++}`} className="md-bold">
          {match[3]}
        </strong>,
      )
    } else if (match[4] || match[5]) {
      parts.push(
        <em key={`${keyBase}-${k++}`} className="md-italic">
          {match[4] || match[5]}
        </em>,
      )
    } else if (match[8]) {
      // image: ![alt](src)
      parts.push(
        <img
          key={`${keyBase}-${k++}`}
          src={match[9]}
          alt={match[8]}
          className="md-img"
        />,
      )
    } else if (match[6]) {
      // link: [text](href)
      parts.push(
        <a
          key={`${keyBase}-${k++}`}
          href={match[7]}
          target="_blank"
          rel="noreferrer"
          className="md-link"
        >
          {match[6]}
        </a>,
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(<span key={`${keyBase}-t${k++}`}>{text.slice(lastIndex)}</span>)
  }
  return parts.length ? parts : text
}

function inlineMarkdown(text, keyBase = 'il') {
  const segments = text.split(/(`[^`]+`)/)
  return segments.map((seg, i) => {
    if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
      return (
        <code key={i} className="md-code">
          {seg.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{processInlineText(seg, `${keyBase}-${i}`)}</span>
  })
}

function TronMarkdown({ content }) {
  if (!content) return null
  const lines = content.split('\n')
  const out = []
  let codeLines = []
  let codeLang = ''
  let inCode = false
  let listBuf = []
  let listType = null // 'ul' | 'ol'

  const flushList = () => {
    if (!listBuf.length) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    out.push(
      <Tag key={`list-${out.length}`} className={`md-${listType}`}>
        {listBuf}
      </Tag>,
    )
    listBuf = []
    listType = null
  }

  lines.forEach((line, idx) => {
    // Code fence
    if (line.startsWith('```')) {
      if (inCode) {
        out.push(
          <div key={idx} className="md-code-block">
            <div className="md-code-block-lang">{codeLang || 'CODE'}</div>
            <pre>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>,
        )
        codeLines = []
        inCode = false
        codeLang = ''
      } else {
        flushList()
        inCode = true
        codeLang = line.slice(3).trim().toUpperCase()
      }
      return
    }
    if (inCode) {
      codeLines.push(line)
      return
    }

    // YouTube embed
    const ytMatch = line.match(/^::youtube\[([A-Za-z0-9_-]+)\]/)
    if (ytMatch) {
      flushList()
      out.push(
        <div key={idx} className="md-youtube">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
            title="YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>,
      )
      return
    }

    // Headings
    if (line.startsWith('#### ')) {
      flushList()
      out.push(
        <h4 key={idx} className="md-h4">
          {inlineMarkdown(line.slice(5), idx)}
        </h4>,
      )
      return
    }
    if (line.startsWith('### ')) {
      flushList()
      out.push(
        <h3 key={idx} className="md-h3">
          {inlineMarkdown(line.slice(4), idx)}
        </h3>,
      )
      return
    }
    if (line.startsWith('## ')) {
      flushList()
      out.push(
        <h2 key={idx} className="md-h2">
          {inlineMarkdown(line.slice(3), idx)}
        </h2>,
      )
      return
    }
    if (line.startsWith('# ')) {
      flushList()
      out.push(
        <h1 key={idx} className="md-h1">
          {inlineMarkdown(line.slice(2), idx)}
        </h1>,
      )
      return
    }

    // Horizontal rule
    if (/^[-*]{3,}$/.test(line.trim())) {
      flushList()
      out.push(<hr key={idx} className="md-hr" />)
      return
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList()
      out.push(
        <blockquote key={idx} className="md-blockquote">
          {inlineMarkdown(line.slice(2), idx)}
        </blockquote>,
      )
      return
    }

    // Table row
    if (line.startsWith('|')) {
      flushList()
      const cells = line
        .split('|')
        .filter(Boolean)
        .map((c) => c.trim())
      if (cells.every((c) => /^[-:]+$/.test(c))) return // separator row
      out.push(
        <div key={idx} className="md-table-row">
          {cells.map((c, ci) => (
            <span key={ci} className="md-table-cell">
              {inlineMarkdown(c, `${idx}-${ci}`)}
            </span>
          ))}
        </div>,
      )
      return
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listBuf.push(
        <li key={idx} className="md-li">
          {inlineMarkdown(line.slice(2), idx)}
        </li>,
      )
      return
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\. /)
    if (olMatch) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listBuf.push(
        <li key={idx} className="md-li">
          {inlineMarkdown(line.slice(olMatch[0].length), idx)}
        </li>,
      )
      return
    }

    flushList()

    // Empty line
    if (!line.trim()) {
      out.push(<div key={idx} className="md-spacer" />)
      return
    }

    // Paragraph
    out.push(
      <p key={idx} className="md-p">
        {inlineMarkdown(line, idx)}
      </p>,
    )
  })

  flushList()
  return <div className="tron-markdown">{out}</div>
}

// ═══════════════════════════════════════════════════════════════
// SECTION 01: HOBBIES & ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════

function HobbiesSection() {
  const hobbiesRef = useRef(null)
  const tiles = [
    {
      id: 'iitm-foundation',
      type: 'image',
      title: 'IITM BS DATA SCIENCE FOUNDATION',
      tag: 'ACHIEVEMENT',
      imageSrc: '/cert.png',
      imageAlt: 'IITM BS Data Science Foundation Certificate',
      note: 'Completed the Foundation Program in Mathematics, Statistics, Computational Thinking, and Python.',
    },
    {
      id: 'school-olympics',
      type: 'youtube',
      title: 'SCHOOL OLYMPICS CHAMPION BOY',
      tag: 'ACHIEVEMENT',
      youtubeId: 'QtUKaFm8_gY',
      youtubeStart: 1,
      note: 'Prestigious award given to the outstanding performer in School Olympics.',
    },
    {
      id: 'gedit-lead',
      type: 'text',
      title: 'AI/ML & DATA SCIENCE LEAD',
      tag: 'ACHIEVEMENT',
      icon: '🧠',
      content:
        'Led the Gedit Coding Club with mentorship, workshops, and project-based learning in AI, ML, and data science.',
    },
    {
      id: 'mprakash',
      type: 'text',
      title: 'M-PRAKASH INSTITUTE',
      tag: 'ACHIEVEMENT',
      icon: '📚',
      imageSrc: '/MPI.jpg',
      content:
        'Completed highly selective and rigorous IIT-JEE focused competitive coaching.',
    },
    {
      id: 'social-welfare',
      type: 'image',
      title: 'SOCIAL WELFARE ACHIEVEMENT',
      tag: 'ACHIEVEMENT',
      imageSrc: '/portfoliopic.png',
      imageAlt: 'Social welfare achievement certificate',
      note: 'Recognized for contribution to social welfare activities.',
    },
    {
      id: 'gsc-2025',
      type: 'image',
      title: 'GOOGLE SOLUTIONS CHALLENGE 2025',
      tag: 'ACHIEVEMENT',
      imageSrc: '/img.jpg',
      imageAlt: 'Google Solutions Challenge 2025 Participation',
      note: 'Participated with a social-impact focused project.',
    },
    {
      id: 'swimming',
      type: 'youtube',
      title: 'SWIMMING',
      tag: 'HOBBY',
      youtubeId: 'naA0TolwnbQ',
      note: '',
    },
    {
      id: 'badminton',
      type: 'youtube',
      title: 'BADMINTON',
      tag: 'HOBBY',
      youtubeId: 'J-cZYIokw_c',
      note: '',
    },
  ]

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">SYS.PROFILE // 01</span>
        <h2 className="tron-title">
          HOBBIES &amp;
          <br />
          <span className="tron-accent">ACHIEVEMENTS</span>
        </h2>
        <p className="tron-subtitle">PERSONAL.DIRECTIVES // LOADED</p>
      </div>
      <div className="hobbies-grid section-scrollable" ref={hobbiesRef}>
        {tiles.map((tile) => {
          const hasYoutube = tile.type === 'youtube' && !!tile.youtubeId
          const youtubeSrc = hasYoutube
            ? `https://www.youtube-nocookie.com/embed/${tile.youtubeId}${
                tile.youtubeStart ? `?start=${tile.youtubeStart}` : ''
              }`
            : null

          return (
            <div
              key={tile.id}
              className={`hobby-tile hobby-tile--${tile.type}`}
            >
              <div className="hobby-tile-tag">{tile.tag}</div>
              <div className="hobby-tile-title">{tile.title}</div>
              {tile.note && <p className="hobby-tile-note">{tile.note}</p>}
              {tile.type === 'youtube' && (
                <div className="hobby-tile-yt">
                  {hasYoutube ? (
                    <iframe
                      src={youtubeSrc}
                      title={tile.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="hobby-tile-media-placeholder">
                      YOUTUBE_LINK_PENDING
                    </div>
                  )}
                </div>
              )}
              {tile.type === 'image' && (
                <div className="hobby-tile-yt">
                  {tile.imageSrc ? (
                    <img
                      src={tile.imageSrc}
                      alt={tile.imageAlt || tile.title}
                      className="hobby-tile-image"
                    />
                  ) : (
                    <div className="hobby-tile-media-placeholder">
                      CERTIFICATE_IMAGE_PENDING
                    </div>
                  )}
                </div>
              )}
              {tile.type === 'stat' && (
                <div className="hobby-tile-stats">
                  {tile.stats.map((s) => (
                    <div key={s.label} className="hobby-stat">
                      <span className="hobby-stat-val">{s.value}</span>
                      <span className="hobby-stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {tile.type === 'text' && (
                <div className="hobby-tile-body">
                  <div className="hobby-tile-icon">{tile.icon}</div>
                  <p className="hobby-tile-content">{tile.content}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <TronScrollBar targetRef={hobbiesRef} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 02: EDUCATION PROTOCOL (animated flowchart)
// ═══════════════════════════════════════════════════════════════

function EducationSection() {
  const eduRef = useRef(null)
  const nodes = [
    {
      code: 'EDU.01',
      label: 'School',
      degree: 'Class X — Millenium National School CBSE Board',
      period: '2011 — 2020',
      note: 'Foundation: Mathematics · Science · Computing',
      done: true,
    },
    {
      code: 'EDU.02',
      label: 'HIGHER SECONDARY',
      degree: 'M-Prakash Institute',
      period: '2021 — 2023',
      note: 'Physics · Chemistry · Mathematics · CS',
      done: true,
    },
    {
      code: 'EDU.03',
      label: 'UNDERGRADUATE',
      degree: 'B.Tech — Information Technology @ VIT pune',
      period: '2023 — 2027',
      note: 'DSA · OS · DBMS · Networks · ML · Systems',
      done: true,
    },
    {
      code: 'EDU.04',
      label: 'Diploma',
      degree: 'Data Science - IITM',
      period: '2024 — PRESENT',
      note: 'Research · Advanced AI · Systems Design',
      done: false,
    },
  ]

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">KNOWLEDGE.PROTOCOL // 02</span>
        <h2 className="tron-title">
          EDUCATION
          <br />
          <span className="tron-accent">FLOWCHART</span>
        </h2>
        <p className="tron-subtitle">ACQUISITION.PATH // TRACED</p>
      </div>

      <div className="edu-flowchart section-scrollable" ref={eduRef}>
        {nodes.map((node, i) => (
          <div key={node.code} className="edu-node-wrapper">
            <div
              className={`edu-node ${node.done ? 'edu-node--done' : 'edu-node--active'}`}
            >
              <div className="edu-node-left">
                <div className="edu-node-dot">
                  <span>{node.done ? '✓' : '◎'}</span>
                </div>
                <div className="edu-node-code">{node.code}</div>
              </div>
              <div className="edu-node-body">
                <div className="edu-node-label">{node.label}</div>
                <div className="edu-node-degree">{node.degree}</div>
                <div className="edu-node-period">{node.period}</div>
                <div className="edu-node-note">{node.note}</div>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="edu-connector">
                <div className="edu-connector-track">
                  <div className="edu-connector-beam" />
                </div>
                <span className="edu-connector-arrow">▶</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <TronScrollBar targetRef={eduRef} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TRON PROFILE POPUP MODAL
// ═══════════════════════════════════════════════════════════════

function TronProfileModal({ profile, data, loading, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const el = modalRef.current
    const onWheel = (e) => {
      e.stopPropagation()
    }
    if (el) el.addEventListener('wheel', onWheel, { passive: false })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      if (el) el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const stats = data?.stats ?? []
  const isLive = data && !data.fallback && !data.error

  // ── Progress bar: Striver A2Z ──────────────────────────────────
  let progressPct = null
  let progressLabel = null
  if (profile.label === 'STRIVER A2Z') {
    const s = stats.find((x) => x.label === 'PROGRESS')
    if (s) {
      const n = parseFloat(s.value)
      if (!isNaN(n)) {
        progressPct = n
        progressLabel = `${s.value} COMPLETE`
      }
    }
  }

  // ── Progress bar: NeetCode 150 ─────────────────────────────────
  if (profile.label === 'NEETCODE 150') {
    const solved = stats.find((x) => x.label === 'SOLVED')
    const total = stats.find((x) => x.label === 'TOTAL')
    if (solved && total) {
      const s = parseFloat(solved.value),
        t = parseFloat(total.value)
      if (!isNaN(s) && !isNaN(t) && t > 0) {
        progressPct = Math.round((s / t) * 100)
        progressLabel = `${solved.value} / ${total.value} PROBLEMS`
      }
    }
  }

  // ── Difficulty bars: LeetCode ──────────────────────────────────
  let difficultyBars = null
  if (profile.label === 'LEETCODE') {
    const easy = stats.find((x) => x.label === 'EASY')
    const medium = stats.find((x) => x.label === 'MEDIUM')
    const hard = stats.find((x) => x.label === 'HARD')
    if (easy || medium || hard) {
      difficultyBars = [
        {
          label: 'EASY',
          value: parseFloat(easy?.value) || 0,
          max: 900,
          color: '#39ff8a',
        },
        {
          label: 'MEDIUM',
          value: parseFloat(medium?.value) || 0,
          max: 2000,
          color: '#ffcc00',
        },
        {
          label: 'HARD',
          value: parseFloat(hard?.value) || 0,
          max: 900,
          color: '#ff4422',
        },
      ]
    }
  }

  // ── Detailed widget: Striver A2Z ────────────────────────────────
  let striverWidget = null
  if (profile.label === 'STRIVER A2Z' && data?.summary) {
    const summary = data.summary
    const tracks = Array.isArray(data.tracks) ? data.tracks : []
    const milestones = Array.isArray(data.milestones) ? data.milestones : []
    const overallPct =
      summary.totalProblems > 0
        ? Math.round((summary.solvedProblems / summary.totalProblems) * 100)
        : 0
    const weeklyPct =
      summary.weeklyTarget > 0
        ? Math.round((summary.currentWeekSolved / summary.weeklyTarget) * 100)
        : 0

    striverWidget = {
      summary,
      tracks,
      milestones,
      overallPct,
      weeklyPct,
    }
  }

  // ── Detailed widget: NeetCode 150 ───────────────────────────────
  let neetcodeWidget = null
  if (profile.label === 'NEETCODE 150' && data?.summary) {
    const summary = data.summary
    const categories = Array.isArray(data.categories) ? data.categories : []
    const milestones = Array.isArray(data.milestones) ? data.milestones : []
    const overallPct =
      summary.totalProblems > 0
        ? Math.round((summary.solvedProblems / summary.totalProblems) * 100)
        : 0
    const weeklyPct =
      summary.weeklyTarget > 0
        ? Math.round((summary.currentWeekSolved / summary.weeklyTarget) * 100)
        : 0

    neetcodeWidget = {
      summary,
      categories,
      milestones,
      overallPct,
      weeklyPct,
    }
  }

  return (
    <div className="tron-popup-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="tron-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tron-popup-grid" />
        <div className="tron-popup-scanlines" />
        <div className="tron-popup-top-beam" />

        <div className="tron-popup-inner">
          {/* Header */}
          <div className="tron-popup-header">
            <div className="tron-popup-platform">
              <div className="tron-popup-icon">{profile.icon}</div>
              <div>
                <div className="tron-popup-name">{profile.label}</div>
                {data?.username && (
                  <div className="tron-popup-username">@{data.username}</div>
                )}
                <div className="tron-popup-badges">
                  {isLive && (
                    <span className="profile-widget-badge profile-widget-badge--live">
                      ● LIVE
                    </span>
                  )}
                  {data?.fallback && (
                    <span className="profile-widget-badge">STATIC</span>
                  )}
                </div>
              </div>
            </div>
            <button
              className="tron-popup-close"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <div className="tron-popup-loading">
              <div className="tron-popup-loader" />
              ACCESSING REMOTE NODE…
            </div>
          ) : data?.error ? (
            <div className="tron-popup-loading">
              ⚠ CONNECTION ERROR — NODE UNREACHABLE
            </div>
          ) : (
            <>
              {/* Stats grid */}
              {stats.length > 0 && (
                <div className="tron-popup-stats">
                  {stats.map((s) => (
                    <div key={s.label} className="tron-popup-stat-card">
                      <span className="tron-popup-stat-val">{s.value}</span>
                      <span className="tron-popup-stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Single progress bar (Striver / NeetCode) */}
              {progressPct !== null && (
                <div className="tron-popup-progress-section">
                  <div className="tron-popup-progress-label">
                    <span>COMPLETION PROGRESS</span>
                    <span>{progressLabel}</span>
                  </div>
                  <div className="tron-popup-progress-track">
                    <div
                      className="tron-popup-progress-fill"
                      style={{ '--fill-pct': `${Math.min(progressPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Detailed Striver A2Z progress widget */}
              {striverWidget && (
                <div className="tron-popup-progress-section striver-widget">
                  <div className="tron-popup-section-label">
                    A2Z PROGRESS INTEL
                  </div>

                  <div className="striver-widget-top">
                    <div className="striver-ring-wrap">
                      <div
                        className="striver-ring"
                        style={{
                          '--striver-ring': `${Math.min(striverWidget.overallPct, 100)}%`,
                        }}
                      >
                        <div className="striver-ring-inner">
                          <span className="striver-ring-value">
                            {striverWidget.overallPct}%
                          </span>
                          <span className="striver-ring-label">OVERALL</span>
                        </div>
                      </div>
                    </div>

                    <div className="striver-widget-meta">
                      <div className="striver-meta-card">
                        <span className="striver-meta-value">
                          {striverWidget.summary.solvedProblems}
                        </span>
                        <span className="striver-meta-label">SOLVED</span>
                      </div>
                      <div className="striver-meta-card">
                        <span className="striver-meta-value">
                          {striverWidget.summary.totalProblems}
                        </span>
                        <span className="striver-meta-label">TOTAL</span>
                      </div>
                      <div className="striver-meta-card">
                        <span className="striver-meta-value">
                          {striverWidget.summary.currentTrack}
                        </span>
                        <span className="striver-meta-label">
                          CURRENT TRACK
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="striver-track-focus">
                    <div className="tron-popup-progress-label">
                      <span>TRACK PROGRESS</span>
                      <span>{striverWidget.summary.currentTrackProgress}%</span>
                    </div>
                    <div className="tron-popup-progress-track">
                      <div
                        className="tron-popup-progress-fill"
                        style={{
                          '--fill-pct': `${Math.min(striverWidget.summary.currentTrackProgress, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="striver-track-focus"
                    style={{ marginTop: '0.65rem' }}
                  >
                    <div className="tron-popup-progress-label">
                      <span>WEEKLY TARGET</span>
                      <span>
                        {striverWidget.summary.currentWeekSolved} /{' '}
                        {striverWidget.summary.weeklyTarget}
                      </span>
                    </div>
                    <div className="tron-popup-progress-track">
                      <div
                        className="tron-popup-progress-fill"
                        style={{
                          '--fill-pct': `${Math.min(striverWidget.weeklyPct, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {striverWidget.tracks.length > 0 && (
                    <div className="striver-track-grid">
                      {striverWidget.tracks.map((track) => {
                        const pct =
                          track.total > 0
                            ? Math.round((track.solved / track.total) * 100)
                            : 0
                        return (
                          <div key={track.name} className="striver-track-card">
                            <div className="striver-track-head">
                              <span>{track.name}</span>
                              <span
                                className={`striver-track-state striver-track-state--${track.status}`}
                              >
                                {track.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="tron-popup-progress-label">
                              <span>
                                {track.solved} / {track.total}
                              </span>
                              <span>{pct}%</span>
                            </div>
                            <div className="tron-popup-progress-track">
                              <div
                                className="tron-popup-progress-fill"
                                style={{
                                  '--fill-pct': `${Math.min(pct, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {striverWidget.milestones.length > 0 && (
                    <div className="striver-milestones">
                      {striverWidget.milestones.map((m) => (
                        <div key={m.label} className="striver-milestone-row">
                          <span className="striver-milestone-label">
                            {m.label}
                          </span>
                          <span className="striver-milestone-value">
                            {m.value}
                          </span>
                          <span className="striver-milestone-eta">{m.eta}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Detailed NeetCode 150 progress widget */}
              {neetcodeWidget && (
                <div className="tron-popup-progress-section neetcode-widget">
                  <div className="tron-popup-section-label">
                    NEETCODE MASTERY INTEL
                  </div>

                  <div className="neetcode-widget-top">
                    <div className="neetcode-ring-wrap">
                      <div
                        className="neetcode-ring"
                        style={{
                          '--neetcode-ring': `${Math.min(neetcodeWidget.overallPct, 100)}%`,
                        }}
                      >
                        <div className="neetcode-ring-inner">
                          <span className="neetcode-ring-value">
                            {neetcodeWidget.overallPct}%
                          </span>
                          <span className="neetcode-ring-label">MASTERED</span>
                        </div>
                      </div>
                    </div>

                    <div className="neetcode-widget-meta">
                      <div className="neetcode-meta-card">
                        <span className="neetcode-meta-value">
                          {neetcodeWidget.summary.solvedProblems}
                        </span>
                        <span className="neetcode-meta-label">SOLVED</span>
                      </div>
                      <div className="neetcode-meta-card">
                        <span className="neetcode-meta-value">
                          {neetcodeWidget.summary.revisionQueue}
                        </span>
                        <span className="neetcode-meta-label">
                          REVISION QUEUE
                        </span>
                      </div>
                      <div className="neetcode-meta-card">
                        <span className="neetcode-meta-value">
                          {neetcodeWidget.summary.strongestArea}
                        </span>
                        <span className="neetcode-meta-label">
                          STRONGEST AREA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="neetcode-focus">
                    <div className="tron-popup-progress-label">
                      <span>WEEKLY TARGET</span>
                      <span>
                        {neetcodeWidget.summary.currentWeekSolved} /{' '}
                        {neetcodeWidget.summary.weeklyTarget}
                      </span>
                    </div>
                    <div className="tron-popup-progress-track">
                      <div
                        className="tron-popup-progress-fill"
                        style={{
                          '--fill-pct': `${Math.min(neetcodeWidget.weeklyPct, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="neetcode-focus"
                    style={{ marginTop: '0.65rem' }}
                  >
                    <div className="tron-popup-progress-label">
                      <span>STRONGEST TRACK</span>
                      <span>
                        {neetcodeWidget.summary.strongestAreaProgress}%
                      </span>
                    </div>
                    <div className="tron-popup-progress-track">
                      <div
                        className="tron-popup-progress-fill"
                        style={{
                          '--fill-pct': `${Math.min(neetcodeWidget.summary.strongestAreaProgress, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {neetcodeWidget.categories.length > 0 && (
                    <div className="neetcode-category-grid">
                      {neetcodeWidget.categories.map((cat) => {
                        const pct =
                          cat.total > 0
                            ? Math.round((cat.solved / cat.total) * 100)
                            : 0
                        return (
                          <div
                            key={cat.name}
                            className="neetcode-category-card"
                          >
                            <div className="neetcode-category-head">
                              <span>{cat.name}</span>
                              <span
                                className={`neetcode-category-state neetcode-category-state--${cat.status}`}
                              >
                                {cat.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="tron-popup-progress-label">
                              <span>
                                {cat.solved} / {cat.total}
                              </span>
                              <span>{pct}%</span>
                            </div>
                            <div className="tron-popup-progress-track">
                              <div
                                className="tron-popup-progress-fill"
                                style={{
                                  '--fill-pct': `${Math.min(pct, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {neetcodeWidget.milestones.length > 0 && (
                    <div className="neetcode-milestones">
                      {neetcodeWidget.milestones.map((m) => (
                        <div key={m.label} className="neetcode-milestone-row">
                          <span className="neetcode-milestone-label">
                            {m.label}
                          </span>
                          <span className="neetcode-milestone-value">
                            {m.value}
                          </span>
                          <span className="neetcode-milestone-eta">
                            {m.eta}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LeetCode difficulty bars */}
              {difficultyBars && (
                <div className="tron-popup-progress-section">
                  <div className="tron-popup-section-label">
                    DIFFICULTY BREAKDOWN
                  </div>
                  {difficultyBars.map((bar) => (
                    <div key={bar.label} style={{ marginBottom: '0.5rem' }}>
                      <div className="tron-popup-progress-label">
                        <span>{bar.label}</span>
                        <span>{bar.value}</span>
                      </div>
                      <div className="tron-popup-progress-track">
                        <div
                          className="tron-popup-progress-fill"
                          style={{
                            '--fill-pct': `${Math.min((bar.value / bar.max) * 100, 100)}%`,
                            background: `linear-gradient(90deg, ${bar.color}66, ${bar.color})`,
                            boxShadow: `0 0 8px ${bar.color}88`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* GitHub top repos */}
              {data?.topRepos?.length > 0 && (
                <div className="tron-popup-repos">
                  <div className="tron-popup-section-label">
                    TOP REPOSITORIES
                  </div>
                  {data.topRepos.map((r) => (
                    <div key={r.name} className="tron-popup-repo-row">
                      <span className="tron-popup-repo-name">▸ {r.name}</span>
                      <div className="tron-popup-repo-meta">
                        <span className="tron-popup-repo-lang">{r.lang}</span>
                        <span>★ {r.stars}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Note / description */}
              {(data?.note || data?.desc || profile.desc) && (
                <div className="tron-popup-note">
                  {data?.note || data?.desc || profile.desc}
                </div>
              )}

              {/* Footer */}
              <div className="tron-popup-footer">
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer"
                  className="tron-popup-link"
                >
                  VIEW PROFILE →
                </a>
                <span className="tron-popup-system-id">
                  SYS.NODE // {profile.label.replace(/\s+/g, '.')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 03: SKILLS (block-based + profile widgets)
// ═══════════════════════════════════════════════════════════════

function SkillsSection() {
  const [openModal, setOpenModal] = useState(null)
  const [widgetCache, setWidgetCache] = useState({})
  const [loadingKey, setLoadingKey] = useState(null)

  const skillCategories = [
    {
      name: 'LANGUAGES',
      skills: ['Python', 'C++', 'C', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      name: 'FRONTEND',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML5 / CSS3'],
    },
    {
      name: 'BACKEND',
      skills: ['Node.js', 'FastAPI', 'Express', 'REST APIs', 'GraphQL'],
    },
    {
      name: 'ML / DATA',
      skills: [
        'TensorFlow',
        'PyTorch',
        'Scikit-learn',
        'Pandas',
        'NumPy',
        'OpenCV',
      ],
    },
    {
      name: 'TOOLS',
      skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Firebase', 'Postman'],
    },
  ]

  const profiles = [
    {
      label: 'GITHUB',
      href: 'https://github.com/Arubad',
      icon: '⟨/⟩',
      api: '/api/skills/github',
      desc: 'Open source projects, personal tools & contributions',
    },
    {
      label: 'LEETCODE',
      href: 'https://leetcode.com/u/YXdB8UMU0q/',
      icon: '◈',
      api: '/api/skills/leetcode',
      desc: 'Consistent across Easy, Medium & Hard categories',
    },
    {
      label: 'CODEFORCES',
      href: 'https://codeforces.com/profile/arushbadhe',
      icon: '⚡',
      api: '/api/skills/codeforces',
      desc: 'Competitive programming, rated contests',
    },
    {
      label: 'KAGGLE',
      href: 'https://www.kaggle.com/arushbadhe',
      icon: '⊕',
      api: '/api/skills/kaggle',
      desc: 'Data science notebooks, competitions & datasets',
    },
    {
      label: 'STRIVER A2Z',
      href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      icon: '▸▸',
      api: '/api/skills/striver',
      desc: 'Structured DSA: Arrays → Graphs → DP → Advanced',
    },
    {
      label: 'NEETCODE 150',
      href: 'https://neetcode.io/practice',
      icon: '✦',
      api: '/api/skills/neetcode',
      desc: 'Curated FAANG interview prep problem set',
    },
  ]

  const fetchProfile = async (key, apiPath) => {
    if (key !== 'GITHUB' && widgetCache[key]) return
    setLoadingKey(key)
    try {
      const res = await fetch(`${apiPath}${key === 'GITHUB' ? '?v=2' : ''}`, {
        cache: 'no-store',
      })
      const data = await res.json()
      setWidgetCache((prev) => ({ ...prev, [key]: data }))
    } catch {
      setWidgetCache((prev) => ({ ...prev, [key]: { error: true } }))
    } finally {
      setLoadingKey(null)
    }
  }

  const handleOpen = (p) => {
    setOpenModal(p.label)
    fetchProfile(p.label, p.api)
  }
  const handleClose = useCallback(() => setOpenModal(null), [])

  const activeProfile = profiles.find((p) => p.label === openModal)

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">CAPABILITY.INDEX // 03</span>
        <h2 className="tron-title">
          SKILL
          <br />
          <span className="tron-accent">MATRIX</span>
        </h2>
        <p className="tron-subtitle">TECH.STACK // VERIFIED</p>
      </div>

      <div className="skills-layout">
        <div className="skills-categories section-scrollable">
          {skillCategories.map((cat) => (
            <div key={cat.name} className="skill-category">
              <div className="skill-category-name">{cat.name}</div>
              <div className="skill-blocks">
                {cat.skills.map((s) => (
                  <span key={s} className="skill-block">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="skills-profiles">
          <div className="skills-profiles-label">EXTERNAL.PROFILES</div>
          <div className="skills-profile-grid">
            {profiles.map((p) => (
              <div key={p.label} className="profile-btn-wrapper">
                <button
                  type="button"
                  className="profile-btn"
                  onClick={() => handleOpen(p)}
                >
                  <span className="profile-btn-icon">{p.icon}</span>
                  <span className="profile-btn-label">{p.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openModal && activeProfile && (
        <TronProfileModal
          profile={activeProfile}
          data={widgetCache[openModal]}
          loading={loadingKey === openModal}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 04: ARCHIVES (unchanged)
// ═══════════════════════════════════════════════════════════════

function ArchivesSection() {
  const archivesRef = useRef(null)
  const projects = [
    {
      title: 'PROJECT.ALPHA',
      tech: 'React · Node · MongoDB',
      desc: 'Full-stack web platform with real-time sync, JWT auth, and responsive dashboard.',
      href: '#',
    },
    {
      title: 'NEURAL.PIPE',
      tech: 'Python · TensorFlow · FastAPI',
      desc: 'End-to-end ML pipeline for image classification with REST deployment on cloud.',
      href: '#',
    },
    {
      title: 'DSA.TRACKER',
      tech: 'React · Firebase · Tailwind',
      desc: 'LeetCode + Codeforces progress tracker with A2Z sheet integration and analytics.',
      href: '#',
    },
    {
      title: 'CIPHER.CLI',
      tech: 'Go · Redis · Docker',
      desc: 'High-performance cryptography CLI tool with Redis caching and container deploy.',
      href: '#',
    },
  ]

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">PROGRAM.ARCHIVE // 04</span>
        <h2 className="tron-title">ARCHIVES</h2>
        <p className="tron-subtitle">PROJECT.DATABASE // ACCESS_GRANTED</p>
      </div>
      <div className="archives-grid section-scrollable" ref={archivesRef}>
        {projects.map((p) => (
          <div key={p.title} className="archive-card">
            <div className="archive-card-top">
              <span className="archive-code">▸</span>
              <span className="archive-title">{p.title}</span>
            </div>
            <p className="archive-desc">{p.desc}</p>
            <div className="archive-tech">{p.tech}</div>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="archive-btn"
            >
              ACCESS →
            </a>
          </div>
        ))}
      </div>
      <TronScrollBar targetRef={archivesRef} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 05: LOGS (CMS — reads from /contents/*.md)
// ═══════════════════════════════════════════════════════════════

function LogsSection() {
  const [logs, setLogs] = useState([])
  const [selected, setSelected] = useState(null)
  const [logContent, setLogContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)
  const wrapRef = useRef(null)
  const modalRef = useRef(null)


  // Lock body scroll and isolate modal wheel events when modal is open
  useEffect(() => {
    if (!selected) return
    // Lock body scroll
    document.body.style.overflow = 'hidden'

    const el = modalRef.current
    if (!el) return
    const onWheel = (e) => {
      e.stopPropagation() // always stop — modal handles its own scroll via CSS
    }
    el.addEventListener('wheel', onWheel, { passive: false })

    // Close on Escape
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    fetch('/api/logs')
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const openLog = async (slug) => {
    setSelected(slug)
    setContentLoading(true)
    try {
      const res = await fetch(`/api/logs/${slug}`)
      const data = await res.json()
      setLogContent(data)
    } catch {
      setLogContent(null)
    }
    setContentLoading(false)
  }

  const closeModal = () => {
    setSelected(null)
    setLogContent(null)
  }

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">SYSTEM.LOGS // 05</span>
        <h2 className="tron-title">LOGS</h2>
        <p className="tron-subtitle">CMS.DRIVEN // MARKDOWN_PARSED</p>
      </div>

      {/* Log list — always visible in section */}
      <div className="logs-cms-wrap section-scrollable" ref={wrapRef}>
        {loading && <div className="logs-status">LOADING.LOGS...</div>}
        {!loading && (
          <div className="logs-list-cms">
            {logs.map((log) => (
              <div
                key={log.slug}
                className="log-entry-cms"
                onClick={() => openLog(log.slug)}
              >
                <div className="log-entry-left">
                  <span className="log-date">{log.date}</span>
                  <div className="log-tags">
                    {(log.tags || []).map((t) => (
                      <span key={t} className="log-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="log-entry-right">
                  <p className="log-title">{log.title}</p>
                  <span className="log-read-btn">READ_LOG →</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="logs-status">
                NO_LOGS_FOUND // Drop .md files into contents/
              </div>
            )}
          </div>
        )}
      </div>
      <TronScrollBar targetRef={wrapRef} />

      {/* Modal overlay — renders outside section flow, fixed to viewport */}
      {selected && (
        <div className="log-modal-backdrop" onClick={closeModal}>
          <div
            className="log-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header bar */}
            <div className="log-modal-topbar">
              <span className="log-modal-label">
                SYSTEM.LOG // READING_MODE
              </span>
              <button className="log-modal-close" onClick={closeModal}>
                ✕ CLOSE
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="log-modal-body">
              {contentLoading && (
                <div className="logs-status">PARSING.TRANSMISSION...</div>
              )}
              {logContent && !contentLoading && (
                <>
                  <div className="log-detail-header">
                    <span className="tron-code">{logContent.date}</span>
                    <h2 className="log-detail-title">{logContent.title}</h2>
                    <div className="log-tags" style={{ marginTop: '0.4rem' }}>
                      {(logContent.tags || []).map((t) => (
                        <span key={t} className="log-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="log-detail-body">
                    <TronMarkdown content={logContent.content} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 06: TESTIMONIALS
// ═══════════════════════════════════════════════════════════════

function TestimonialsSection() {
  const testimonials = [
    {
      text: "Arush is one of the most technically sharp engineers I've worked with. His ability to bridge ML research and production systems is rare.",
      name: 'DR. RAMESH SHARMA',
      role: 'PROFESSOR',
      org: 'IIT // DEPT. OF CS',
    },
    {
      text: 'Outstanding problem-solver and communicator. Delivered our project ahead of schedule with exceptional code quality and clear documentation.',
      name: 'PRIYA NAIR',
      role: 'ENGINEERING LEAD',
      org: 'TECHCORP // BANGALORE',
    },
    {
      text: 'His competitive programming mindset translates directly to elegant, efficient solutions. A genuine asset to any engineering team.',
      name: 'VIKRAM PATEL',
      role: 'SENIOR SDE',
      org: 'AMAZON // INDIA',
    },
  ]

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">SIGNAL.FEEDBACK // 06</span>
        <h2 className="tron-title">
          TESTI<span className="tron-accent">MONIALS</span>
        </h2>
        <p className="tron-subtitle">PEER.ASSESSMENT // VERIFIED</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-quote">❝</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-name">{t.name}</div>
              <div className="testimonial-role">{t.role}</div>
              <div className="testimonial-org">{t.org}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 07: UPLINK (contact form with SMTP)
// ═══════════════════════════════════════════════════════════════

function UplinkSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="tron-section-content">
      <div className="tron-header">
        <span className="tron-code">TRANSMISSION.NODE // 07</span>
        <h2 className="tron-title">
          UP<span className="tron-accent">LINK</span>
        </h2>
        <p className="tron-subtitle">OPEN_CHANNEL // SECURE_TRANSMISSION</p>
      </div>

      <div className="uplink-layout">
        <div className="uplink-form-panel">
          {status === 'sent' ? (
            <div className="uplink-success">
              <div className="uplink-success-icon">✓</div>
              <div className="uplink-success-title">TRANSMISSION_SENT</div>
              <p>Signal received. Response within 24 cycles.</p>
              <button
                className="uplink-reset-btn"
                onClick={() => setStatus(null)}
              >
                SEND_ANOTHER →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="uplink-form">
              <div className="uplink-row">
                <div className="uplink-field">
                  <label className="uplink-label">IDENTIFIER</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="uplink-input"
                  />
                </div>
                <div className="uplink-field">
                  <label className="uplink-label">RELAY.ADDRESS</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="uplink-input"
                  />
                </div>
              </div>
              <div className="uplink-field">
                <label className="uplink-label">SUBJECT.LINE</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Transmission Subject"
                  className="uplink-input"
                />
              </div>
              <div className="uplink-field">
                <label className="uplink-label">MESSAGE.BODY</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Enter your message..."
                  rows={4}
                  className="uplink-textarea"
                />
              </div>
              {status === 'error' && (
                <div className="uplink-error">
                  TRANSMISSION_FAILED // Verify SMTP config in .env.local
                </div>
              )}
              <button
                type="submit"
                className="uplink-submit-btn"
                disabled={status === 'sending'}
              >
                <span>
                  {status === 'sending'
                    ? 'TRANSMITTING...'
                    : 'INITIATE TRANSMISSION'}
                </span>
                <span className="uplink-btn-arrow">→</span>
              </button>
            </form>
          )}
        </div>

        <div className="uplink-info-panel">
          {[
            { label: 'PROTOCOL', value: 'SMTP // TLS', active: false },
            { label: 'RESPONSE', value: '≤ 24 CYCLES', active: false },
            { label: 'STATUS', value: 'NODE_ACTIVE', active: true },
          ].map((item) => (
            <div key={item.label} className="uplink-info-row">
              <span className="uplink-info-label">{item.label}</span>
              <span
                className={
                  item.active ? 'tron-status-active' : 'uplink-info-value'
                }
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════════

function TronCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }
    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.14)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.14)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="tron-cursor-dot" />
      <div ref={ringRef} className="tron-cursor-ring" />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN SCROLL EXPERIENCE
// ═══════════════════════════════════════════════════════════════

const SectionComponent = {
  hobbies: HobbiesSection,
  education: EducationSection,
  skills: SkillsSection,
  archives: ArchivesSection,
  logs: LogsSection,
  // testimonials: TestimonialsSection,
  uplink: UplinkSection,
}

export default function TronScroll() {
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const hudTimeRef = useRef(null)
  const lastProgressRef = useRef(-1)
  const videoReadyFiredRef = useRef(false)
  const videoUnlockedRef = useRef(false)
  const isSeekingRef = useRef(false)
  const pendingSeekRef = useRef(null)
  const isSnappingRef = useRef(false)
  const snapRafRef = useRef(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const [progress, setProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Scroll → video sync
  const syncVideo = useCallback(() => {
    const scrollY = window.scrollY ?? document.documentElement.scrollTop ?? 0
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight
    const p =
      totalScroll > 0 ? Math.min(1, Math.max(0, scrollY / totalScroll)) : 0
    if (p !== lastProgressRef.current) {
      lastProgressRef.current = p
      setProgress(p)
    }

    const video = videoRef.current
    if (!video || !videoReady) {
      rafRef.current = null
      return
    }
    const dur = video.duration
    if (!dur || !isFinite(dur)) {
      rafRef.current = null
      return
    }
    const targetTime = p * dur

    // Mobile unlock: play→pause to enable arbitrary seeking (required on iOS/Android)
    if (!videoUnlockedRef.current) {
      videoUnlockedRef.current = true
      video
        .play()
        .then(() => {
          video.pause()
          video.currentTime = targetTime
        })
        .catch(() => {})
      rafRef.current = null
      return
    }

    if (!video.paused) video.pause()
    if (Math.abs(video.currentTime - targetTime) > 0.033) {
      if (isSeekingRef.current) {
        // A seek is already in flight — store the latest target and apply it once the current seek finishes
        pendingSeekRef.current = targetTime
      } else {
        isSeekingRef.current = true
        video.currentTime = targetTime
      }
    }
    if (hudTimeRef.current)
      hudTimeRef.current.textContent = `T+${targetTime.toFixed(2)}s`
    rafRef.current = null
  }, [videoReady])

  useEffect(() => {
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(syncVideo)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    syncVideo()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [syncVideo])

  // Snap engine
  const snapToProgress = useCallback((targetP) => {
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight
    const targetY = targetP * totalScroll
    const startY = window.scrollY
    const dist = targetY - startY
    if (Math.abs(dist) < 4) {
      isSnappingRef.current = false
      return
    }
    const duration = Math.max(
      550,
      Math.min(1100, 550 + (Math.abs(dist) / totalScroll) * 900),
    )
    const t0 = performance.now()
    isSnappingRef.current = true
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current)
    const tick = (now) => {
      const raw = Math.min(1, (now - t0) / duration)
      const eased = easeOutQuart(raw)
      window.scrollTo(0, startY + dist * eased)
      if (raw < 1) {
        snapRafRef.current = requestAnimationFrame(tick)
      } else {
        window.scrollTo(0, targetY)
        isSnappingRef.current = false
        snapRafRef.current = null
      }
    }
    snapRafRef.current = requestAnimationFrame(tick)
  }, [])

  // Wheel + touch interceptors — respect scrollable section content
  useEffect(() => {
    const getNextSnap = (dir) => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const currentP = totalScroll > 0 ? window.scrollY / totalScroll : 0
      const threshold = 0.005
      if (dir > 0) {
        return (
          SNAP_POINTS.find((p) => p > currentP + threshold) ??
          SNAP_POINTS[SNAP_POINTS.length - 1]
        )
      }
      const prev = SNAP_POINTS.filter((p) => p < currentP - threshold)
      return prev.length ? prev[prev.length - 1] : SNAP_POINTS[0]
    }

    const onWheel = (e) => {
      // If the wheel target is inside a scrollable section panel, let it scroll naturally
      const scrollable = e.target.closest('.section-scrollable')
      if (scrollable) {
        const isHorizontal =
          scrollable.classList.contains('hobbies-grid') ||
          scrollable.classList.contains('edu-flowchart') ||
          scrollable.classList.contains('archives-grid') ||
          scrollable.classList.contains('logs-cms-wrap')

        if (isHorizontal) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollable
          const canScrollRight =
            e.deltaY > 0 && scrollLeft + clientWidth < scrollWidth - 4
          const canScrollLeft = e.deltaY < 0 && scrollLeft > 4
          if (canScrollRight || canScrollLeft) {
            scrollable.scrollLeft += e.deltaY
            e.preventDefault()
            return
          }
        } else {
          const { scrollTop, scrollHeight, clientHeight } = scrollable
          const canScrollDown =
            e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 2
          const canScrollUp = e.deltaY < 0 && scrollTop > 0
          if (canScrollDown || canScrollUp) return // don't intercept — let native scroll the panel
        }
      }
      e.preventDefault()
      if (isSnappingRef.current) return
      snapToProgress(getNextSnap(e.deltaY >= 0 ? 1 : -1))
    }

    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (isSnappingRef.current) return

      const scrollable = e.target.closest('.section-scrollable')
      if (scrollable) {
        const isHorizontal =
          scrollable.classList.contains('hobbies-grid') ||
          scrollable.classList.contains('edu-flowchart') ||
          scrollable.classList.contains('archives-grid') ||
          scrollable.classList.contains('logs-cms-wrap')

        if (isHorizontal) {
          const dx = touchStartX.current - e.changedTouches[0].clientX
          const dy = touchStartY.current - e.changedTouches[0].clientY

          // If primarily horizontal swipe, let panel scroll horizontally
          if (Math.abs(dx) > Math.abs(dy)) {
            return
          }
        }
      }

      const dy = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(dy) < 20) return
      snapToProgress(getNextSnap(dy >= 0 ? 1 : -1))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current)
    }
  }, [snapToProgress])

  // Seek completion handler — apply any pending seek that arrived while one was in flight
  const handleSeeked = useCallback(() => {
    if (pendingSeekRef.current !== null) {
      const t = pendingSeekRef.current
      pendingSeekRef.current = null
      const video = videoRef.current
      if (video) video.currentTime = t
    } else {
      isSeekingRef.current = false
    }
  }, [])

  // Loading gates
  const handleVideoReady = useCallback(() => {
    if (videoReadyFiredRef.current) return
    videoReadyFiredRef.current = true
    setVideoReady(true)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2200)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    const t = setTimeout(() => {
      if (!videoReadyFiredRef.current) {
        videoReadyFiredRef.current = true
        setVideoReady(true)
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  // Derived values
  const activeSection = SECTIONS.find(
    (s) => progress >= s.start && progress <= s.end,
  )
  const showIntro = progress < 0.07
  const introOpacity = showIntro ? Math.max(0, 1 - progress / 0.07) : 0

  return (
    <>
      <TronCursor />

      {/* LOADING SCREEN */}
      <div
        className="tron-loading"
        style={{
          opacity: loaded ? 0 : 1,
          transition: 'opacity 0.7s ease',
          pointerEvents: loaded ? 'none' : 'all',
        }}
        aria-hidden={loaded}
      >
        <div
          style={{
            fontFamily: 'var(--font-orbitron, sans-serif)',
            fontSize: '0.9rem',
            letterSpacing: '0.4em',
            color: '#00c8ff',
            textShadow: '0 0 20px rgba(0,200,255,0.6)',
            marginBottom: '1.2rem',
          }}
        >
          ARUSH BADHE
        </div>
        <div className="tron-loading-bar">
          <div className="tron-loading-fill" />
        </div>
        <div className="tron-loading-text">
          Initializing the Grid Sequence...
        </div>
      </div>

      {/* SCROLL CONTAINER */}
      <div style={{ height: TOTAL_HEIGHT, position: 'relative' }}>
        {/* FIXED: VIDEO BACKGROUND */}
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}
        >
          {/* CSS fallback — always visible, ensures non-black background on mobile when video stalls */}
          <div className="tron-bg-fallback" />
          <video
            ref={videoRef}
            src="/tron_scroll.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onCanPlay={handleVideoReady}
            onCanPlayThrough={handleVideoReady}
            onLoadedData={handleVideoReady}
            onError={handleVideoReady}
            onSeeked={handleSeeked}
          />
          <div className="tron-dark-overlay" />
          <div className="tron-grid-overlay" />
          <div className="tron-scanlines" />
          <div className="tron-vignette" />
        </div>

        {/* FIXED: HUD LAYER */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div className="tron-hud-top">
            <span className="tron-hud-logo">ARUSH.BADHE</span>
            <div className="tron-hud-section-indicator">
              {activeSection
                ? `${activeSection.code} // ${activeSection.label}`
                : 'SYS // ONLINE'}
            </div>
            <span ref={hudTimeRef} className="tron-hud-time">
              T+0.00s
            </span>
          </div>

          <div className="tron-nav-dots" style={{ pointerEvents: 'auto' }}>
            {SECTIONS.map((s) => {
              const isActive = progress >= s.start && progress <= s.end
              return (
                <button
                  key={s.id}
                  className={`tron-nav-dot ${isActive ? 'active' : ''}`}
                  title={s.label}
                  onClick={() => snapToProgress(s.start + 0.04)}
                >
                  <span className="tron-nav-dot-label">{s.label}</span>
                  <span className="tron-nav-dot-circle" />
                </button>
              )
            })}
          </div>

          <div className="tron-progress-bar">
            <div
              className="tron-progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {showIntro && (
            <div className="tron-scroll-hint" style={{ opacity: introOpacity }}>
              <span>SCROLL TO NAVIGATE</span>
              <div className="tron-scroll-arrow" />
            </div>
          )}

          <div className="tron-corner tron-corner-tl" />
          <div className="tron-corner tron-corner-tr" />
          <div className="tron-corner tron-corner-bl" />
          <div className="tron-corner tron-corner-br" />
        </div>

        {/* FIXED: INTRO OVERLAY */}
        {loaded && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10,
              opacity: introOpacity,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="intro-text">
              <h1>
                ARUSH<span className="tron-accent"> BADHE</span>
              </h1>
              <p className="intro-bio">
                Aspiring AI/ML engineer passionate about transforming data into
                actionable insights.
                <br />I build smart, scalable systems using modern machine
                learning techniques
                <br />
                Actively seeking opportunities to grow through impactful
                internships.
              </p>
              <p className="intro-scroll-hint">SCROLL_TO_NAVIGATE</p>
            </div>
          </div>
        )}

        {/* FIXED: SECTION OVERLAYS */}
        {SECTIONS.map((section) => {
          const opacity = getSectionOpacity(progress, section)
          if (opacity === 0) return null
          const Comp = SectionComponent[section.id]
          return (
            <div
              key={section.id}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10,
                opacity,
                transition: 'opacity 0.3s ease',
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 'clamp(1.5rem, 6vw, 7rem)',
                paddingRight: 'clamp(1.5rem, 6vw, 7rem)',
              }}
            >
              <Comp />
            </div>
          )
        })}
      </div>
    </>
  )
}
