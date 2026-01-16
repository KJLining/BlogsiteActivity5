import { Link } from "react-router-dom";

type Props = {
  currentUser?: string;
};

export default function ProfilePage({ currentUser }: Props) {
  // VISUAL ONLY (will be replaced by backend later)
  const user = {
    name: currentUser || "John Doe",
    email: currentUser
      ? `${currentUser.toLowerCase()}@email.com`
      : "johndoe@email.com",
    joined: "January 2024",
  };

  return (
    <div className="container pt-5 mt-5">

      {/* PROFILE HEADER */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="fw-bold">{user.name}</h1>
          <p className="text-muted mb-1">{user.email}</p>
          <p className="text-muted small">
            Joined {user.joined}
          </p>
        </div>

        <div className="col-md-4 text-md-end">
          <Link to="/create-post" className="btn btn-dark">
            + New Post
          </Link>
        </div>
      </div>

      <hr />

      {/* MY POSTS */}
      <h3 className="fw-bold mb-3">My Posts</h3>

      <div className="row g-4">

        {/* POST CARD */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <img
              src="https://picsum.photos/600/300?profile1"
              className="card-img-top"
              alt="Post"
            />

            <div className="card-body d-flex flex-column">
              <h5 className="card-title">My First Blog Post</h5>

              <p className="text-muted small">
                January 1, 2025
              </p>

              <p className="card-text">
                Short preview of your post content.
              </p>

              <div className="mt-auto d-flex justify-content-between align-items-center">
                <Link to="/posts/1" className="btn btn-outline-dark btn-sm">
                  View
                </Link>

                <div className="d-flex gap-2">
                  <Link
                    to="/edit-post/1"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Edit
                  </Link>

                  <button className="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POST CARD */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <img
              src="https://picsum.photos/600/300?profile2"
              className="card-img-top"
              alt="Post"
            />

            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Another Post</h5>

              <p className="text-muted small">
                December 20, 2024
              </p>

              <p className="card-text">
                Another short preview of your article.
              </p>

              <div className="mt-auto d-flex justify-content-between align-items-center">
                <Link to="/posts/2" className="btn btn-outline-dark btn-sm">
                  View
                </Link>

                <div className="d-flex gap-2">
                  <Link
                    to="/edit-post/2"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Edit
                  </Link>

                  <button className="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
