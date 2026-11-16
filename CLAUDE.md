# aeio

A personal website broadcasting that **richard is aeio**. A plain, typewriter-y
single page — spiritually close to billwurtz.com/songs.html, but quieter and
less camp. Paper and ink, a monospace face, a blinking caret, and a short list
of things to read or hear. No marketing gloss, no visual noise: "typed, not
designed."

## What it is

- **Stack:** React + Vite, `react-router-dom` for per-entry URLs.
- **Content is data, not code.** Every writing and song is a markdown file in
  `src/content/`. Drop a file in, it appears — no imports, no registry.
- **Two sections:** `writings` (markdown essays/notes) and `songs` (a markdown
  blurb plus an embedded audio file). A nav row under the masthead switches
  between them; `writings` is the default.
- **Hosting:** GitHub Pages at https://richardli03.github.io/aeio/ , built and
  published by `.github/workflows/deploy.yml` on every push to `main`.

## Layout

```
src/
  App.jsx            masthead, nav, routes (index + single-entry pages)
  main.jsx           router root (basename = Vite base)
  index.css          the whole typewriter look
  lib/content.js     globs the markdown, parses frontmatter, renders with marked
  content/
    writings/*.md    one file per writing
    songs/*.md       one file per song
public/media/        .wav/.mp3/images, referenced as /media/<name>
deploy.sh            commit + push to main (aliased `depaeio`)
```

## Adding content

Create a markdown file with frontmatter. Filename becomes the URL slug.

```markdown
---
title: the thing's name       # required
date: 2026-11-15              # YYYY-MM-DD, newest sorts first
audio: /media/song.mp3        # songs only, optional
---

body markdown — the writing itself, or the song's blurb (optional).
images: ![caption](/media/figure.svg)
```

Media lives in `public/media/` and is referenced by `/media/<name>`; the base
path is rewritten automatically for GitHub Pages, so always author it as
`/media/...`.

**Audio:** commit compressed audio (mp3/opus), never `.wav`. WAV is ~10x larger
for no web benefit and bloats git history permanently. Keep wav masters off-repo.

## Deploying

`depaeio ["message"]` (alias for `deploy.sh`) commits everything and pushes to
`main`; GitHub Actions does the build and publish. A bare `depaeio` uses a
timestamped default message. One-time setup: repo **Settings → Pages → Source =
GitHub Actions**.

## Conventions

### Commits — Conventional Commits

Every commit in this repo follows [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <summary>
```

- **Summary:** imperative mood, lowercase, no trailing period. Keep it short.
- **Types:** `feat` (new content or capability), `fix`, `docs`, `style`
  (formatting/CSS only, no behavior change), `refactor`, `chore` (deploys,
  deps, config), `build`, `ci`.
- **Scopes** (optional but encouraged): `content`, `writings`, `songs`, `ui`,
  `media`, `deploy`, `build`, `ci`, `deps`.
- **Breaking changes:** add `!` before the colon (`feat(ui)!: ...`) or a
  `BREAKING CHANGE:` footer.

Examples:

```
feat(songs): add "best of me"
feat(writings): add on-starting-something-new
fix(ui): keep nav active on entry pages
style(ui): tighten masthead spacing
docs: describe the content schema
chore(deploy): publish 2026-11-15
```

### Code

- Match the existing voice: lowercase UI text, monospace, restrained.
- Keep the content pipeline (markdown → frontmatter → render) untouched when
  adding features; new sections are a folder + one glob line in `content.js` +
  one entry in the `TABS`/`SECTIONS` list.
- Markdown is rendered with `dangerouslySetInnerHTML`. That's fine because the
  author (richard) writes all content. Do not render untrusted markdown without
  adding sanitization.
