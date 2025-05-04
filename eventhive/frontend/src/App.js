import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'; // ✅ now correct

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage/>} />

        {/* Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute isAuthenticated={true}>
              <DashboardPage />
            </PrivateRoute>
          } 
        />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;


