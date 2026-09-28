import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import CourseCard from "../components/CourseCard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

function MyCoursesContent() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/purchases")
      .then((response) => setCourses(response.data.courses))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="center-message">Loading your courses...</div>;
  }

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR LEARNING</span>
          <h1>My Courses</h1>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty">
          <h3>You haven't purchased a course yet.</h3>
          <p>Explore the course library to get started.</p>
          <Link className="primary-button" to="/courses">Explore Courses</Link>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function MyCourses() {
  return (
    <ProtectedRoute>
      <MyCoursesContent />
    </ProtectedRoute>
  );
}
