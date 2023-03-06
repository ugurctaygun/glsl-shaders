import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Scene from "./Scene";
import BlendingColors from "./Shaders/BlendingColors";

function App() {
  return (
    <div className="App">
      <Scene />
      <BlendingColors />
    </div>
  );
}

export default App;
