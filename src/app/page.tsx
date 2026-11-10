'use client';

import { useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowDownRight, ArrowUpRight, Search, Sparkles, Compass, ChevronDown } from 'lucide-react';

type Pin = { id: string; title: string; description: string | null; image_url: string; affiliate_url: string; category: string; price: string | null; published: boolean };
const categories = ['Everything', 'Home & Living', 'Style', 'Tech', 'Beauty', 'Everyday'];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Home() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [active, setActive] = useState('Everything');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) { setLoading(false); return; }
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    supabase.from('pins').select('id,title,description,image_url,affiliate_url,category,price,published')
      .eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => { setPins(data || []); setLoading(false); });
  }, []);

  const visible = useMemo(() => pins.filter((pin) =>
    (active === 'Everything' || pin.category === active) &&
    [pin.title, pin.description || '', pin.category].join(' ').toLowerCase().includes(query.toLowerCase())
  ), [pins, active, query]);

  const trackClick = (id: string) => {
    if (!supabaseUrl || !supabaseKey) return;
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    void supabase.rpc('record_pin_click', { pin_id: id });
  };

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
          <label className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a little something..."/><kbd>⌕</kbd></label>
        </div>
        <div className="results-line"><span>{loading ? 'FINDING THE GOOD STUFF…' : `${visible.length} FINDS TO EXPLORE`}</span><button onClick={() => {setActive('Everything');setQuery('')}}>Clear filters <ChevronDown size={13}/></button></div>
        {loading ? <div className="empty-state">Gathering the good finds…</div> : <div className="pin-grid">{visible.map(pin => <article className="pin-card" key={pin.id}>
          <a href={pin.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => trackClick(pin.id)} className="pin-image" aria-label={`Shop ${pin.title}`}>
            <img src={pin.image_url} alt={pin.title} loading="lazy"/><span className="pin-tag">{pin.category}</span><span className="pin-arrow"><ArrowUpRight size={19}/></span>
          </a>
          <div className="pin-meta"><span>{pin.category}</span><span>{pin.price || ''}</span></div>
          <h3>{pin.title}</h3><p>{pin.description}</p>
          <a className="shop-link" href={pin.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={() => trackClick(pin.id)}>DISCOVER THIS FIND <ArrowUpRight size={14}/></a>
        </article>)}</div>}
        {!loading && visible.length === 0 && <div className="empty-state"><Compass size={30}/><h3>{pins.length ? 'No finds just yet.' : 'The collection is taking shape.'}</h3><p>{pins.length ? 'Try another search or explore a different category.' : 'Come back soon for thoughtful finds and little discoveries.'}</p></div>}
        <div className="disclosure">A NOTE ON LINKS <span>Some links may be affiliate links. If you shop through them, we may earn a small commission at no extra cost to you. We only share things we genuinely like.</span></div>
      </section>
      <section className="manifesto" id="about"><div className="manifesto-mark">✳</div><div className="eyebrow">A SMALL THING WE BELIEVE</div><h2>Less scrolling.<br/><em>More finding.</em></h2><p>The internet is full of everything. We’re here for the things that make you stop, smile, and say “that’s exactly what I was looking for.”</p><a href="#discover">See what we’ve found <ArrowUpRight size={15}/></a></section>
      <footer id="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">m<span>·</span></span><span>my picks<small>THE GOOD-FIND EDIT</small></span></a><span>GOOD FINDS. GOOD FEELING. © {new Date().getFullYear()} MY PICKS.</span><div><a href="mailto:hello@mypicks.example">Say hello</a><a href="/admin">Admin</a></div></footer>
    </main>
  );
}
