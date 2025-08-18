// // // import React, { useEffect, useState, useRef } from "react";
// // // import { toast } from "react-toastify";

// // // /**
// // //  * Profile page — shows current user's profile with edit & avatar upload
// // //  *
// // //  * Tailwind required.
// // //  */

// // // const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// // // function Avatar({ src, alt, size = 120 }) {
// // //   const url =
// // //     !src || src === ""
// // //       ? null
// // //       : src.startsWith("http")
// // //       ? src
// // //       : `${BASE}${src}`;
// // //   return (
// // //     <div
// // //       className="rounded-full bg-gray-100 overflow-hidden flex items-center justify-center"
// // //       style={{ width: size, height: size }}
// // //     >
// // //       {url ? (
// // //         <img src={url} alt={alt} className="w-full h-full object-cover" />
// // //       ) : (
// // //         <span className="text-3xl text-gray-400 font-semibold">
// // //           {alt?.[0]?.toUpperCase() || "U"}
// // //         </span>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // function SkeletonCard() {
// // //   return (
// // //     <div className="animate-pulse bg-white p-6 rounded-lg shadow">
// // //       <div className="h-6 w-1/3 bg-gray-200 mb-4 rounded"></div>
// // //       <div className="h-40 bg-gray-200 rounded mb-4"></div>
// // //       <div className="h-4 bg-gray-200 rounded mb-2"></div>
// // //       <div className="h-4 bg-gray-200 rounded w-5/6"></div>
// // //     </div>
// // //   );
// // // }

// // // export default function Profile() {
// // //     const userId= localStorage.getItem("id");
// // //   const [user, setUser] = useState(null);
// // //   const [posts, setPosts] = useState([]);
// // //   const [loadingUser, setLoadingUser] = useState(true);
// // //   const [loadingPosts, setLoadingPosts] = useState(true);
// // //   const [editing, setEditing] = useState(false);
// // //   const [showFollowers, setShowFollowers] = useState(false);

// // //   const [uploading, setUploading] = useState(false);
// // //   const fileRef = useRef();

// // //   const token = localStorage.getItem("token");

// // // //   useEffect(() => {
// // // //     async function fetchUser() {
// // // //       setLoadingUser(true);
// // // //       try {
// // // //         const res = await fetch(`${BASE}/api/auth/${userId}`, {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });
// // // //         if (!res.ok) throw new Error("Failed to fetch user");
// // // //         const data = await res.json();
// // // //         setUser(data);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         toast.error(err.message || "Could not load profile");
// // // //       } finally {
// // // //         setLoadingUser(false);
// // // //       }
// // // //     }
// // // //     fetchUser();
// // // //   }, [token]);

// // // useEffect(() => {
// // //   async function fetchUser() {
// // //     setLoadingUser(true);
// // //     const token = localStorage.getItem("token"); // ensure token is read here too
// // //     if (!token) {
// // //       console.warn("No token in localStorage — user not authenticated");
// // //       setLoadingUser(false);
// // //       return;
// // //     }

