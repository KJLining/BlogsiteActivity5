import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

export default function Posts({
  isLoggedIn = false,
  currentUser,
}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH POSTS (SAFE)
  ======================= */
  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  /* =======================
     DELETE POST
  ======================= */
  const handleDelete = async (postId: number, author: string) => {
    if (!currentUser || currentUser !== author) {
      alert("You can only delete your own posts");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/posts/${postId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author: currentUser }),
        }
      );

      if (!res.ok) {
        alert("Failed to delete post");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Server error");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading posts...</p>;
  }

  return (
    <div className="pt-5 mt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">All Posts</h2>
          {isLoggedIn && (
            <Link to="/create-post" className="btn btn-dark">
              Create Post
            </Link>
          )}
        </div>

        <div className="row g-4">
          {posts.length === 0 && (
            <p className="text-center mt-5">
              No posts available.
            </p>
          )}

          {posts.map((post) => (
            <div key={post.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                <img
                  src={post.image}
                  className="card-img-top"
                  alt={post.title}
                />

                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>

                  <p className="text-muted small">
                    Posted by {post.author} •{" "}
                    {new Date(post.date).toLocaleDateString()}
                  </p>

                  <p>{post.excerpt}</p>

                  <div className="d-flex gap-2">
                    <Link
                      to={
                        isLoggedIn
                          ? `/posts/${post.id}`
                          : "/login"
                      }
                      className="btn btn-outline-dark btn-sm"
                    >
                      {isLoggedIn ? "Read More" : "Login to Read"}
                    </Link>

                    {isLoggedIn && currentUser === post.author && (
                      <>
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(post.id, post.author)
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
