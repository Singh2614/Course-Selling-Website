import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">LEARN • BUILD • GROW</span>
        <h1>Learn skills that move your career forward.</h1>
        <p>
          Discover practical courses taught for developers, creators and
          ambitious learners.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" to="/courses">Explore Courses</Link>
          <Link className="secondary-button" to="/signup">Create Account</Link>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-top">
          <span>Featured learning</span>
          <span>4.9 ★</span>
        </div>
        <h2>Build real projects.</h2>
        <p>Go from fundamentals to production-ready skills with focused courses.</p>
        <div className="mini-stats">
          <div><strong>10+</strong><span>Courses</span></div>
          <div><strong>24/7</strong><span>Access</span></div>
          <div><strong>100%</strong><span>Online</span></div>
        </div>
      </div>
    </section>
  );
}