// // //     try {
// // //       console.log("Fetching user with token:", Boolean(token));
// // //       const res = await fetch(`${BASE}/api/auth/me`, {                // <- use /me
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       if (!res.ok) {
// // //         const errBody = await res.json().catch(() => ({}));
// // //         throw new Error(errBody.error || `Failed to fetch user (status ${res.status})`);
// // //       }
// // //       const data = await res.json();
// // //       setUser(data);
// // //     } catch (err) {
// // //       console.error("fetchUser error:", err);
// // //       toast.error(err.message || "Could not load profile");
// // //     } finally {
// // //       setLoadingUser(false);
// // //     }
// // //   }

// // //   fetchUser();
// // //   // run when BASE or token changes (token read inside, but dependency ok)
// // // }, [BASE /* optional: , token if you read it from outer scope */]);

// // //   // avatar upload handler
// // //   const handleAvatarChange = async (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file) return;
// // //     setUploading(true);
// // //     try {
// // //       const fd = new FormData();
// // //       fd.append("avatar", file);

// // //       // change URL if your upload route differs
// // //       const res = await fetch(`${BASE}/api/auth/me/avatar`, {
// // //         method: "POST",
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: fd,
// // //       });

// // //       const json = await (res.ok ? res.json() : res.json().catch(() => ({})));
// // //       if (!res.ok) throw new Error(json.error || "Avatar upload failed");

// // //       // update avatar in UI
// // //       setUser((prev) => ({ ...prev, avatarUrl: json.avatarUrl || json.url || prev.avatarUrl }));
// // //       toast.success("Avatar updated");
// // //     } catch (err) {
// // //       console.error(err);
// // //       toast.error(err.message || "Upload failed");
// // //     } finally {
// // //       setUploading(false);
// // //       // clear file input
// // //       if (fileRef.current) fileRef.current.value = "";
// // //     }
// // //   };

// // //   // profile edit submit
// // //   const handleProfileSave = async (updates) => {
// // //     // updates: { username, email, bio }
// // //     try {
// // //       const res = await fetch(`${BASE}/api/auth/me`, {
// // //         method: "PUT",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify(updates),
// // //       });
// // //       const json = await (res.ok ? res.json() : res.json().catch(() => ({})));
// // //       if (!res.ok) throw new Error(json.error || "Update failed");
// // //       setUser(json);
// // //       setEditing(false);
// // //       toast.success("Profile updated");
// // //     } catch (err) {
// // //       console.error(err);
// // //       toast.error(err.message || "Update failed");
// // //     }
// // //   };

// // //   if (loadingUser)
// // //     return (
// // //       <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
// // //         <div className="max-w-5xl mx-auto">
// // //           <SkeletonCard />
// // //         </div>
// // //       </div>
// // //     );

// // //   if (!user)
// // //     return (
// // //       <div className="min-h-screen p-8">
// // //         <p className="text-center text-red-500">Could not load profile. Try signing in.</p>
// // //       </div>
// // //     );

// // //   return (
// // //     <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-sky-50">
// // //       <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //         {/* Left column: avatar + stats */}
// // //         <div className="col-span-1">
// // //           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
// // //             <div className="flex flex-col items-center">
// // //               <Avatar src={user.avatarUrl} alt={user.username} size={140} />
// // //               <div className="mt-4 text-center">
// // //                 <h2 className="text-xl font-semibold">{user.username}</h2>
// // //                 <p className="text-sm text-gray-500">{user.email}</p>
// // //               </div>

// // //               <div className="mt-4 flex items-center gap-3">
// // //                 <label className="inline-flex items-center gap-2">
// // //                   <input
// // //                     ref={fileRef}
// // //                     type="file"
// // //                     accept="image/*"
// // //                     onChange={handleAvatarChange}
// // //                     className="hidden"
// // //                   />
// // //                   <button
// // //                     onClick={() => fileRef.current?.click()}
// // //                     disabled={uploading}
// // //                     className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700"
// // //                   >
// // //                     {uploading ? "Uploading..." : "Change Avatar"}
// // //                   </button>
// // //                 </label>

// // //                 <button
// // //                   onClick={() => setEditing(true)}
// // //                   className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
// // //                 >
// // //                   Edit Profile
// // //                 </button>
// // //               </div>

// // //               <p className="mt-4 text-sm text-gray-600 text-center">{user.bio || "No bio yet — tell people about yourself!"}</p>
// // //             </div>

// // //             <div className="mt-6 grid grid-cols-3 gap-3 text-center">
// // //               <div className="p-3 bg-gray-50 rounded">
// // //                 <div className="text-lg font-semibold">{posts?.length || 0}</div>
// // //                 <div className="text-xs text-gray-500">Posts</div>
// // //               </div>
// // //               <button
// // //                 onClick={() => setShowFollowers(true)}
// // //                 className="p-3 bg-gray-50 rounded"
// // //               >
// // //                 <div className="text-lg font-semibold">{user.followers?.length || 0}</div>
// // //                 <div className="text-xs text-gray-500">Followers</div>
// // //               </button>
// // //               <div className="p-3 bg-gray-50 rounded">
// // //                 <div className="text-lg font-semibold">{user.following?.length || 0}</div>
// // //                 <div className="text-xs text-gray-500">Following</div>
// // //               </div>
// // //             </div>

// // //             {user.badges?.length > 0 && (
// // //               <div className="mt-4">
// // //                 <h4 className="text-sm font-medium text-gray-700 mb-2">Badges</h4>
// // //                 <div className="flex flex-wrap gap-2">
// // //                   {user.badges.map((b, i) => (
// // //                     <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{b}</span>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Right column: recent posts + details */}
// // //         <div className="col-span-2">
// // //           <div className="flex items-center justify-between mb-4">
// // //             <h3 className="text-lg font-semibold">Recent Posts</h3>
// // //             <div className="text-sm text-gray-500">{posts?.length || 0} posts</div>
// // //           </div>

// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //             {loadingPosts ? (
// // //               Array.from({ length: 4 }).map((_, i) => (
// // //                 <div key={i} className="h-44 bg-white rounded-lg shadow p-4 animate-pulse" />
// // //               ))
// // //             ) : posts.length === 0 ? (
// // //               <div className="col-span-full p-6 bg-white rounded-lg shadow text-center text-gray-500">
// // //                 No posts yet — create your first post!
// // //               </div>
// // //             ) : (
// // //               posts.map((p) => (
// // //                 <article key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
// // //                   {p.coverUrl ? (
// // //                     <img
// // //                       src={p.coverUrl.startsWith("http") ? p.coverUrl : `${BASE}${p.coverUrl}`}
// // //                       alt={p.title}
// // //                       className="w-full h-36 object-cover"
// // //                     />
// // //                   ) : (
// // //                     <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
// // //                   )}
// // //                   <div className="p-4">
// // //                     <h4 className="font-semibold text-sm mb-1 truncate">{p.title}</h4>
// // //                     <p className="text-xs text-gray-600 mb-2 line-clamp-2">{p.summary || "—"}</p>
// // //                     <div className="flex items-center justify-between text-xs text-gray-500">
// // //                       <span>{new Date(p.createdAt).toLocaleDateString()}</span>
// // //                       <span>💬 {p.comments?.length || 0} • 👍 {p.likes || 0}</span>
// // //                     </div>
// // //                   </div>
// // //                 </article>
// // //               ))
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Edit Modal */}
// // //       {editing && <EditModal user={user} onClose={() => setEditing(false)} onSave={handleProfileSave} />}

