import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  Outlet,
  useParams,
} from 'react-router-dom'
import { collections, findEntry } from './lib/content'

const HEADLINE = 'richard is aeio'
const SECTIONS = Object.keys(collections) // ['writings', 'songs']

function useTypewriter(text, speed = 85) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setOut('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return { out, done }
}

// Persistent shell: masthead + nav type once, outlet swaps per route.
function Layout() {
  const { out, done } = useTypewriter(HEADLINE)
  return (
    <main className="page">
      <header className="masthead">
        <h1 className="headline">
          {out}
          <span className={`caret ${done ? 'blink' : ''}`} aria-hidden="true" />
        </h1>
        <p className="dateline">
          {/* richard. broadcasting. {new Date().getFullYear()}. */}
          and aeio is writing things
        </p>

        <nav className={`nav ${done ? 'in' : ''}`} aria-label="sections">
          {SECTIONS.map((s) => (
            <NavLink
              key={s}
              to={`/${s}`}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {s}
            </NavLink>
          ))}
        </nav>
      </header>

      <hr className="rule" />

      <section className="stage">
        <Outlet />
      </section>

      <footer className="colophon">
        <span>scratch! scribble! jot!</span>
      </footer>
    </main>
  )
}

// Flat list of entries in a section — the index.
function IndexPage() {
  const { section } = useParams()
  const items = collections[section]
  if (!items) return <Navigate to={`/${SECTIONS[0]}`} replace />

  return (
    <ul className="index" key={section}>
      {items.map((item) => (
        <li key={item.slug}>
          <Link className="entry-head" to={`/${section}/${item.slug}`}>
            <span className="dot" aria-hidden="true">
              &gt;
            </span>
            <span className="title">{item.title}</span>
            <span className="dots" aria-hidden="true" />
            <span className="year">
              {item.date ? item.date.slice(0, 4) : ''}
            </span>
          </Link>
        </li>
      ))}
      {items.length === 0 && (
        <li className="empty">(drop a .md file in src/content/{section}/)</li>
      )}
    </ul>
  )
}

// A single entry on its own page.
function EntryPage() {
  const { section, slug } = useParams()
  const item = findEntry(section, slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [section, slug])

  if (!collections[section]) return <Navigate to={`/${SECTIONS[0]}`} replace />
  if (!item) return <Navigate to={`/${section}`} replace />

  return (
    <article className="entry" key={slug}>
      <Link className="back" to={`/${section}`}>
        &larr; {section}
      </Link>

      <h2 className="entry-title">{item.title}</h2>
      {item.date && <p className="entry-date">{item.date}</p>}

      {item.audio && (
        <audio className="player" controls preload="none" src={item.audio} />
      )}

      {item.html ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: item.html }} />
      ) : (
        !item.audio && <p className="prose muted">(nothing here yet.)</p>
      )}
    </article>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to={`/${SECTIONS[0]}`} replace />} />
        <Route path=":section" element={<IndexPage />} />
        <Route path=":section/:slug" element={<EntryPage />} />
      </Route>
    </Routes>
  )
}
