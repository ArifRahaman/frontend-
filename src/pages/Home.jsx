import React, { useEffect, useState, useRef } from 'react';

// Lightweight single-file homepage that includes:
// - Hero + features (your original layout)
// - CreatePost box (optimistic post)
// - Feed (loads /api/posts, paginated)
// - PostCard (renders ***bold*** and ```code``` blocks)
// - Floating ChatWidget that hits /api/chat
// NOTE: adapt API URLs and auth (localStorage token) to your backend.

const API_BASE = import.meta.env.VITE_API_BASE || '';
function getToken() { return localStorage.getItem('token'); }

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts(nextCursor = null) {
    if (loading) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set('limit', '10');
      if (nextCursor) qs.set('cursor', nextCursor);
      const res = await fetch(`${API_BASE}/api/posts?${qs.toString()}`, {
        headers: { Authorization: getToken() ? `Bearer ${getToken()}` : undefined }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      // expect { items: [], nextCursor }
      setPosts(p => (nextCursor ? [...p, ...data.items] : data.items));
      setCursor(data.nextCursor || null);
      setHasMore(Boolean(data.nextCursor));
    } catch (e) {
      console.warn('loadPosts', e);
    } finally { setLoading(false); }
  }

  async function handlePosted(newPost) {
    // optimistic: prepend
    setPosts(p => [newPost, ...p]);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Build smarter with <span className="text-yellow-300">focused AI assistants</span></h1>
            <p className="mt-4 text-lg text-sky-100">Topic-aware chat for learning, interviews, and productivity. Switch topics, keep conversations, and get answers tailored to your domain.</p>
            <div className="mt-6 flex gap-3">
              <a href="/app" className="inline-block bg-white text-sky-700 px-5 py-3 rounded-lg font-semibold shadow">Try the app</a>
              <a href="#why" className="inline-block text-white px-4 py-3 rounded-lg border border-white/30">Why it works</a>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-sm text-gray-500 mb-3">Live demo</div>
              <div className="bg-slate-100 rounded-lg p-4">
                <div className="h-10 bg-gray-200 rounded mb-3" />
                <div className="h-40 bg-gray-50 rounded mb-3" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-sky-600 rounded text-white flex items-center justify-center">OS</div>
                  <div className="h-8 w-24 bg-sky-400 rounded text-white flex items-center justify-center">Coding</div>
                  <div className="h-8 w-24 bg-sky-300 rounded text-white flex items-center justify-center">Networks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: About / features */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-4 bg-white shadow-sm mb-6">
            <h4 className="font-medium">Who benefits</h4>
            <ol className="mt-3 text-slate-600 list-decimal list-inside space-y-2">
              <li>Students preparing for exams or campus interviews.</li>
              <li>Interview practice for technical roles.</li>
              <li>Developers seeking precise, domain-focused help.</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="font-semibold">Key features</h3>
            <ul className="text-slate-600 space-y-2">
              <li>• Topic Enforcement & per-topic history.</li>
              <li>• Public feed, comments, likes, follow.</li>
              <li>• Lightweight signup and TTS.</li>
            </ul>
          </div>
        </div>

        {/* CENTER: Feed */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <CreatePost onPosted={handlePosted} />
          </div>

          <div>
            {posts.length === 0 ? (
              <div className="p-8 bg-white rounded text-center text-slate-500">No posts yet — be the first!</div>
            ) : posts.map(p => (
              <PostCard key={p.id || p._id} post={p} onLike={async (id)=>{
                // optimistic like toggle
                setPosts(prev => prev.map(x => x.id===id?{...x, likesCount:(x.likesCount||0)+1}:x));
                try { await fetch(`${API_BASE}/api/posts/${id}/like`,{method:'POST', headers:{Authorization:getToken()?`Bearer ${getToken()}`:undefined}}); } catch(e){console.warn(e);}
              }} onComment={(id)=>{/* open comment UI (left as exercise) */}} />
            ))}

            {hasMore && (
              <div className="text-center mt-4">
                <button className="px-4 py-2 bg-white border rounded" onClick={()=>loadPosts(cursor)} disabled={loading}>{loading?'Loading...':'Load more'}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold">Ready to practice?</h3>
            <p className="mt-2 text-sky-100">Choose a topic and start a focused chat — perfect for interview prep and revision.</p>
          </div>
          <div>
            <a href="/app" className="px-5 py-3 bg-white text-sky-700 rounded-lg font-semibold">Start now</a>
          </div>
        </div>
      </section>

      <footer className="text-sm text-slate-600 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} FocusedChat. Built with care.</div>
          <div className="flex gap-4">
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </main>
  );
}


/* ---------------------- Subcomponents ---------------------- */

function CreatePost({ onPosted }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSending(true);
    const temp = {
      _id: `temp-${Date.now()}`,
      content: text,
      author: { username: 'You', avatarUrl: null },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
    };
    onPosted && onPosted(temp);

    try {
      const res = await fetch(`${API_BASE}/api/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: getToken() ? `Bearer ${getToken()}` : undefined }, body: JSON.stringify({ content: text }) });
      if (!res.ok) throw new Error('post failed');
      const real = await res.json();
      // replace temp with real
      // simple strategy: no-op (server will be retrieved on next load) or you can implement replace logic
    } catch (e) {
      console.warn(e);
      // ideally show error & remove optimistic post
    } finally {
      setText('');
      setSending(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded p-2" placeholder="Share something with the community... (use ***bold*** or ```code``` in posts)" />
      <div className="mt-2 flex justify-end gap-2">
        <button onClick={()=>setText('')} className="px-3 py-2 border rounded" disabled={!text.trim()}>Clear</button>
        <button onClick={submit} className="px-4 py-2 bg-sky-600 text-white rounded" disabled={!text.trim() || sending}>{sending ? 'Posting…' : 'Post'}</button>
      </div>
    </div>
  );
}

function PostCard({ post, onLike, onComment }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center gap-3 mb-2">
        <img src={post.author?.avatarUrl || '/avatar.png'} className="w-10 h-10 rounded-full" alt="" />
        <div>
          <div className="font-semibold">{post.author?.username || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt || Date.now()).toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-2 text-sm">{renderContent(post.content || '')}</div>

      <div className="mt-3 flex gap-3 text-sm">
        <button onClick={()=>onLike(post.id || post._id)} className="flex items-center gap-2">❤️ {post.likesCount||0}</button>
        <button onClick={()=>onComment(post.id || post._id)} className="flex items-center gap-2">💬 {post.commentsCount||0}</button>
      </div>
    </div>
  );
}

function renderContent(text='') {
  const parts = text.split(/```/g);
  return parts.map((p, i) => i % 2 === 1 ? (
    <pre key={i} className="rounded p-2 mt-2 mb-2 overflow-auto bg-gray-900 text-white text-sm font-mono"><code>{p}</code></pre>
  ) : (
    p.split(/\*\*\*(.+?)\*\*\*/g).map((chunk, idx) => idx % 2 ? <strong key={idx}>{chunk}</strong> : <span key={idx}>{chunk}</span>)
  ));
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [txt, setTxt] = useState('');
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);

  useEffect(()=>{ if(containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight; }, [messages]);

  async function send() {
    if (!txt.trim()) return;
    const userMsg = { from: 'me', text: txt, id: `m-${Date.now()}` };
    setMessages(m=>[...m, userMsg]);
    setTxt('');
    try {
      const res = await fetch(`${API_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: getToken()?`Bearer ${getToken()}`:undefined }, body: JSON.stringify({ message: userMsg.text }) });
      const data = await res.json();
      setMessages(m=>[...m, { from: 'bot', text: data.reply || data.text || "(no reply)" }]);
    } catch (e) {
      setMessages(m=>[...m, { from: 'bot', text: 'Send failed (network).' }]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={()=>setOpen(v=>!v)} className="bg-sky-600 text-white p-3 rounded-full shadow">Chat</button>
      {open && (
        <div className="mt-2 w-80 bg-white rounded shadow p-3 flex flex-col">
          <div ref={containerRef} className="h-48 overflow-auto mb-2 space-y-2">
            {messages.map((m,i)=> <div key={i} className={m.from==='bot'?'text-left':'text-right'}><div className={`inline-block p-2 rounded ${m.from==='bot'? 'bg-gray-100':'bg-sky-600 text-white'}`}>{m.text}</div></div>)}
          </div>
          <div className="flex gap-2">
            <input value={txt} onChange={e=>setTxt(e.target.value)} className="flex-1 border rounded p-2" placeholder="Ask the bot..." onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} />
            <button onClick={send} className="px-3 py-2 bg-sky-600 text-white rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
