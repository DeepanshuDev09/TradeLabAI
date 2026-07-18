import React from "react";
import Navbar from "./Component/Navbar/Navbar";
import Head from "./Component/Home/head";
import Terminal from "./Component/Dashboard/Terminal";
import { Route, Routes } from "react-router";
import Strategy from './Component/Strategy/Strategy';
import Features from './Component/Features/Features';
import About from './Component/About/About'


const App = () => {
  return (
    <>
      <Navbar />

      <main className="pt-18 font-sans">
        <Routes>
          <Route path="/" element={<Head />} />
          <Route path="/dashboard" element={<Terminal />} />
          <Route path="/strategy" element={ <Strategy/>} />
          <Route path="/features" element={ <Features />} />
          <Route path="/about" element={ <About />} />
        </Routes>
      </main>
    </>
  );
};

export default App;