import React, { useEffect, useRef } from "react";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const touchStartX = useRef(null);

  // Handle swipe right
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX - touchStartX.current > 80) {
        navigate("/home");
      }
    }
    touchStartX.current = null;
  };

  // For desktop: allow click on button
  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div
      className="welcome-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="welcome-logo">
        <span className="logo-icon">N</span>
        <span className="logo-text">nikie</span>
      </div>
      <div className="welcome-image">
        {/* Replace with your own image or SVG */}
        <img
          src="/assets/welcome-girl.png"
          alt="Welcome style"
          className="welcome-img"
        />
      </div>
      <div className="welcome-content">
        <h1>Find your dream style<br />and start shopping here</h1>
        <p>
          Get exclusive products only at nikie, with the best offers and also a very complete collection
        </p>
        <button className="swipe-btn" onClick={handleStart}>
          <span className="swipe-circle">Swipe to start</span>
          <span className="swipe-arrows">&gt;&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;import React from 'react';
import { useHistory } from 'react-router-dom';
import './WelcomePage.css'; // Assuming you will create a CSS file for the welcome page styles

const WelcomePage = () => {
    const history = useHistory();

    const handleSwipe = () => {
        history.push('/home');
    };

    return (
        <div className="welcome-container" onTouchEnd={handleSwipe}>
            <h1>Welcome to Our Sports Shop!</h1>
            <p>Discover the best sports products just for you.</p>
            <p>Swipe right to enter the shop!</p>
        </div>
    );
};

export default WelcomePage;