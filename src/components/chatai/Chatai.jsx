// ChatAppSingle.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function getStoredToken() {
  return localStorage.getItem('token');
}
const LOCAL_KEY = (token) => `chats_single_${token || 'anon'}_default_main`;

// small renderer: turns ***bold*** into <strong> and ```code blocks``` into <pre><code>
function renderInlineBold(text) {
  const nodes = [];
  const re = /\*\*\*(.+?)\*\*\*/g; // matches ***text***
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`t-${key++}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    nodes.push(
      <strong key={`b-${key++}`}>
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }
  return nodes.length ? nodes : [text];
}

function renderMessageContent(content) {
  // split on triple backticks to detect code fences
  const parts = content.split(/```/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      // code block
      return (
        <pre key={`code-${idx}`} className="rounded p-3 mt-2 mb-2 overflow-auto bg-gray-900 text-sm text-slate-100 font-mono">
          <code>{part}</code>
        </pre>
      );
    }

    // normal text: convert ***bold*** -> <strong>
    const inline = renderInlineBold(part);
    return (
      <span key={`txt-${idx}`} className="whitespace-pre-wrap">
        {inline}
      </span>
    );
  });
}

export default function ChatAppSingle() {
  const token = getStoredToken();
  const [messages, setMessages] = useState([]);
  const [composerText, setComposerText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  // track currently playing audio url so we can revoke it after end
  const audioUrlRef = useRef(null);

  // If you want bot replies to auto-play upon arrival, set this true.
  // NOTE: autoplay can be blocked by browsers until the user interacts with the page.
  const autoPlayBotAudio = false;

  const fetchMessages = useCallback(async () => {
    if (!token) {
      try {
        const raw = localStorage.getItem(LOCAL_KEY(token));
        if (raw) setMessages(JSON.parse(raw));
      } catch (e) {
        setMessages([]);
      }
      return;
    }

    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);

    try {
      const qs = new URLSearchParams({ topic: 'default', threadId: 'main' });
      const res = await fetch(`${BASE}/api/chats?${qs.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        signal: ac.signal,
      });

      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      try {
        localStorage.setItem(LOCAL_KEY(token), JSON.stringify(Array.isArray(data) ? data : []));
      } catch (e) {}
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('fetchMessages failed, using cache', err);
      try {
        const raw = localStorage.getItem(LOCAL_KEY(token));
        if (raw) setMessages(JSON.parse(raw));
        else setMessages([]);
      } catch (e) {
        setMessages([]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SPEAK: calls /api/speak and plays audio
  async function speakText(text) {
    if (!text) return;
    // make sure user has interacted before trying autoplay in some browsers
    try {
      const res = await fetch(`${BASE}/api/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => '');
        console.error('TTS failed', res.status, err);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // cleanup previously created object URL
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch (e) {}
        audioUrlRef.current = null;
      }

      audioUrlRef.current = url;
      const audio = new Audio(url);
      audio.play().catch((err) => {
        // autoplay may be blocked; log and ignore
        console.warn('Audio play blocked', err);
      });
      // revoke when finished to avoid memory leak
      audio.onended = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
        if (audioUrlRef.current === url) audioUrlRef.current = null;
      };
    } catch (err) {
      console.error('speakText error', err);
    }
  }

  async function handleSend() {
    const text = composerText.trim();
    if (!text) return;
    setSending(true);
    setComposerText('');

    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      _temp: true,
    };

    setMessages((prev) => {
      const next = [...prev, tempMsg];
      try {
        localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      const res = await fetch(`${BASE}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        body: JSON.stringify({ topic: 'default', threadId: 'main', content: text }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== tempId);
          const sys = {
            _id: `sys_${Date.now()}`,
            sender: 'bot',
            content: body?.message || `Send failed (${res.status}).`,
            timestamp: new Date().toISOString(),
            _system: true,
          };
          const next = filtered.concat(sys);
          try {
            localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
          } catch (e) {}
          return next;
        });
        setSending(false);
        return;
      }

      const userMessage =
        body?.userMessage ??
        { _id: `s-${Date.now()}`, sender: 'user', content: text, timestamp: new Date().toISOString() };
      const botMessage =
        body?.botMessage ??
        { _id: `b-${Date.now()}`, sender: 'bot', content: body?.text ?? '', timestamp: new Date().toISOString() };

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m._id !== tempId);
        const next = withoutTemp.concat(userMessage, botMessage);
        try {
          localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // if you want to auto play bot audio (may be blocked by browser), check flag
      if (autoPlayBotAudio && botMessage && botMessage.content) {
        // best effort
        speakText(botMessage.content);
      }
    } catch (err) {
      console.error('Send failed', err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== tempId);
        const sys = {
          _id: `sys_${Date.now()}`,
          sender: 'bot',
          content: 'Send failed (network).',
          timestamp: new Date().toISOString(),
          _system: true,
        };
        const next = filtered.concat(sys);
        try {
          localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  function onComposerKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!sending && composerText.trim()) handleSend();
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-lg text-center">
          <h3 className="text-lg font-semibold mb-2">No token found</h3>
          <p className="text-sm text-gray-600">
            Please set a token in localStorage:{' '}
            <code>localStorage.setItem('token','YOUR_TOKEN')</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl flex-1 flex flex-col">
        <header className="py-4">
          <h1 className="text-2xl font-semibold">Chatbot</h1>
        </header>

        <div className="flex-1 overflow-auto bg-white rounded-lg p-4 border border-gray-200 mb-4">
          {loading ? (
            <div className="text-sm text-gray-400 text-center py-8">Loading messages…</div>
          ) : messages.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">No messages yet. Say hi 👋</div>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                className={`p-3 rounded-lg mb-3 max-w-[80%] flex items-start ${
                  m.sender === 'user' ? 'bg-sky-600 text-white self-end ml-auto' : 'bg-gray-100 text-gray-900 mr-auto'
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm">{renderMessageContent(m.content)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(m.timestamp || Date.now()).toLocaleString()}
                  </div>
                </div>

                {/* show speak button only for bot messages (and not for system errors) */}
                {m.sender !== 'user' && !m._system && (
                  <div className="ml-3 flex-shrink-0">
                    <button
                      onClick={() => speakText(m.content)}
                      title="Play speech"
                      className="px-2 py-1 rounded bg-white border hover:bg-gray-50 text-gray-700"
                    >
                      🔊
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <div className="flex gap-3">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              onKeyDown={onComposerKeyDown}
              rows={3}
              placeholder="Type a message — Ctrl/Cmd+Enter to send"
              className="flex-1 border border-gray-300 rounded p-3 resize-none"
              disabled={sending}
            />
            <div className="flex flex-col gap-2">
              <button onClick={() => setComposerText('')} className="px-3 py-2 border rounded bg-gray-100" disabled={!composerText}>
                Clear
              </button>
              <button onClick={handleSend} className="px-4 py-2 bg-sky-600 text-white rounded" disabled={!composerText || sending}>
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
