import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaUser, FaBell, FaCog, FaUsers, FaFacebookMessenger, FaPlusSquare, FaHeart } from "react-icons/fa";
import "../styles/DeveloperHome.css";

const InnovatorHome = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({ text: "", file: null });
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
        alert("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("An error occurred while fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setPostData({ ...postData, file: files[0] });
    } else {
      setPostData({ ...postData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", postData.text);
    if (postData.file) formData.append("file", postData.file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Post created successfully!");
        setIsPostFormOpen(false);
        setPostData({ text: "", file: null });
        fetchPosts();
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  const handleLike = async (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId],
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error liking post");
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: !prevLikes[postId],
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: !prevLikes[postId],
      }));
    }
  };

  const handleUnlike = async (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId],
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/posts/unlike/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error unliking post");
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: !prevLikes[postId],
        }));
      }
    } catch (error) {
      console.error("Error unliking post:", error);
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: !prevLikes[postId],
      }));
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="icon-item"><FaBars size={24} /></li>
            <li className="icon-item"><FaHome size={24} /></li>
            <li className="icon-item"><FaUser size={24} /></li>
            <li className="icon-item"><FaBell size={24} /></li>
            <li className="icon-item"><FaCog size={24} /></li>
            <li className="icon-item"><FaUsers size={24} /></li>
            <li className="icon-item"><FaFacebookMessenger size={24} /></li>
            <li className="icon-item" onClick={() => setIsPostFormOpen(true)}><FaPlusSquare size={24} /></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <h1>Prismonix</h1>
          <input type="text" className="search-bar" placeholder="Search" />
        </header>

        {isPostFormOpen && (
          <div className="post-form-overlay">
            <div className="post-form">
              <h2>Create a Post</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  name="text"
                  placeholder="What's on your mind?"
                  value={postData.text}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  name="file"
                  accept="image/*, video/*"
                  onChange={handleInputChange}
                />
                <button type="submit">Post</button>
                <button type="button" onClick={() => setIsPostFormOpen(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <section className="posts">
          {loading ? (
            <div>Loading posts...</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-container">
                <div className="post-header">
                  <span className="username">{post.user?.firstName} {post.user?.lastName}</span>
                  <span className="time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="post-content">
                  <p>{post.text}</p>
                  {post.file && post.contentType?.startsWith("image") && (
                    <img className="post-image" src={`http://localhost:5000/api/posts/file/${post.file}`} alt="Post" />
                  )}
                  {post.file && post.contentType?.startsWith("video") && (
                    <video className="post-video" controls>
                      <source src={`http://localhost:5000/api/posts/file/${post.file}`} type={post.contentType} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="post-actions">
                  <button
                    className={`like-button ${likes[post._id] ? "liked" : ""}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <FaHeart /> {likes[post._id] ? "Unlike" : "Like"}
                  </button>
                  {likes[post._id] && (
                    <button
                      className="unlike-button"
                      onClick={() => handleUnlike(post._id)}
                    >
                      Unlike
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <aside className="right-sidebar">
        <section className="updates">
          <h3>Updates</h3>
          <div className="update-box"></div>
          <div className="update-box"></div>
        </section>
        <section className="shared-ideas">
          <h3>Shared Ideas</h3>
          <div className="idea-box"></div>
          <div className="idea-box"></div>
        </section>
      </aside>
    </div>
  );
};

export default InnovatorHome;
