'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Bookmark, ChevronDown, Compass, Search, Sparkles, Star } from 'lucide-react';

const categories = ['Everything', 'Home & Living', 'Style', 'Tech', 'Beauty', 'Everyday'];
const picks = [
  { id: 1, title: 'The little lamp that changes a room', category: 'Home & Living', price: '$48', tag: 'A softer glow', image: 'photo-150 different', tone: 'warm', description: 'A warm, sculptural glow for slow evenings and quiet corners.', url: 'https://example.com' },
  { id: 2, title: 'Everyday carry, reimagined', category: 'Tech', price: '$89', tag: 'Worth a look', image: 'photo-1523275335684-37898b6baf30', tone: 'cool', description: 'Thoughtful design meets the things you reach for every day.', url: 'https://example.com' },
  { id: 3, title: 'A bag made for everywhere', category: 'Style', price: '$64', tag: 'Editor’s pick', image: 'photo-1548036328-c9fa89d128fa', tone: 'rose', description: 'An easy everyday shape with just the right amount of detail.', url: 'https://example.com' },
  { id: 4, title: 'Small rituals, better mornings', category: 'Beauty', price: '$32', tag: 'Daily favourite', image: 'photo-1608248543803-ba4f8c70ae0b', tone: 'sage', description: 'A little reset for the start of your day.', url: 'https://example.com' },
  { id: 5, title: 'Make space for good ideas', category: 'Everyday', price: '$22', tag: 'Simple things', image: 'photo-149 paper', tone: 'paper', description: 'Beautifully simple pieces for a more considered desk.', url: 'https://example.com' },
  { id: 6, title: 'The chair you’ll never tire of', category: 'Home & Living', price: '$210', tag: 'Design find', image: 'photo-1505693416388-ac5ce068fe85', tone: 'sand', description: 'Clean lines, natural textures and timeless comfort.', url: 'https://example.com' },
  { id: 7, title: 'A little colour, a lot of joy', category: 'Style', price: '$55', tag: 'New discovery', image: 'photo-1529139574466-a303027c1d8b', tone: 'pink', description: 'An effortless finishing touch for everyday outfits.', url: 'https://example.com' },
  { id: 8, title: 'Soundtrack your own kind of day', category: 'Tech', price: '$119', tag: 'Good sound', image: 'photo-1505740420928-5e560c06d30e', tone: 'blue', description: 'A thoughtful upgrade for the playlists you love.', url: 'https://example.com' },
];
const photo = (id: string) => id.startsWith('photo-') ? `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85` : 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85';

export default function Home() {
  const [active, setActive] = useState('Everything');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => picks.filter(p => (active === 'Everything' || p.category === active) && (p.title + p.description + p.category).toLowerCase().includes(query.toLowerCase())), [active, query]);
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#20251f]">
      <div className="announcement">A little inspiration for the things you love <span>✳</span> Thoughtfully picked, always.</div>
      <header className="site-header">
        <a className="brand" href="#"><span className="brand-mark">m<span>·</span></span><span>my picks<small>THE GOOD-FIND EDIT</small></span></a>
        <nav className="desktop-nav"><a href="#discover">Discover</a><a href="#about">Our point of view</a><a href="#footer">Get in touch</a></nav>
        <a className="header-cta" href="#discover">Find your next favourite <ArrowUpRight size={15}/></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> THE ART OF FINDING GOOD THINGS</div>
          <h1>Good things.<br/><em>Found.</em> For you.</h1>
          <p>A considered collection of things worth knowing about. Useful finds, thoughtful details and little discoveries from around the world.</p>
          <a href="#discover" className="hero-button">Explore the picks <ArrowDownRight size={17}/></a>
          <div className="hero-note"><span className="note-stars">★★★★★</span><span>Curated with curiosity, shared with you.</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-image-main"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=90" alt="Warm, thoughtfully styled living space"/></div>
          <div className="hero-image-small"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=500&q=85" alt="Minimal design details"/></div>
          <div className="floating-note"><span>✳</span><div><b>A good eye</b><small>for the little things</small></div></div>
          <div className="image-index">01 <i/> 08</div>
        </div>
        <div className="hero-side-label">COLLECT MOMENTS · DISCOVER OBJECTS · LIVE WELL</div>
      </section>

      <section className="ticker"><span>THE GOOD-FIND EDIT</span><b>✳</b><span>THINGS THAT MAKE YOU LOOK TWICE</span><b>✳</b><span>CURIOUSLY COLLECTED</span><b>✳</b><span>THE GOOD-FIND EDIT</span></section>

      <section className="discover-section" id="discover">
        <div className="section-heading"><div><div className="eyebrow">A FEW THINGS WE LOVE</div><h2>Find something <em>good.</em></h2></div><p>Not more stuff. Just the stuff<br/>that feels right.</p></div>
        <div className="toolbar">
          <div className="category-list">{categories.map(c => <button key={c} onClick={() => setActive(c)} className={active === c ? 'category active' : 'category'}>{c}</button>)}</div>
          <label className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a little something..." /><kbd>⌕</kbd></label>
        </div>
        <div className="results-line"><span>{visible.length} FINDS TO EXPLORE</span><button onClick={() => {setActive('Everything');setQuery('')}}>Clear filters <ChevronDown size={13}/></button></div>
        <div className="pin-grid">{visible.map((p, i) => <article className="pin-card" key={p.id}>
          <a href={p.url} target="_blank" rel="sponsored nofollow noopener noreferrer" className={`pin-image ${p.tone}`} aria-label={`Shop ${p.title}`}>
            <img src={photo(p.image)} alt={p.title} loading="lazy"/>
            <span className="pin-tag">{p.tag}</span><span className="pin-arrow"><ArrowUpRight size={19}/></span>
          </a>
          <div className="pin-meta"><span>{p.category}</span><span>{p.price}</span></div>
          <h3>{p.title}</h3><p>{p.description}</p>
          <a className="shop-link" href={p.url} target="_blank" rel="sponsored nofollow noopener noreferrer">DISCOVER THIS FIND <ArrowUpRight size={14}/></a>
        </article>)}</div>
        {visible.length === 0 && <div className="empty-state"><Compass size={30}/><h3>No finds just yet.</h3><p>Try another search or explore a different category.</p></div>}
        <div className="disclosure">A NOTE ON LINKS <span>Some links may be affiliate links. If you shop through them, we may earn a small commission at no extra cost to you. We only share things we genuinely like.</span></div>
      </section>

      <section className="manifesto" id="about"><div className="manifesto-mark">✳</div><div className="eyebrow">A SMALL THING WE BELIEVE</div><h2>Less scrolling.<br/><em>More finding.</em></h2><p>The internet is full of everything. We’re here for the things that make you stop, smile, and say “that’s exactly what I was looking for.”</p><a href="#discover">See what we’ve found <ArrowUpRight size={15}/></a></section>
      <footer id="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">m<span>·</span></span><span>my picks<small>THE GOOD-FIND EDIT</small></span></a><span>GOOD FINDS. GOOD FEELING. © {new Date().getFullYear()} MY PICKS.</span><div><a href="mailto:hello@mypicks.example">Say hello</a><a href="/admin">Admin</a></div></footer>
    </main>
  );
}
