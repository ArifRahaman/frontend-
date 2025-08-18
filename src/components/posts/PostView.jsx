import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * PostView.jsx
 * - Full file: fetch post, show author, follow/unfollow, likes, comments
 */

export default function PostView() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // post + UI state
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // interactions
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);

  // follow-related
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followProcessing, setFollowProcessing] = useState(false);

  const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const token = localStorage.getItem("token") || null;

  // read stored user robustly (works with {"id":..} or {"_id":..})
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  })();
  const currentUserId =
    (storedUser && (storedUser._id || storedUser.id)) ||
    localStorage.getItem("id") ||
    null;

  // helper: normalize author id whether it's object or string
  function getAuthorId(author) {
    if (!author) return null;
    if (typeof author === "string") return author;
    return author._id || author.id || null;
  }

  // image helper (local)
  function resolveImageUrl(url) {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE}${url}`;
  }

  // Fetch the post by slug
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE}/api/posts/${encodeURIComponent(slug)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.status === 404) {
          setError("Post not found");
          setPost(null);
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to fetch post (${res.status})`);
        }

        const data = await res.json();
        setPost(data);

        // initial likes/comments
        setLikes(Number(data.likes || 0));
        setComments(Array.isArray(data.comments) ? data.comments : []);

        // derive follower info if author includes followers
        const author = data.author || {};
        let fc = 0;
        if (Array.isArray(author.followers)) {
          fc = author.followers.length;
          setIsFollowing(currentUserId ? author.followers.map(String).includes(String(currentUserId)) : false);
        } else if (typeof author.followers === "number") {
          fc = author.followers;
          setIsFollowing(false);
        } else {
          fc = author.followersCount || author.followerCount || 0;
          setIsFollowing(false);
        }
        setFollowerCount(fc);
      } catch (err) {
        console.error("fetchPost error:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, token, currentUserId]);

  // When post is available, fetch authoritative followers for the author
  useEffect(() => {
    if (!post) return;

    const authorId = getAuthorId(post.author);
    const authorUsername = post.author && (post.author.username || post.author.name);

    async function fetchFollowersForAuthor() {
      const attempts = [];
      if (authorId) attempts.push(`${BASE}/api/users/${authorId}/followers`);
      if (authorUsername) attempts.push(`${BASE}/api/users/${authorUsername}/followers`);
      if (authorId) attempts.push(`${BASE}/api/users/${authorId}`);

      let got = false;
      for (const url of attempts) {
        try {
          const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) continue;
          const json = await res.json().catch(() => ({}));

          // array response => followers list
          if (Array.isArray(json)) {
            setFollowerCount(json.length);
            setIsFollowing(
              Boolean(currentUserId) && json.map(String).includes(String(currentUserId))
            );
            got = true;
            break;
          }

          // { followers: [...] }
          if (json && Array.isArray(json.followers)) {
            setFollowerCount(json.followers.length);
            setIsFollowing(
              Boolean(currentUserId) && json.followers.map(String).includes(String(currentUserId))
            );
            // merge any returned author fields
            if (json._id || json.username) {
              setPost((p) => (p ? { ...p, author: { ...p.author, ...json } } : p));
            }
            got = true;
            break;
          }

          // user object with followers or followersCount
          if (json && (json._id || json.username) && (json.followers || typeof json.followersCount !== "undefined")) {
            const count = Array.isArray(json.followers)
              ? json.followers.length
              : json.followersCount ?? json.followerCount ?? 0;
            setFollowerCount(count);
            if (Array.isArray(json.followers)) {
              setIsFollowing(json.followers.map(String).includes(String(currentUserId)));
            }
            setPost((p) => (p ? { ...p, author: { ...p.author, ...json } } : p));
            got = true;
            break;
          }
        } catch (err) {
          console.warn("fetch followers attempt failed for", url, err);
        }
      }

      if (!got) {
        console.warn("Could not fetch followers for author", authorId || authorUsername);
      }
    }

    fetchFollowersForAuthor();
  }, [post, token, currentUserId]);

  // FOLLOW / UNFOLLOW (toggle) with optimistic UI and merge fallback
  async function handleFollow() {
    if (!token) {
      toast.error("Please log in to follow users");
      return;
    }

    const authorId = getAuthorId(post?.author);
    if (!authorId) {
      toast.error("Author not found");
      return;
    }

    if (currentUserId && String(currentUserId) === String(authorId)) {
      toast.error("You cannot follow yourself");
      return;
    }

    if (followProcessing) return;
    setFollowProcessing(true);

    const prevFollowing = isFollowing;
    const prevCount = followerCount;
    // optimistic
    setIsFollowing(!prevFollowing);
    setFollowerCount((c) => (prevFollowing ? Math.max(0, c - 1) : c + 1));

    try {
      const res = await fetch(`${BASE}/api/users/${authorId}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const body = await res.json().catch(() => ({}));
      console.log("follow response:", body);

      if (!res.ok) throw new Error(body.error || `Failed to follow user (${res.status})`);

      // If backend gave canonical follower info, use it
      if (typeof body.followerCount !== "undefined" || typeof body.isFollowing !== "undefined" || body.author) {
        if (typeof body.followerCount !== "undefined") setFollowerCount(Number(body.followerCount));
        if (typeof body.isFollowing === "boolean") setIsFollowing(body.isFollowing);

        if (body.author) {
          // merge sanitized author into post state
          setPost((p) => (p ? { ...p, author: { ...p.author, ...body.author } } : p));
          // if author.followers array returned, compute count & isFollowing
          if (Array.isArray(body.author.followers)) {
            setFollowerCount(body.author.followers.length);
            setIsFollowing(body.author.followers.map(String).includes(String(currentUserId)));
          }
        }
      } else if (Array.isArray(body.followers)) {
        // root-level followers array returned
        setFollowerCount(body.followers.length);
        setIsFollowing(body.followers.map(String).includes(String(currentUserId)));
      } else {
        // fallback: re-fetch the post to get canonical author state
        try {
          const postRes = await fetch(`${BASE}/api/posts/${encodeURIComponent(slug)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (postRes.ok) {
            const updatedPost = await postRes.json();
            setPost(updatedPost);
            const a = updatedPost.author || {};
            if (Array.isArray(a.followers)) {
              setFollowerCount(a.followers.length);
              setIsFollowing(a.followers.map(String).includes(String(currentUserId)));
            } else {
              setFollowerCount(a.followersCount ?? a.followerCount ?? prevCount);
            }
          } else {
            console.warn("Could not re-fetch post after follow:", postRes.status);
          }
        } catch (errRefetch) {
          console.warn("Failed to re-fetch post after follow:", errRefetch);
        }
      }

      toast.success(body.message || (prevFollowing ? "Unfollowed" : "Followed"));
    } catch (err) {
      console.error("follow error:", err);
      // rollback optimistic UI
      setIsFollowing(prevFollowing);
      setFollowerCount(prevCount);
      toast.error(err.message || "Failed to update follow status");
    } finally {
      setFollowProcessing(false);
    }
  }

  // LIKE
  async function handleLike() {
    if (!token) {
      toast.error("Please log in to like posts");
      return;
    }
    if (!post?._id) return;

    if (likeProcessing) return;
    setLikeProcessing(true);

    try {
      const res = await fetch(`${BASE}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to like post (${res.status})`);
      }

      const json = await res.json();
      const newLikes = Number(json.likes ?? likes);
      setLikes(newLikes);
      setPost((p) => (p ? { ...p, likes: newLikes } : p));
    } catch (err) {
      console.error("handleLike error:", err);
      toast.error(err.message || "Error toggling like");
    } finally {
      setLikeProcessing(false);
    }
  }

  // ADD COMMENT
  async function handleAddComment(e) {
    e?.preventDefault?.();
    if (!token) {
      toast.error("Please login");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!post?._id) return;

    setCommentSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add comment");
      }

      const createdComment = await res.json();
      setComments((prev) => [...prev, createdComment]);
      setCommentText("");
      toast.success("Comment added");
    } catch (err) {
      console.error("handleAddComment error:", err);
      toast.error(err.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">No post to show.</p>
      </div>
    );
  }

  const cover = resolveImageUrl(post.coverUrl);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 mb-4 inline-flex items-center hover:text-gray-800 transition"
      >
        ← Back
      </button>

      <article className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <div className="text-sm text-gray-500 mt-1">
              By{" "}
              <span className="font-medium text-blue-600">
                {(post.author && (post.author.username || post.author.name)) || post.author || "Unknown"}
              </span>{" "}
              • {new Date(post.createdAt).toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Followers:{" "}
              <span
                className="font-medium text-gray-700 cursor-pointer"
                title="Click to view followers (not implemented)"
              >
                {followerCount ?? 0}
              </span>
            </div>
          </div>

          {/* Follow button */}
          <div className="flex items-center gap-3">
            {(() => {
              const authorId = getAuthorId(post.author);
              const showFollow = currentUserId && authorId && String(currentUserId) !== String(authorId);
              if (!showFollow) {
                // Optionally show "Edit" or nothing when this is your own post
                return null;
              }

              return (
                <button
                  onClick={handleFollow}
                  disabled={followProcessing}
                  aria-pressed={isFollowing}
                  className={`px-4 py-2 rounded-lg font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-300
                    ${isFollowing ? "bg-white text-gray-800 border border-gray-200 shadow-sm" : "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"}`}
                  title={isFollowing ? "Unfollow user" : "Follow user"}
                >
                  {followProcessing ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              );
            })()}
          </div>
        </header>

        {/* Cover Image */}
        {cover && (
          <img
            src={cover}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl mb-6 shadow-sm"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-6 text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {/* Actions Bar */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={likeProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white shadow-sm transition ${
                likeProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              👍 {likeProcessing ? "Liking..." : "Like"}
            </button>
            <span className="text-sm text-gray-700">👍 {likes}</span>
            <span className="text-sm text-gray-700">💬 {comments.length}</span>
          </div>
          <div className="text-sm text-gray-500">
            Tags: {post.tags?.length ? post.tags.join(", ") : "None"}
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet — be the first!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => {
                const username =
                  (c.user && typeof c.user === "object" && c.user.username) ||
                  (typeof c.user === "string" && c.user) ||
                  (c.author && c.author.username) ||
                  "Unknown";

                return (
                  <li key={c._id || c.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.date || c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mt-6 bg-gray-50 p-4 rounded-lg border">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="Write a thoughtful comment..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={commentSubmitting}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setCommentText("")}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={commentSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                disabled={commentSubmitting}
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </section>
      </article>
    </div>
  );
}

