import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import SinglePost from "./pages/SinglePost";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ProfilePage from "./pages/ProfilePage";

import { getUser, isLoggedIn } from "./utils/auth";

export default function App() {
  const user = getUser();
  const loggedIn = isLoggedIn();

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={loggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/posts"
            element={<Posts isLoggedIn={loggedIn} />}
          />

          <Route
            path="/posts/:id"
            element={
              <SinglePost
                isLoggedIn={loggedIn}
                currentUser={user?.name ?? ""}
              />
            }
          />

          <Route
            path="/create-post"
            element={<CreatePost currentUser={user?.name ?? ""} />}
          />

          <Route
            path="/edit-post/:id"
            element={<EditPost currentUser={user?.name ?? ""} />}
          />

          <Route
            path="/profile"
            element={<ProfilePage currentUser={user?.name ?? ""} />}
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}