// // //       {/* Followers Modal */}
// // //       {showFollowers && (
// // //         <FollowersModal users={user.followers || []} onClose={() => setShowFollowers(false)} />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // /* ------------------------- Edit Modal ------------------------- */
// // // function EditModal({ user, onClose, onSave }) {
// // //   const [username, setUsername] = useState(user.username || "");
// // //   const [email, setEmail] = useState(user.email || "");
// // //   const [bio, setBio] = useState(user.bio || "");
// // //   const [saving, setSaving] = useState(false);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setSaving(true);
// // //     try {
// // //       await onSave({ username, email, bio });
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// // //       <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
// // //         <div className="flex items-center justify-between mb-4">
// // //           <h3 className="text-lg font-semibold">Edit Profile</h3>
// // //           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           <div>
// // //             <label className="text-sm text-gray-700">Username</label>
// // //             <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 border rounded px-3 py-2" />
// // //           </div>

// // //           <div>
// // //             <label className="text-sm text-gray-700">Email</label>
// // //             <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 border rounded px-3 py-2" />
// // //           </div>

// // //           <div>
// // //             <label className="text-sm text-gray-700">Bio</label>
// // //             <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 border rounded px-3 py-2" rows={4} />
// // //           </div>

// // //           <div className="flex justify-end gap-2">
// // //             <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
// // //             <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-sky-600 text-white">
// // //               {saving ? "Saving..." : "Save"}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ------------------------- Followers Modal ------------------------- */
// // // function FollowersModal({ users, onClose }) {
// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
// // //       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
// // //         <div className="flex items-center justify-between mb-4">
// // //           <h3 className="text-lg font-semibold">Followers</h3>
// // //           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
// // //         </div>

