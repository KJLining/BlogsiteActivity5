import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  currentUser?: string;
};

export default function EditPost({ currentUser }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing post
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then((post) => {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setImage(post.image);
        setAuthor(post.author);
      })
      .catch(() => alert("Failed to load post"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to edit a post");
      return;
    }

    if (currentUser !== author) {
      alert("You can only edit your own posts");
      return;
    }

    const res = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        image,
        author: currentUser,
      }),
    });

    if (!res.ok) {
      alert("Failed to update post");
      return;
    }

    navigate(`/posts/${id}`);
  };

  if (loading) return <p className="text-center mt-5">Loading post...</p>;

  return (
    <div className="container pt-5 mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">Edit Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Cover Image URL</label>
          <input
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Content</label>
          <textarea
            className="form-control"
            rows={6}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <button className="btn btn-dark">Save Changes</button>
      </form>
    </div>
  );
}
