import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/Main.jsx';
import AuthPage from './pages/Auth.jsx';
import ContactsPage from './pages/Contacts.jsx';
import ProfilePage from './pages/Profile.jsx';

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>  
    </>
  );
}