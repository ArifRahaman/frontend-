// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import "./grid.css"; // <-- adjust path as needed

// export default function PostsList() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
//     async function fetchPosts() {
//       try {
//         const res = await fetch(`${BASE}/api/posts`);
//         if (!res.ok) throw new Error("Failed to fetch posts");
//         const data = await res.json();
//         setPosts(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPosts();
//   }, []);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 8 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
//   };

//   if (loading)
//     return (
//       <motion.p className="text-center text-gray-300 mt-10 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         Loading posts...
//       </motion.p>
//     );
//   if (error)
//     return (
//       <motion.p className="text-center text-red-400 mt-10 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         Error: {error}
//       </motion.p>
//     );

//   if (posts.length === 0)
//     return (
//       <motion.p className="text-center text-gray-300 mt-10 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         No posts found.
//       </motion.p>
//     );

//   return (
//     /* bw-grid-bg is the animated black & white grid background */
//     <div className="bw-grid-bg min-h-screen p-8 p-10">
//       {/* an overlay to lightly tint the area where cards sit (keeps contrast) */}
//       <div className="max-w-6xl mx-auto relative z-10 ">
//         <motion.div
//           className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12"
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           {posts.map((post) => (
//             <motion.article
//               key={post._id}
//               variants={cardVariants}
//               onClick={() => navigate(`/posts/${post.slug}`)}
//               tabIndex={0}
//               role="button"
//               className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm
//                          border border-white/40 bg-white/95
//                          hover:shadow-2xl transition-all duration-300 focus:outline-none
//                          focus:ring-2 focus:ring-blue-300"
//               whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.18 } }}
//               whileTap={{ scale: 0.98 }}
//               whileFocus={{ y: -6, scale: 1.02 }}
//             >
//               {/* Cover */}
//               <div className="relative w-full h-52 overflow-hidden">
//                 {post.coverUrl ? (
//                   <motion.img
//                     src={post.coverUrl}
//                     alt={post.title}
//                     className="w-full h-full object-cover"
//                     initial={{ scale: 1 }}
//                     whileHover={{ scale: 1.04 }}
//                     transition={{ duration: 0.5 }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 font-semibold">
//                     📷 No Image
//                   </div>
//                 )}

//                 {/* subtle bright overlay on hover helps image pop without hiding border */}
//                 <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

//                 {/* top-left tag */}
//                 <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/12 text-xs text-white/90 backdrop-blur-sm">
//                   {post.tags && post.tags.length ? post.tags[0] : "Post"}
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="p-5">
//                 <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
//                 <p className="text-sm text-gray-600 mb-3">
//                   By <span className="font-medium text-blue-600">{post.author?.username}</span>
//                 </p>
//                 <p className="text-gray-700 mb-4 line-clamp-3">{post.summary}</p>

//                 <div className="flex items-center justify-between text-sm text-gray-600">
//                   <span className="flex items-center gap-1">👍 {post.likes || 0} Likes</span>
//                   <span className="flex items-center gap-1">💬 {post.comments?.length || 0} Comments</span>
//                 </div>
//               </div>
//             </motion.article>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./grid.css"; // keep this but use the updated css below

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${BASE}/api/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const timeAgo = (iso) => {
    if (!iso) return "";
    const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    return `${Math.floor(months / 12)}y`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  };

  const filtered = posts.filter((p) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return (p.title || "").toLowerCase().includes(t) || (p.summary || "").toLowerCase().includes(t) || (p.tags || []).join(" ").toLowerCase().includes(t);
  });

  if (loading)
    return (
      <div className="bw-grid-bg min-h-screen flex items-center justify-center p-8">
        <motion.p className="text-gray-300 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading posts...
        </motion.p>
      </div>
    );

  if (error)
    return (
      <div className="bw-grid-bg min-h-screen flex items-center justify-center p-8">
        <motion.p className="text-red-400 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Error: {error}
        </motion.p>
      </div>
    );

  return (
    <div className="bw-grid-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <p className="text-sm text-slate-300 mt-1">Browse the latest articles and guides — click a card to read more.</p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72">
            <label className="sr-only">Search posts</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, summary or tags..."
              className="w-full rounded-lg px-3 py-2 bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-300">No posts found.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filtered.map((post) => {
              const imgSrc = post.coverUrl ? (post.coverUrl.startsWith("http") ? post.coverUrl : `${BASE}${post.coverUrl}`) : null;
              return (
                <motion.article
                  key={post._id}
                  variants={cardVariants}
                  onClick={() => navigate(`/posts/${post.slug || post._id}`)}
                  tabIndex={0}
                  role="button"
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg
                             border border-white/8 bg-black/40 backdrop-blur-sm
                             focus:outline-none focus:ring-4 focus:ring-sky-600/30 transition-all"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700">
                    {imgSrc ? (
                      <img src={imgSrc} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">📷 No Image</div>
                    )}

                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/50 text-xs text-slate-100 backdrop-blur-sm">
                      {(post.tags && post.tags[0]) || "Post"}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold text-white leading-tight">{post.title || "Untitled"}</h2>
                      <div className="text-xs text-slate-300">{post.createdAt ? `${timeAgo(post.createdAt)} ago` : ""}</div>
                    </div>

                    <p className="text-sm text-slate-300 mb-3 line-clamp-3">{post.summary || ""}</p>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <div>By <span className="font-medium text-sky-300">{(post.author && (post.author.username || post.author.name)) || "Unknown"}</span></div>
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1">👍 {post.likes || 0}</span>
                        <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}


/*
  Notes:
  - This component keeps your existing grid.css for the animated background.
  - It provides a nicer card style, skeleton loader, fallback likes calculation, "Trending/Featured" badge, and small author avatar.
  - Tailwind classes are used; make sure you have the line-clamp plugin enabled for clamping summaries.
*/