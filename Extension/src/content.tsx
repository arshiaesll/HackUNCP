import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "20px",
        backgroundColor: "#282c34",
        color: "white",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      🎉 Hello from React!
    </div>
  );
};

// Create container in the page
const rootContainer = document.createElement("div");
document.body.appendChild(rootContainer);

// Render the app
const root = createRoot(rootContainer);
root.render(<App />);
