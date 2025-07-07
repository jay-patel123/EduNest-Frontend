import React from "react";
import Navbar from "../components/Navbar";
import "../assets/styles/Benefits.css";

const Benefits = () => {
  return (
    <>
      <Navbar />
      <div className="benefits-container">
        <h1 className="benefits-title">Why Choose EduNest?</h1>
        <div className="benefit-card">
          <h2>Customizable Learning</h2>
          <p>
            Purchase modules individually or as a bundle. Choose what you want to learn, and skip what you already know.
          </p>
        </div>
        <div className="benefit-card">
          <h2>Reward-Based System</h2>
          <p>
            Earn points through quizzes and activities. Redeem points for discounts on future courses or exclusive content.
          </p>
        </div>
        <div className="benefit-card">
          <h2>Flexible Learning Schedule</h2>
          <p>
            Learn at your own pace with lifetime access to purchased modules and downloadable resources.
          </p>
        </div>
      </div>
    </>
  );
};

export default Benefits;