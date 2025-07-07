"use client";

import { useState, useEffect } from "react";
import "./Loader.css";
import loaderGif from "../assets/LoaderGif.gif"; // Update path as needed

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds, then hide loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null; // Hide loader after timeout

  return (
    <div className="loader-container fullscreen">
      <img src={loaderGif} alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;
