import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

type Props = {
  isLoggedIn?: boolean;
  currentUser?: string;
};

type Post = {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
};

type Comment = {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
};

export default function SinglePost({
  isLoggedIn = false,
  currentUser,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH POST
  ======================= */
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then(setPost)
      .catch(() => alert("Failed to fetch post"))
      .finally(() => setLoading(false));
  }, [id]);

  /* =======================
     FETCH COMMENTS
  ======================= */
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/comments?postId=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading post...</p>;
  if (!post) return <p className="text-center mt-5">Post not found.</p>;

  /* =======================
     DELETE POST
  ======================= */
  const handleDeletePost = async () => {
    if (!currentUser || currentUser !== post.author) {
      alert("You can only delete your own posts");
      return;
    }

    if (!confirm("Delete this post?")) return;

    const res = await fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: currentUser }),
    });

    if (res.ok) navigate("/posts");
    else alert("Failed to delete post");
  };

  /* =======================
     ADD COMMENT
  ======================= */
  const handleAddComment = async () => {
    if (!currentUser) return alert("You must be logged in");
    if (!newComment.trim()) return;

    const res = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post.id,
        author: currentUser,
        content: newComment,
      }),
    });

    if (!res.ok) return alert("Failed to add comment");

    const comment = await res.json();
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  /* =======================
     START EDIT COMMENT
  ======================= */
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  /* =======================
     SAVE EDIT COMMENT
  ======================= */
  const saveEdit = async (commentId: number) => {
    if (!editingContent.trim()) return;

    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: currentUser,
        content: editingContent,
      }),
    });

    if (!res.ok) return alert("Failed to update comment");

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, content: editingContent } : c
      )
    );

    setEditingId(null);
    setEditingContent("");
  };

  /* =======================
     DELETE COMMENT
  ======================= */
  const handleDeleteComment = async (commentId: number, author: string) => {
    if (!currentUser || currentUser !== author) {
      alert("You can only delete your own comments");
      return;
    }

    if (!confirm("Delete this comment?")) return;

    const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: currentUser }),
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="pt-5 mt-5">
      <div className="container" style={{ maxWidth: "900px" }}>
        <h1 className="fw-bold">{post.title}</h1>
        <p className="text-muted">
          {post.date} • {post.author}
        </p>

        {isLoggedIn && currentUser === post.author && (
          <div className="mb-3 d-flex gap-2">
            <Link
              to={`/edit-post/${post.id}`}
              className="btn btn-sm btn-outline-secondary"
            >
              Edit
            </Link>
            <button
              onClick={handleDeletePost}
              className="btn btn-sm btn-outline-danger"
            >
              Delete
            </button>
          </div>
        )}

        <img src={post.image} className="img-fluid rounded mb-4" />

        <p>{post.excerpt}</p>

        <hr />

        <h4>Comments</h4>

        {isLoggedIn ? (
          <>
            <textarea
              className="form-control mb-2"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn btn-dark mb-4" onClick={handleAddComment}>
              Post Comment
            </button>
          </>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to comment.
          </p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="border rounded p-3 mb-2">
            <strong>{c.author}</strong>

            {editingId === c.id ? (
              <>
                <textarea
                  className="form-control mb-2"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => saveEdit(c.id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <p className="mb-1">{c.content}</p>
            )}

            {currentUser === c.author && editingId !== c.id && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => startEdit(c)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteComment(c.id, c.author)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
