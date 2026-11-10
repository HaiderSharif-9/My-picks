'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, ImagePlus, LogOut, Plus, Trash2, Pencil, X, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

type Pin = { id: string; title: string; description: string | null; image_url: string; affiliate_url: string; category: string; price: string | null; published: boolean; click_count: number };
type PinForm = { title: string; description: string; image_url: string; affiliate_url: string; category: string; price: string };
const emptyForm: PinForm = { title: '', description: '', image_url: '', affiliate_url: '', category: 'Home & Living', price: '' };
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AdminPage() {
  const [client] = useState(() => supabaseUrl && supabaseKey ? createBrowserClient(supabaseUrl, supabaseKey) : null);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [user, setUser] = useState<string | null>(null); const [pins, setPins] = useState<Pin[]>([]);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<PinForm>(emptyForm); const [editingId, setEditingId] = useState<string | null>(null);

  async function loadPins() {
    if (!client) return;
    const { data, error } = await client.from('pins').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message); else setPins(data || []);
  }
  async function verifyAdmin() {
    if (!client) return false;
    const { data: auth } = await client.auth.getUser();
    if (!auth.user) return false;
    const { data: profile } = await client.from('profiles').select('role').eq('id', auth.user.id).maybeSingle();
    if (profile?.role !== 'admin') { await client.auth.signOut(); setError('This account is not authorised to access the admin studio.'); return false; }
    setUser(auth.user.email || 'Admin'); await loadPins(); return true;
  }
  useEffect(() => { if (client) void verifyAdmin(); }, [client]);

  async function signIn(e: FormEvent) {
    e.preventDefault(); if (!client) return; setBusy(true); setError('');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) setError(error.message); else await verifyAdmin();
    setBusy(false);
  }
  async function savePin(e: FormEvent) {
    e.preventDefault(); if (!client) return; setBusy(true); setError('');
    const payload = { ...form, published: true };
    const result = editingId
      ? await client.from('pins').update(payload).eq('id', editingId)
      : await client.from('pins').insert(payload);
    if (result.error) setError(result.error.message);
    else { setForm(emptyForm); setEditingId(null); await loadPins(); }
    setBusy(false);
  }
  function startEdit(pin: Pin) {
    setEditingId(pin.id);
    setForm({ title: pin.title, description: pin.description || '', image_url: pin.image_url, affiliate_url: pin.affiliate_url, category: pin.category, price: pin.price || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function removePin(id: string) {
    if (!client || !confirm('Delete this pick permanently?')) return;
    const { error } = await client.from('pins').delete().eq('id', id);
    if (error) setError(error.message); else await loadPins();
  }
  async function signOut() { if (client) await client.auth.signOut(); setUser(null); setPins([]); setEditingId(null); setForm(emptyForm); }

  if (!client) return <main className="admin-shell"><div className="admin-panel"><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to My Picks</Link><h1>Almost there.</h1><p>Add your Supabase project URL and anon key to the environment variables to activate the admin panel.</p><code>NEXT_PUBLIC_SUPABASE_URL</code><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></div></main>;

  return <main className="admin-shell">
    <div className="admin-top"><Link href="/" className="brand"><span className="brand-mark">m<span>·</span></span><span>my picks<small>ADMIN STUDIO</small></span></Link>{user && <button onClick={signOut} className="signout"><LogOut size={15}/> Sign out</button>}</div>
    {!user ? <form className="admin-panel login-panel" onSubmit={signIn}>
      <Link href="/" className="back-link"><ArrowLeft size={15}/> Back to the website</Link><div className="admin-kicker">PRIVATE ACCESS · ADMIN ONLY</div><h1>Welcome<br/><em>back.</em></h1><p>Sign in to add and manage your picks.</p>
      <label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)}/></label>
      <label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)}/></label>
      {error && <div className="admin-error">{error}</div>}<button className="admin-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to studio'}</button>
      <small>Accounts are created privately by the site owner. Public registration is disabled.</small>
    </form> : <div className="admin-content">
      <div className="admin-heading"><div className="admin-kicker">YOUR LITTLE CORNER OF THE INTERNET</div><h1>Pick something <em>good.</em></h1><p>Manage the finds your visitors will discover.</p></div>
      <div className="admin-columns">
        <form className="pin-form" onSubmit={savePin}>
          <h2>{editingId ? <Pencil size={18}/> : <Plus size={18}/>} {editingId ? 'Edit this pick' : 'Add a new pick'}</h2>
          <label>Product title<input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="The little lamp that changes a room"/></label>
          <label>Short description<textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="What makes this one worth sharing?"/></label>
          <label>Image URL<input required type="url" value={form.image_url} onChange={e => setForm({...form, image_url:e.target.value})} placeholder="https://…"/></label>
          <label>Affiliate URL<input required type="url" value={form.affiliate_url} onChange={e => setForm({...form, affiliate_url:e.target.value})} placeholder="https://…"/></label>
          <div className="admin-form-row"><label>Category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{['Home & Living','Style','Tech','Beauty','Everyday'].map(c => <option key={c}>{c}</option>)}</select></label><label>Price<input value={form.price} onChange={e => setForm({...form, price:e.target.value})} placeholder="$49"/></label></div>
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-submit" disabled={busy}><ImagePlus size={16}/>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Publish pick'}</button>
          {editingId && <button type="button" className="signout" onClick={() => {setEditingId(null);setForm(emptyForm);}}> <X size={14}/> Cancel editing</button>}
        </form>
        <section className="admin-list">
          <div className="list-heading"><h2>Your picks</h2><span>{pins.length} TOTAL</span></div>
          {pins.length === 0 ? <p className="no-pins">Your collection is waiting for its first find.</p> : pins.map(pin => <article className="admin-pin" key={pin.id}>
            <img src={pin.image_url} alt=""/><div className="admin-pin-info"><b>{pin.title}</b><small>{pin.category} · {pin.price || 'No price'}</small><small className="click-total"><MousePointerClick size={12}/> {pin.click_count || 0} clicks</small></div>
            <button onClick={() => startEdit(pin)} aria-label="Edit pick"><Pencil size={15}/></button><button onClick={() => removePin(pin.id)} aria-label="Delete pick"><Trash2 size={16}/></button>
          </article>)}
        </section>
      </div>
    </div>}
  </main>;
}
