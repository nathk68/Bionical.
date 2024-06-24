// src/App.tsx
import React from 'react';
import { Button, TextField } from '@mui/material'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Home from './pages/home';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
