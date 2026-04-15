import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import MainPage from './pages/Main.jsx';
import AuthPage from './pages/Auth.jsx';
import ProfilePage from './pages/Profile.jsx';
import ManagerPage from './pages/Manager.jsx';
import ContactsPage from './pages/Contacts.jsx';
import CreateOrderPage from './pages/CreateOrder.jsx';
import TeamPage from './pages/Team.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute allowedRole={2}><ManagerPage /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute allowedRole={3}><TeamPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}