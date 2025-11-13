// src/App.tsx

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Ensure this is imported
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ScrollToTop';
import GoToTop from './components/GoToTop';
import FloatingSocials from './components/FloatingSocials';
// import ReviewsPage from './pages/ReviewsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PrivateRoute from './components/PrivateRoute'; // Ensure this is imported
import MainLayout from './components/MainLayout';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogManager from './pages/admin/BlogManager';
import BlogDetailPage from './pages/BlogDetailPage';
import ServiceDetails from './pages/ServiceDetails';

const App: React.FC = () => {
  return (
    <AuthProvider> {/* AuthProvider should wrap your entire routing */}
      <HashRouter>
          <ScrollToTop />
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
          </Route>

          {/* Admin Routes (No Main Layout for Login/Dashboard) */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute> {/* Use PrivateRoute to protect the dashboard */}
                <AdminDashboardPage />
              </PrivateRoute>
            } 
          />
          {/* Optional: Add a catch-all for 404 */}
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;