// // //         {users.length === 0 ? (
// // //           <div className="text-center text-gray-500">No followers yet.</div>
// // //         ) : (
// // //           <ul className="space-y-3">
// // //             {users.map((u) => (
// // //               <li key={u._id} className="flex items-center gap-3">
// // //                 <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
// // //                   {u.avatarUrl ? <img src={u.avatarUrl.startsWith("http") ? u.avatarUrl : `${BASE}${u.avatarUrl}`} alt={u.username} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">{u.username?.[0]?.toUpperCase()}</div>}
// // //                 </div>
// // //                 <div>
// // //                   <div className="font-medium">{u.username}</div>
// // //                   <div className="text-xs text-gray-500">{u.email}</div>
// // //                 </div>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React, { useEffect, useState, useRef } from "react";
// // import { toast } from "react-toastify";

// // const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// // export default function Profile() {
// //   const [user, setUser] = useState(null);
// //   const [loadingUser, setLoadingUser] = useState(true);
// //   const [editing, setEditing] = useState(false);
// //   const [uploading, setUploading] = useState(false);
// //   const fileRef = useRef();

// //   const token = localStorage.getItem("token");

// //   useEffect(() => {
// //     async function fetchUser() {
// //       if (!token) {
// //         toast.error("You must be logged in");
// //         setLoadingUser(false);
// //         return;
// //       }
// //       setLoadingUser(true);
// //       try {
// //         const res = await fetch(`${BASE}/api/auth/me`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //               console.log("Response status:", res.status);

// //         if (!res.ok) {
// //           const errBody = await res.json().catch(() => ({}));
// //           throw new Error(errBody.error || `Failed to fetch user (status ${res.status})`);
// //         }
// //         const data = await res.json();
// //         setUser(data);
// //       } catch (err) {
// //         console.error(err);
// //         toast.error(err.message || "Could not load profile");
// //       } finally {
// //         setLoadingUser(false);
// //       }
// //     }
// //     fetchUser();
// //   }, [token]);

// //   // Avatar upload handler
// //   const handleAvatarChange = async (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file || !token) return;
// //     setUploading(true);
// //     try {
// //       const fd = new FormData();
// //       fd.append("avatar", file);

// //       const res = await fetch(`${BASE}/api/auth/me/avatar`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}` },
// //         body: fd,
// //       });

// //       if (!res.ok) {
// //         const errBody = await res.json().catch(() => ({}));
// //         throw new Error(errBody.error || "Avatar upload failed");
// //       }
// //       const json = await res.json();
// //       setUser((prev) => ({ ...prev, avatarUrl: json.avatarUrl || json.url || prev.avatarUrl }));
// //       toast.success("Avatar updated");
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err.message || "Upload failed");
// //     } finally {
// //       setUploading(false);
// //       if (fileRef.current) fileRef.current.value = "";
// //     }
// //   };

// //   // Profile update handler
// //   const handleProfileSave = async (updates) => {
// //     if (!token) return toast.error("You must be logged in");
// //     try {
// //       const res = await fetch(`${BASE}/api/auth/me/update`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(updates),
// //       });
// //       if (!res.ok) {
// //         const errBody = await res.json().catch(() => ({}));
// //         throw new Error(errBody.error || "Update failed");
// //       }
// //       const json = await res.json();
// //       setUser(json);
// //       setEditing(false);
// //       toast.success("Profile updated");
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err.message || "Update failed");
// //     }
// //   };

// //   if (loadingUser) return <p>Loading profile...</p>;
// //   if (!user) return <p className="text-red-500">Failed to load profile. Please login.</p>;

// //   return (
// //     <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
// //       <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

// //       <div className="mb-4">
// //         <label className="block mb-1 font-semibold">Avatar</label>
// //         <div className="mb-2">
// //           <img
// //             src={user.avatarUrl ? `${BASE}${user.avatarUrl}` : "https://via.placeholder.com/150"}
// //             alt="avatar"
// //             className="w-32 h-32 rounded-full object-cover"
// //           />
// //         </div>
// //         <input
// //           type="file"
// //           ref={fileRef}
// //           disabled={uploading}
// //           onChange={handleAvatarChange}
// //           className="block"
// //         />
// //       </div>

// //       {!editing ? (
// //         <>
// //           <p><strong>Username:</strong> {user.username}</p>
// //           <p><strong>Email:</strong> {user.email}</p>
// //           <p><strong>Bio:</strong> {user.bio || "No bio set."}</p>
// //           <button
// //             onClick={() => setEditing(true)}
// //             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
// //           >
// //             Edit Profile
// //           </button>
// //         </>
// //       ) : (
// //         <ProfileEditForm user={user} onSave={handleProfileSave} onCancel={() => setEditing(false)} />
// //       )}
// //     </div>
// //   );
// // }

