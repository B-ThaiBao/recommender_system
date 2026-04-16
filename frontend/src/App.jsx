import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Grades from './pages/Grades';
import Recommendations from './pages/Recommendations';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="grades" element={<Grades />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
