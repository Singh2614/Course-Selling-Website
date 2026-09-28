import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <img
        src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"}
        alt={course.title}
      />

      <div className="course-content">
        <span className="pill">Online Course</span>
        <h3>{course.title}</h3>
        <p>{course.discription}</p>

        <div className="course-footer">
          <strong>₹{course.price}</strong>
          <Link to={`/courses/${course._id}`}>View course →</Link>
        </div>
      </div>
    </article>
  );
}