// // function ProfileEditForm({ user, onSave, onCancel }) {
// //   const [username, setUsername] = useState(user.username || "");
// //   const [email, setEmail] = useState(user.email || "");
// //   const [bio, setBio] = useState(user.bio || "");

// //   function handleSubmit(e) {
// //     e.preventDefault();
// //     onSave({ username, email, bio });
// //   }

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4">
// //       <div>
// //         <label className="block font-semibold">Username</label>
// //         <input
// //           className="border rounded w-full px-3 py-2"
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //           required
// //         />
// //       </div>
// //       <div>
// //         <label className="block font-semibold">Email</label>
// //         <input
// //           type="email"
// //           className="border rounded w-full px-3 py-2"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />
// //       </div>
// //       <div>
// //         <label className="block font-semibold">Bio</label>
// //         <textarea
// //           className="border rounded w-full px-3 py-2"
// //           value={bio}
// //           onChange={(e) => setBio(e.target.value)}
// //           rows={4}
// //         />
// //       </div>
// //       <div className="flex gap-2">
// //         <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
// //           Save
// //         </button>
// //         <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
// //           Cancel
// //         </button>
// //       </div>
// //     </form>
// //   );
// // }
// import React, { useEffect, useState, useRef } from "react";
// import { toast } from "react-toastify";

// const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// function Avatar({ src, alt, size = 120 }) {
//   const url =
//     !src || src === ""
//       ? null
//       : src.startsWith("http")
//       ? src
//       : `${BASE}${src}`;
//   return (
//     <div
//       className="rounded-full bg-gray-100/30 overflow-hidden flex items-center justify-center"
//       style={{ width: size, height: size }}
//     >
//       {url ? (
//         <img src={url} alt={alt} className="w-full h-full object-cover" />
//       ) : (
//         <span className="text-3xl text-gray-300 font-semibold">
//           {alt?.[0]?.toUpperCase() || "U"}
//         </span>
//       )}
//     </div>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="animate-pulse p-6 rounded-lg">
//       <div className="h-6 w-1/3 bg-gray-300/30 mb-4 rounded"></div>
//       <div className="h-40 bg-gray-300/30 rounded mb-4"></div>
//       <div className="h-4 bg-gray-300/30 rounded mb-2"></div>
//       <div className="h-4 bg-gray-300/30 rounded w-5/6"></div>
//     </div>
//   );
// }

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const fileRef = useRef();

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     async function fetchUser() {
//       setLoadingUser(true);
//       if (!token) {
//         toast.error("You must be logged in");
//         setLoadingUser(false);
//         return;
//       }
//       try {
//         const res = await fetch(`${BASE}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) {
//           const errBody = await res.json().catch(() => ({}));
//           throw new Error(errBody.error || `Failed to fetch user (status ${res.status})`);
//         }
//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         console.error(err);
//         toast.error(err.message || "Could not load profile");
//       } finally {
//         setLoadingUser(false);
//       }
//     }
//     fetchUser();
//   }, [token]);

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !token) return;
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("avatar", file);

//       const res = await fetch(`${BASE}/api/auth/me/avatar`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });

//       if (!res.ok) {
//         const errBody = await res.json().catch(() => ({}));
//         throw new Error(errBody.error || "Avatar upload failed");
//       }
//       const json = await res.json();
//       setUser((prev) => ({ ...prev, avatarUrl: json.avatarUrl || json.url || prev.avatarUrl }));
//       toast.success("Avatar updated");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Upload failed");
//     } finally {
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   };

//   const handleProfileSave = async (updates) => {
//     if (!token) return toast.error("You must be logged in");
//     try {
//       const res = await fetch(`${BASE}/api/auth/me/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updates),
//       });
//       if (!res.ok) {
//         const errBody = await res.json().catch(() => ({}));
//         throw new Error(errBody.error || "Update failed");
//       }
//       const json = await res.json();
//       setUser(json);
//       setEditing(false);
//       toast.success("Profile updated");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Update failed");
//     }
//   };

