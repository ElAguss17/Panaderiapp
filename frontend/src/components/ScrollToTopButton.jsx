import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1000,
        background: "#4fc3f7",
        border: "none",
        borderRadius: "50%",
        width: "48px",
        height: "48px",
        boxShadow: "0 8px 8px rgba(0,0,0,0.2)",
        cursor: "pointer",
        fontSize: "2rem",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      aria-label="Subir al principio"
      title="Subir al principio"
    >
      ↑
    </button>
  ) : null;
};

export default ScrollToTopButton;
