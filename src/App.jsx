import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Scene from "./Scene";
import BlendingColors from "./Shaders/BlendingColors";
import Flame from "./Shaders/Flame";
import Shapes from "./Shaders/Shapes";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" exact element={<Scene />} />
        <Route path="/blending-colors" element={<BlendingColors />} />
        <Route path="/shapes" element={<Shapes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