//   if (loadingUser)
//     return (
//       <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
//         <SkeletonCard />
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
//         <p className="text-center text-red-400">Failed to load profile. Please login.</p>
//       </div>
//     );

//   return (
//     // Outer: your grid background must be applied by bw-grid-bg
//     <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
//       {/* Transparent/glass overlay card — no solid white background */}
//       <div className="max-w-3xl w-full p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 shadow-sm">
//         <div className="flex flex-col items-center text-white">
//           <Avatar src={user.avatarUrl} alt={user.username} size={140} />

//           <div className="mt-4 text-center">
//             <h2 className="text-2xl font-semibold">{user.username}</h2>
//             <p className="text-sm text-gray-100/80">{user.email}</p>
//           </div>

//           <div className="mt-4 flex items-center gap-3">
//             <label className="inline-flex items-center gap-2 cursor-pointer">
//               <input
//                 ref={fileRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 className="hidden"
//                 disabled={uploading}
//               />
//               <button
//                 type="button"
//                 disabled={uploading}
//                 className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm hover:bg-sky-600"
//                 onClick={() => fileRef.current?.click()}
//               >
//                 {uploading ? "Uploading..." : "Change Avatar"}
//               </button>
//             </label>

//             <button
//               onClick={() => setEditing(true)}
//               className="px-3 py-1 rounded-md border border-white/20 text-sm hover:bg-white/5"
//             >
//               Edit Profile
//             </button>
//           </div>

//           <p className="mt-4 text-sm text-gray-100/80 text-center">
//             {user.bio || "No bio yet — tell people about yourself!"}
//           </p>
//         </div>

//         {editing && (
//           <EditModal user={user} onClose={() => setEditing(false)} onSave={handleProfileSave} />
//         )}
//       </div>
//     </div>
//   );
// }

// function EditModal({ user, onClose, onSave }) {
//   const [username, setUsername] = useState(user.username || "");
//   const [email, setEmail] = useState(user.email || "");
//   const [bio, setBio] = useState(user.bio || "");
//   const [saving, setSaving] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await onSave({ username, email, bio });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">Edit Profile</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//             aria-label="Close edit profile modal"
//           >
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-sm text-gray-700">Username</label>
//             <input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full mt-1 border rounded px-3 py-2 text-black"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mt-1 border rounded px-3 py-2 text-black"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Bio</label>
//             <textarea
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className="w-full mt-1 border rounded px-3 py-2 text-black"
//               rows={4}
//             />
//           </div>

