import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((response) => setCourse(response.data.course))
      .catch(() => setCourse(null));
  }, [id]);

  async function purchase() {
    if (!user) {
      navigate("/signin");
      return;
    }

    setBuying(true);
    setMessage("");

    try {
      await api.post("/users/purchase", { courseId: id });
      setMessage("Course purchased successfully. You can find it in My Courses.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Purchase failed.");
    } finally {
      setBuying(false);
    }
  }

  if (!course) {
    return <div className="center-message">Course not found.</div>;
  }

  return (
    <section className="details-page">
      <div className="details-image">
        <img
          src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"}
          alt={course.title}
        />
      </div>

      <div className="details-content">
        <span className="pill">Online Course</span>
        <h1>{course.title}</h1>
        <p className="details-description">{course.discription}</p>

        <div className="price-box">
          <span>Course price</span>
          <strong>₹{course.price}</strong>
        </div>

        <button className="primary-button full" onClick={purchase} disabled={buying}>
          {buying ? "Processing..." : "Purchase Course"}
        </button>

        {message && <div className="notice">{message}</div>}

        <Link className="back-link" to="/courses">← Back to courses</Link>
      </div>
    </section>
  );
}
