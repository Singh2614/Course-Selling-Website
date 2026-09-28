import { useEffect, useState } from "react";
import api from "../api.js";

export default function Admin() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [courseForm, setCourseForm] = useState({
    title: "",
    discription: "",
    price: "",
    image_url: ""
  });
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");

  async function loadCourses() {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.courses);
    } catch {}
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function signin(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/admin/signin", loginForm);
      localStorage.setItem("adminToken", response.data.token);
      setAdminToken(response.data.token);
      setMessage("Admin signed in.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Admin signin failed.");
    }
  }

  async function createCourse(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/admin/course", {
        ...courseForm,
        price: Number(courseForm.price)
      }, {
        headers: {
          Authorization: `token ${adminToken}`
        }
      });

      setCourseForm({
        title: "",
        discription: "",
        price: "",
        image_url: ""
      });

      setMessage("Course created.");
      loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not create course.");
    }
  }

  async function deleteCourse(id) {
    try {
      await api.delete("/admin/remcourse", {
        headers: {
          Authorization: `token ${adminToken}`,
          courseid: id
        }
      });
      setMessage("Course removed.");
      loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not remove course.");
    }
  }

  if (!adminToken) {
    return (
      <section className="auth-page">
        <form className="auth-card" onSubmit={signin}>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Admin sign in</h1>
          <p>Manage your course catalog.</p>

          <label>Email</label>
          <input
            type="email"
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            required
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />

          {message && <div className="error">{message}</div>}
          <button className="primary-button full">Admin sign in</button>
        </form>
      </section>
    );
  }

  return (
    <section className="page admin-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Manage courses</h1>
        </div>
        <button
          className="secondary-button"
          onClick={() => {
            localStorage.removeItem("adminToken");
            setAdminToken(null);
          }}
        >
          Sign out
        </button>
      </div>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={createCourse}>
          <h2>Add course</h2>

          <label>Title</label>
          <input
            required
            value={courseForm.title}
            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
          />

          <label>Description</label>
          <textarea
            required
            rows="5"
            value={courseForm.discription}
            onChange={(e) => setCourseForm({ ...courseForm, discription: e.target.value })}
          />

          <label>Price</label>
          <input
            required
            type="number"
            min="0"
            value={courseForm.price}
            onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
          />

          <label>Image URL</label>
          <input
            value={courseForm.image_url}
            onChange={(e) => setCourseForm({ ...courseForm, image_url: e.target.value })}
            placeholder="https://..."
          />

          <button className="primary-button full">Create Course</button>
          {message && <div className="notice">{message}</div>}
        </form>

        <div>
          <h2>Current courses</h2>
          <div className="admin-list">
            {courses.map((course) => (
              <div className="admin-course" key={course._id}>
                <div>
                  <strong>{course.title}</strong>
                  <span>₹{course.price}</span>
                </div>
                <button
                  className="danger-button"
                  onClick={() => deleteCourse(course._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
