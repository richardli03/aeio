# content

Everything on the site is a markdown file in here. No code changes, no
registry — drop a file, it appears. Newest `date` sorts to the top.

```
src/content/
  writings/   <- each .md is a writing
  songs/      <- each .md is a song (markdown blurb + an optional wav)
public/media/ <- drop .wav / images here, reference by /media/<name>
```

## schema (frontmatter)

```markdown
---
title: the thing's name       # required
date: 2026-11-15              # YYYY-MM-DD, controls order (newest first)
audio: /media/song.wav        # songs only, optional. path under public/
---

body markdown here.

for a writing: this is the writing.
for a song: this is the blurb (leave it empty if you don't want one).

images: ![caption](/media/figure.svg)
```

## adding things

- **new writing:** create `writings/my-title.md` with `title` + `date`, write.
- **new song:** create `songs/my-song.md`, set `audio: /media/my-song.wav`,
  drop the wav in `public/media/`, optionally write a blurb below the `---`.
- **image in a writing:** put it in `public/media/`, embed with markdown.

filename becomes the slug. that's it.
