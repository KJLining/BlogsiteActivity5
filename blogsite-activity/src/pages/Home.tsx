import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = {
  isLoggedIn: boolean;
};

type Post = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string; // IMPORTANT for sorting
};

export default function Home({ isLoggedIn }: Props) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/posts");
        const data: Post[] = await res.json();

        // SORT BY NEWEST FIRST
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        // TAKE ONLY 5 MOST RECENT
        setRecentPosts(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-5 mt-5">

      {/* HERO */}
      <section className="py-5 text-center border-bottom">
        <div className="container">
          <h1 className="display-4 fw-bold">
            {isLoggedIn ? "Welcome Back!" : "Welcome to BlogSite"}
          </h1>

          <p className="lead mt-3">
            {isLoggedIn
              ? "Ready to share something or continue reading?"
              : "Read blogs or create an account to start posting."}
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            {isLoggedIn ? (
              <Link to="/create-post" className="btn btn-dark btn-lg">
                Create Post
              </Link>
            ) : (
              <Link
                to={isLoggedIn ? "/create-post" : "/register"}
                className="btn btn-dark btn-lg"
              >
                {isLoggedIn ? "Create Post" : "Get Started"}
              </Link>

            )}

            <Link to="/posts" className="btn btn-outline-dark btn-lg">
              Browse Posts
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="py-5">
        <div className="container">
          <h3 className="fw-bold mb-4">Recent Posts</h3>

          {loading ? (
            <p>Loading posts...</p>
          ) : recentPosts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            recentPosts.map(post => (
              <div
                key={post.id}
                className="d-flex gap-3 mb-4 pb-3 border-bottom"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                  className="rounded"
                />

                <div>
                  <h5>{post.title}</h5>
                  <p className="mb-2">{post.excerpt}</p>

                  {isLoggedIn ? (
                    <Link
                      to={`/posts/${post.id}`}
                      className="btn btn-sm btn-dark"
                    >
                      Read Full Post
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn-sm btn-outline-dark"
                    >
                      Login to Read
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
