import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Auth from '../pages/Auth/Auth';
import Boards from '../pages/Boards/Boards';
import Board from '../pages/Board/Board';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<Auth />} />
        <Route path="sign-up" element={<Auth />} />
        <Route path="boards" element={<Boards />} />
        <Route path="boards/:slug" element={<Board />} />
      </Routes>
    </Router>
  );
}
