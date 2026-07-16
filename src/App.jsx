import React from "react";
import Navbar from "./Component/Navbar/Navbar";
import Head from "./Component/Home/head";
import Terminal from "./Component/Dashboard/Terminal";
import { Route, Routes } from "react-router";
import Strategy from './Component/Strategy/Strategy';
import UploadStrategy from './Component/Strategy/UploadStrategy';

const App = () => {
  return (
    <>
      <Navbar />

      <main className="pt-18 font-sans">
        <Routes>
          <Route path="/" element={<Head />} />
          <Route path="/Dashboard" element={<Terminal />} />
          <Route path="/strategy" element={ <Strategy/>} />
          <Route path="/UploadStrategy" element={ <UploadStrategy />} />
        </Routes>
      </main>
    </>
  );
};

export default App;