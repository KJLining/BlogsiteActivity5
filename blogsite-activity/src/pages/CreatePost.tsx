import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Props = {
  currentUser?: string;
};

export default function CreatePost({ currentUser }: Props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to create a post");
      return;
    }

    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        image,
        author: currentUser,
      }),
    });

    if (!res.ok) {
      alert("Failed to create post");
      return;
    }

    navigate("/posts");
  };

  return (
    <div className="pt-5 mt-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold mb-4">Create New Post</h2>

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

          <button className="btn btn-dark">Publish</button>
        </form>
      </div>
    </div>
  );
}
