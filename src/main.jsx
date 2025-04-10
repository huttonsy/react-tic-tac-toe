import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout"; 
import "./App.css";
import { StrictMode } from "react";
import Home from "./Home"; 
import TicTacToe from "./tic-tac-toe/TicTacToe";
import UserProfile from "./UserProfile"; 
import NotFound from "./NotFound";
import Wordle from "./wordle/wordle";
import RPSContainer from "./rock-paper-scissors/RPSContainer";


ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="game/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="rps" element={<RPSContainer />} />
          <Route path="user/:username" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