//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-3 py-2 rounded border"
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-4 py-2 rounded bg-sky-600 text-white"
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Avatar({ src, alt, size = 120 }) {
  const url =
    !src || src === ""
      ? null
      : src.startsWith("http")
      ? src
      : `${BASE}${src}`;
  return (
    <div
      className="rounded-full bg-gray-100/30 overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {url ? (
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-3xl text-gray-300 font-semibold">
          {alt?.[0]?.toUpperCase() || "U"}
        </span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse p-6 rounded-lg">
      <div className="h-6 w-1/3 bg-gray-300/30 mb-4 rounded"></div>
      <div className="h-40 bg-gray-300/30 rounded mb-4"></div>
      <div className="h-4 bg-gray-300/30 rounded mb-2"></div>
      <div className="h-4 bg-gray-300/30 rounded w-5/6"></div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // keep posts & followers in their own state so UI updates reliably
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // these hold full user objects for the modal
  const [followersUsers, setFollowersUsers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const fileRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch user profile, then attempt to fetch related resources (posts, followers)
    async function fetchUserAndRelated() {
      setLoadingUser(true);
      if (!token) {
        toast.error("You must be logged in");
        setLoadingUser(false);
        return;
      }

      try {
        const res = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Failed to fetch user (status ${res.status})`);
        }
        const data = await res.json();
        setUser(data);

        // POSTS: if backend included posts in the user object, use them;
        // otherwise try common endpoints (best-effort, harmless if 404)
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setLoadingPosts(true);
          try {
            // try a couple of likely endpoints
            let pRes = await fetch(`${BASE}/api/posts?userId=${data._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!pRes.ok) {
              pRes = await fetch(`${BASE}/api/posts/author/${data._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            if (pRes.ok) {
              const pJson = await pRes.json().catch(() => ({}));
              const allPosts = Array.isArray(pJson) ? pJson : pJson.posts || [];
              const myPosts = allPosts.filter((p) => {
                const authorId = p.author?._id || p.author || p.user || p.userId || p.owner || p.creator;
                return authorId && String(authorId) === String(data._id);
              });
              setPosts(myPosts);
            }
          } catch (e) {
            console.error("Failed to fetch posts:", e);
          } finally {
            setLoadingPosts(false);
          }
        }

        // We don't eagerly populate followersUsers/followingUsers here;
        // fetch them on demand when modal is opened for freshest data.
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Could not load profile");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserAndRelated();
  }, [token]);

  // helper to fetch user objects from various possible response shapes
  async function resolveUserObjectsFromResponse(respJson, fallbackIdsKey = null) {
    // If respJson already an array of user objects, return it
    if (Array.isArray(respJson) && respJson.length > 0 && typeof respJson[0] === "object" && (respJson[0]._id || respJson[0].username)) {
      return respJson;
    }

    // If respJson is { followers: [...] } with user objects
    if (respJson && Array.isArray(respJson.followers) && typeof respJson.followers[0] === "object") {
      return respJson.followers;
    }

    // If respJson is a user object with followers array of ids
    if (respJson && Array.isArray(respJson.followers) && (typeof respJson.followers[0] === "string" || typeof respJson.followers[0] === "number")) {
      return await fetchUsersByIds(respJson.followers);
    }

    // If respJson is an array of ids
    if (Array.isArray(respJson) && respJson.length > 0 && (typeof respJson[0] === "string" || typeof respJson[0] === "number")) {
      return await fetchUsersByIds(respJson);
    }

    // fallback: maybe respJson has the ids under other keys
    if (respJson && fallbackIdsKey && Array.isArray(respJson[fallbackIdsKey])) {
      return await fetchUsersByIds(respJson[fallbackIdsKey]);
    }

    return [];
  }

  // Try to fetch many users by ids. Prefer bulk API /api/users?ids=1,2,3
  async function fetchUsersByIds(ids = []) {
    if (!ids || ids.length === 0) return [];
    try {
      // try bulk endpoint first (common pattern)
      const idsParam = ids.map(String).join(",");
      const res = await fetch(`${BASE}/api/users?ids=${encodeURIComponent(idsParam)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        // json might be array or { users: [...] }
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.users)) return json.users;
      }

      // fallback: fetch each user individually
      const promises = ids.map((id) =>
        fetch(`${BASE}/api/users/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
          .then((r) => (r.ok ? r.json().catch(() => null) : null))
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    } catch (err) {
      console.warn("fetchUsersByIds failed", err);
      return [];
    }
  }

  // Fetch followers on demand and open modal
  async function openFollowers() {
    if (!user) return;
    setLoadingFollowers(true);
    try {
      // try endpoint that returns followers (could be array of users or ids)
      let res = await fetch(`${BASE}/api/users/${user._id}/followers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // fallback endpoint patterns
      if (!res.ok) {
        res = await fetch(`${BASE}/api/users/${user._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }

      if (!res.ok) {
        // final fallback: maybe auth/me contains followers — try that
        const meRes = await fetch(`${BASE}/api/auth/me`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (meRes.ok) {
          const meJson = await meRes.json().catch(() => ({}));
          // if meJson._id === user._id and has followers, use it
          if (meJson && String(meJson._id) === String(user._id)) {
            const resolved = await resolveUserObjectsFromResponse(meJson);
            setFollowersUsers(resolved);
            setShowFollowersModal(true);
            return;
          }
        }
        // nothing else worked
        throw new Error("Could not fetch followers");
      }

      const json = await res.json().catch(() => ({}));
      const resolved = await resolveUserObjectsFromResponse(json, "followers");
      setFollowersUsers(resolved);
      setShowFollowersModal(true);
    } catch (err) {
      console.error("openFollowers error", err);
      toast.error(err.message || "Could not load followers");
    } finally {
      setLoadingFollowers(false);
    }
  }

  // Fetch following on demand and open modal
  async function openFollowing() {
    if (!user) return;
    setLoadingFollowing(true);
    try {
      // try plausible endpoints for "following"
      let res = await fetch(`${BASE}/api/users/${user._id}/following`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        res = await fetch(`${BASE}/api/users/${user._id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      if (!res.ok) {
        throw new Error("Could not fetch following");
      }
      const json = await res.json().catch(() => ({}));
      // server may return { following: [...] } or array of ids or array of users
      const resolved = await resolveUserObjectsFromResponse(json, "following");
      setFollowingUsers(resolved);
      setShowFollowingModal(true);
    } catch (err) {
      console.error("openFollowing error", err);
      toast.error(err.message || "Could not load following");
    } finally {
      setLoadingFollowing(false);
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch(`${BASE}/api/auth/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Avatar upload failed");
      }
      const json = await res.json();
      setUser((prev) => ({ ...prev, avatarUrl: json.avatarUrl || json.url || prev.avatarUrl }));
      toast.success("Avatar updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleProfileSave = async (updates) => {
    if (!token) return toast.error("You must be logged in");
    try {
      const res = await fetch(`${BASE}/api/auth/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Update failed");
      }
      const json = await res.json();
      setUser(json);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    }
  };

  if (loadingUser)
    return (
      <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
        <SkeletonCard />
      </div>
    );

  if (!user)
    return (
      <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">
        <p className="text-center text-red-400">Failed to load profile. Please login.</p>
      </div>
    );

  return (
    <div className="bw-grid-bg min-h-screen p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8 text-blue-900">
        {/* Left column: avatar + stats */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col items-center">
              <Avatar src={user.avatarUrl} alt={user.username} size={140} />
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm hover:bg-sky-700"
                  >
                    {uploading ? "Uploading..." : "Change Avatar"}
                  </button>
                </label>

                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-600 text-center">{user.bio || "No bio yet — tell people about yourself!"}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-lg font-semibold">{posts?.length || 0}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <button
                onClick={openFollowers}
                className="p-3 bg-gray-50 rounded"
              >
                <div className="text-lg font-semibold">{(user.followers && user.followers.length) ?? (followersUsers.length || 0)}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </button>
              <button
                onClick={openFollowing}
                className="p-3 bg-gray-50 rounded"
              >
                <div className="text-lg font-semibold">{(user.following && user.following.length) ?? (followingUsers.length || 0)}</div>
                <div className="text-xs text-gray-500">Following</div>
              </button>
            </div>

            {user.badges?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: recent posts + details */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-semibold text-green">Recent Posts</h3>
            <div className="text-4xl text-gray-500">{posts?.length || 0} posts</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingPosts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 bg-white rounded-lg shadow p-4 animate-pulse" />
              ))
            ) : posts.length === 0 ? (
              <div className="col-span-full p-6 bg-white rounded-lg shadow text-center text-gray-500">
                No posts yet — create your first post!
              </div>
            ) : (
              posts.map((p) => (
                <article key={p._id} className="bg-white rounded-lg shadow overflow-hidden">
                  {p.coverUrl ? (
                    <img
                      src={p.coverUrl.startsWith("http") ? p.coverUrl : `${BASE}${p.coverUrl}`}
                      alt={p.title}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-sm mb-1 truncate">{p.title}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{p.summary || "—"}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span>💬 {p.comments?.length || 0} • 👍 {p.likes || 0}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && <EditModal user={user} onClose={() => setEditing(false)} onSave={handleProfileSave} />}

      {/* Followers Modal */}
      {showFollowersModal && (
        <UsersModal
          title="Followers"
          users={followersUsers}
          loading={loadingFollowers}
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <UsersModal
          title="Following"
          users={followingUsers}
          loading={loadingFollowing}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ username, email, bio });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close edit profile modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2 text-black"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-sky-600 text-white"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersModal({ title = "Users", users = [], loading = false, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-500">No users to show.</div>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id || u.id || u.username} className="flex items-center gap-3">
                <img
                  src={u.avatarUrl ? (u.avatarUrl.startsWith("http") ? u.avatarUrl : `${BASE}${u.avatarUrl}`) : undefined}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <div className="font-medium">{u.username || u.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{u.email || ""}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-1 rounded border">Close</button>
        </div>
      </div>
    </div>
  );
}





