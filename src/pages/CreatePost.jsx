// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { EditorState, convertToRaw } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import DOMPurify from "dompurify";
// import { toast } from "react-toastify";

// const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// export default function CreatePost() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [title, setTitle] = useState("");
//   const [summary, setSummary] = useState("");
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   const [coverFile, setCoverFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // refs for lifecycle / aborting
//   const isMounted = useRef(true);
//   const pendingControllers = useRef([]); // store AbortControllers for pending fetches

//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       // mark unmounted and abort any pending fetches
//       isMounted.current = false;
//       pendingControllers.current.forEach((c) => {
//         try {
//           c.abort();
//         } catch (e) {
//           /* ignore */
//         }
//       });
//       pendingControllers.current = [];
//     };
//   }, []);

//   // Editor change
//   const onEditorStateChange = (st) => setEditorState(st);

//   // Helper to create headers object (only Authorization if token exists)
//   const authHeaders = () => {
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   // react-draft-wysiwyg image upload callback with abort handling and no post-unmount setState
//   const uploadImageCallBack = (file) => {
//     return new Promise(async (resolve, reject) => {
//       const controller = new AbortController();
//       pendingControllers.current.push(controller);

//       try {
//         const fd = new FormData();
//         fd.append("file", file);

//         const res = await fetch(`${BASE}/api/uploads`, {
//           method: "POST",
//           headers: authHeaders(), // don't set Content-Type for FormData
//           body: fd,
//           signal: controller.signal,
//         });

//         // parse response safely; if the request was aborted, this will throw
//         const json = await res.json().catch(() => ({}));

//         // remove controller from pending list
//         pendingControllers.current = pendingControllers.current.filter(
//           (c) => c !== controller
//         );

//         if (!res.ok) {
//           // surface server message if present
//           const errMsg = json?.error || json?.message || `Upload failed (${res.status})`;
//           // If component is unmounted, just reject (no state updates)
//           if (!isMounted.current) return reject(errMsg);
//           return reject(errMsg);
//         }

//         const imageUrl = json.url || json.secure_url || json.data?.secure_url;
//         if (!imageUrl) {
//           const errMsg = "Upload succeeded but no URL returned";
//           if (!isMounted.current) return reject(errMsg);
//           return reject(errMsg);
//         }

//         // Only resolve if component is still mounted — otherwise reject to avoid UI updates
//         if (!isMounted.current) {
//           return reject("Upload canceled (component unmounted)");
//         }

//         // react-draft-wysiwyg expects { data: { link: "..." } }
//         resolve({ data: { link: imageUrl } });
//       } catch (err) {
//         // remove controller from pending list (in case of error/abort)
//         pendingControllers.current = pendingControllers.current.filter(
//           (c) => c !== controller
//         );

//         // If fetch was aborted, err.name === "AbortError"
//         if (!isMounted.current) {
//           return reject("Upload canceled (component unmounted)");
//         }

//         // bubble up useful message
//         reject(err?.message || "Upload error");
//       }
//     });
//   };
// const handleCreatePost = async (e) => {
//   e.preventDefault();
//   if (!title.trim()) { toast.error("Title is required"); return; }

//   const rawContent = convertToRaw(editorState.getCurrentContent());
//   const html = draftToHtml(rawContent);
//   const cleanHtml = DOMPurify.sanitize(html);

//   setLoading(true);
//   try {
//     let coverUrl = null;

//     // 1) If there's a cover file, upload it first to /api/uploads
//     if (coverFile) {
//       const fd = new FormData();
//       fd.append("file", coverFile);

//       const upRes = await fetch(`${BASE}/api/uploads`, {
//         method: "POST",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         body: fd,
//       });

//       const upJson = await upRes.json();
//       if (!upRes.ok) throw new Error(upJson.error || upJson.message || "Cover upload failed");
//       coverUrl = upJson.url || upJson.secure_url || upJson.data?.secure_url;
//     }

//     // 2) Now send JSON to /api/posts
//     const postBody = { title, summary, content: cleanHtml };
//     if (coverUrl) postBody.coverUrl = coverUrl;

//     const res = await fetch(`${BASE}/api/posts`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(postBody),
//     });

//     const json = await res.json();
//     if (!res.ok) throw new Error(json.error || json.message || `Create failed (${res.status})`);

//     toast.success("Post created");
//     if (json.slug) navigate(`/post/${json.slug}`);
//     else if (json._id) navigate(`/post/${json._id}`);
//     else navigate("/");
//   } catch (err) {
//     console.error(err);
//     toast.error(err.message || "Error creating post");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Create Post</h1>

//       <form onSubmit={handleCreatePost} className="space-y-4">
//         <input
//           className="w-full border rounded px-3 py-2"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <input
//           className="w-full border rounded px-3 py-2"
//           placeholder="Short summary (optional)"
//           value={summary}
//           onChange={(e) => setSummary(e.target.value)}
//         />

//         <div>
//           <Editor
//             editorState={editorState}
//             toolbarClassName="toolbarClassName"
//             wrapperClassName="wrapperClassName"
//             editorClassName="editorClassName"
//             onEditorStateChange={onEditorStateChange}
//             toolbar={{
//               image: {
//                 uploadCallback: uploadImageCallBack,
//                 previewImage: true,
//                 alt: { present: true, mandatory: false },
//               },
//               options: [
//                 "inline",
//                 "blockType",
//                 "fontSize",
//                 "list",
//                 "link",
//                 "embedded",
//                 "image",
//                 "remove",
//                 "history",
//               ],
//             }}
//           />
//         </div>

//         <div>
//           <label className="block text-sm mb-1">Cover image (optional)</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setCoverFile(e.target.files[0])}
//           />
//         </div>

//         <div>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
//             disabled={loading}
//           >
//             {loading ? "Posting..." : "Publish"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CreatePost() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onEditorStateChange = (st) => setEditorState(st);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await fetch(`${BASE}/api/uploads/cover`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errorJson = await res.json();
      throw new Error(errorJson.error || errorJson.message || `Upload failed (${res.status})`);
    }

    const json = await res.json();
    const coverurl = json.secure_url || json.url || json.data?.secure_url;
    if (!coverurl) throw new Error("Upload succeeded but no URL returned");
    return coverurl;
  };

  const uploadImageCallBack = async (file) => {
    try {
      const url = await uploadFile(file);
      return { data: { link: url } };
    } catch (err) {
      return Promise.reject(err.message || "Image upload failed");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const cleanHtml = DOMPurify.sanitize(html);

    setLoading(true);
    try {
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadFile(coverFile);
      }

      const postBody = { title, summary, content: cleanHtml };
      if (coverUrl) postBody.coverUrl = coverUrl;

      const res = await fetch(`${BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(postBody),
      });

      const json = await (res.ok ? res.json() : res.json().catch(() => ({})));
      if (!res.ok) throw new Error(json.error || json.message || `Create failed (${res.status})`);

      toast.success("Post created");
      if (json.slug) navigate(`/post/${json.slug}`);
      else if (json._id) navigate(`/post/${json._id}`);
      else navigate("/");
    } catch (err) {
      toast.error(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="bw-grid-bg min-h-screen p-8 flex items-center justify-center">

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">✍️ Create a New Post</h1>

        <form onSubmit={handleCreatePost} className="space-y-5">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Write a short summary (optional)..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          <div className="border border-gray-300 rounded-lg overflow-hidden">
<Editor
  editorState={editorState}
  toolbarClassName="bg-gray-50 border-b border-gray-200"
  wrapperClassName="wrapperClassName"
  editorClassName="editor-content px-3 min-h-[200px] focus:outline-none"
  editorStyle={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", fontSize: '16px', color: '#111', lineHeight: 1.6 }}
  onEditorStateChange={onEditorStateChange}
  toolbar={{
    image: {
      uploadCallback: uploadImageCallBack,
      previewImage: true,
      alt: { present: true, mandatory: false },
    },
  }}
/>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="w-full text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "🚀 Posting..." : "📢 Publish Post"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
