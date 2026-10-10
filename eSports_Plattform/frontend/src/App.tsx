
import './App.css'

import {Routes, Route } from "react-router-dom";
import Startseite from "./pages/Startseite";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Startseite />} />
      </Routes>
  );
}

export default App;