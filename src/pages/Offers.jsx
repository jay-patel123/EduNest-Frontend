import React from "react";
import Navbar from "../components/Navbar";
import "../assets/styles/Offers.css";

const Offers = () => {
  return (
    <>
      <Navbar />
      <div className="offers-container">
        <h1 className="offers-title">Exclusive Offers</h1>
        <div className="offer-card">
          <h2>New User Offer</h2>
          <p>
            Sign up and get 10 reward points free.
          </p>
        </div>
        <div className="offer-card">
          <h2>Monthly Bonus</h2>
          <p>
            Every Month get 50 reward points as a bonus.
          </p>
        </div>
        <div className="offer-card">
          <h2>Full Course Perchase offer</h2>
          <p>
            Perchase a Full Course and save 20%.
          </p>
        </div>
      </div>
    </>
  );
};

export default Offers;