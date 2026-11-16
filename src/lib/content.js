import { marked } from 'marked'

// ---------------------------------------------------------------------------
// Content loader.
//
// Drop a .md file in  src/content/writings/  or  src/content/songs/  and it
// shows up automatically — no imports, no registry, no code change.
//
// Frontmatter schema (all optional except title):
//
//   ---
//   title: the thing's name          # required
//   date: 2026-11-15                 # YYYY-MM-DD, used for ordering
//   audio: /media/song.wav           # songs only — path under public/
//   ---
//   body markdown here (becomes the blurb / the writing itself)
//
// Media (wav, images) lives in  public/media/  and is referenced by url:
//   audio:  set `audio: /media/foo.wav` in frontmatter
//   images: use normal markdown in the body -> ![caption](/media/foo.svg)
// ---------------------------------------------------------------------------

marked.setOptions({ breaks: false, gfm: true })

// Base path the site is served from: '/' in dev, '/<repo>/' on GitHub Pages
// (injected at build via `vite build --base`). Media is authored as
// /media/... — rewrite it to sit under the base so it resolves either way.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // '' or '/<repo>'

function withBase(url) {
  return url && url.startsWith('/') ? BASE + url : url
}

function rewriteMedia(html) {
  return html.replace(/(src|href)="\/media\//g, `$1="${BASE}/media/`)
}

// Eagerly pull every markdown file as raw text at build/dev time.
const writingRaw = import.meta.glob('../content/writings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const songRaw = import.meta.glob('../content/songs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Tiny flat-YAML frontmatter parser. Handles `key: value`, strips quotes.
// Deliberately small — the schema is flat, so no need for a YAML dep.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!m) continue
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    meta[m[1]] = val
  }
  return { meta, body: match[2] }
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function build(rawMap) {
  return Object.entries(rawMap)
    .map(([path, raw]) => {
      const { meta, body } = parseFrontmatter(raw)
      const trimmed = body.trim()
      return {
        slug: slugFromPath(path),
        title: meta.title || slugFromPath(path),
        date: meta.date || '',
        audio: withBase(meta.audio || ''),
        hasBody: trimmed.length > 0,
        html: trimmed ? rewriteMedia(marked.parse(trimmed)) : '',
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)) // newest first
}

export const writings = build(writingRaw)
export const songs = build(songRaw)

// Keyed access for routing. Add a collection here + a glob above to grow.
export const collections = { writings, songs }

export function findEntry(section, slug) {
  return (collections[section] || []).find((e) => e.slug === slug) || null
}
