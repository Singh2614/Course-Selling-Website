import { useEffect, useState } from "react";
import api from "../api.js";
import CourseCard from "../components/CourseCard.jsx";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then((response) => setCourses(response.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">COURSE LIBRARY</span>
          <h1>Explore courses</h1>
        </div>
        <p>Choose a course and start learning today.</p>
      </div>

      {loading ? (
        <div className="center-message">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty">No courses available yet.</div>
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
