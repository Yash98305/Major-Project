import React from "react";

const About = () => {
  return (
    <div
      style={{
        padding: "0px 40px 40px 40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.7",
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
          color: "#2c3e50",
        }}
      >
        About Our Project
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        <strong>Text-to-Image Generation</strong> is an AI-based project designed to generate images
        based on the text prompts provided by users. It is a part of a research initiative under the
        Department of Computer Science, GLA University, authored by <strong>Yash Patel</strong> and{" "}
        <strong>Shray Gupta</strong>.
      </p>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        The system uses advanced machine learning models along with external APIs to convert
        natural language descriptions into visuals. Built using <strong>React.js</strong> on the
        front end, the platform provides a user-friendly interface for creative expression and
        exploration.
      </p>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        The backend handles prompt processing, user authentication, and history management, enabling
        a seamless experience. Our aim is to bridge the gap between imagination and digital art
        through AI.
      </p>

      <p style={{ fontSize: "18px" }}>
        Whether you are an artist, a designer, a student, or simply curious about AI’s creative
        potential — this platform lets you <strong>type your imagination and see it come to life</strong>.
      </p>

      <div style={{ marginTop: "40px", textAlign: "center", color: "#555" }}>
        <p>GLA University | Department of Computer Science</p>
        <p>2025</p>
      </div>
    </div>
  );
};

export default About;
