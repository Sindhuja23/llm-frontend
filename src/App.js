import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Summarize from './components/Summarize';

function App() {
  return <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/summarize" element={<Summarize />} />
    </Routes>
  </Router>
}

export default App;
