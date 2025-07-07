import Navbar from "../components/Navbar";
import "../assets/styles/Features.css";

const Features = () => {
  return (
    <div>
      <Navbar />
      <div className="features-container">
        <h1>Features of EduNest</h1>
        <br/>
        <br/>
        <br/>
        <div className="feature-list">
          <div className="feature-card">
            <h2>Module-Wise Course Purchasing</h2>
            <p>Buy only the modules you need, tailored to your learning path.</p>
          </div>
          <div className="feature-card">
            <h2>Customizable Learning Plans</h2>
            <p>Customize your learning experience by setting goals and timelines.</p>
          </div>
          <div className="feature-card">
            <h2>Quiz-Based Rewards</h2>
            <p>Participate in quizzes to earn points and unlock special rewards.</p>
          </div>
        </div>
      </div>
      <br/>
        <br/>
        <br/>
    </div>
  );
};

export default Features;