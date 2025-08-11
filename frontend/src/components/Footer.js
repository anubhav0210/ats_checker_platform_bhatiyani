import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center",
        padding: "10px",
        zIndex: 1000
      }}
    >
      © {new Date().getFullYear()} Ats Checker. All rights reserved.
    </footer>
  );
};

export default Footer;
