import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth pages
import Login    from './pages/Login';
import Register from './pages/Register';

// App pages
 
import Dashboard      from './pages/Dashboard';
import GardenPlots    from './pages/GardenPlots';
import AddPlot        from './pages/AddPlot';
import EditPlot       from './pages/EditPlot';
import Plants         from './pages/Plants';
import AddPlant       from './pages/AddPlant';
import EditPlant      from './pages/EditPlant';
import WateringSchedule from './pages/WateringSchedule';
import Events         from './pages/Events';
import AddEvent       from './pages/AddEvent';
import EditEvent      from './pages/EditEvent';
import Members        from './pages/Members';
import Profile        from './pages/Profile';

import './styles/global.css';

/**
 * Shell layout: sidebar + navbar + page content.
 * Shown for all authenticated routes.
 */
const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes wrapped in AppShell */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppShell><Dashboard /></AppShell>
          </ProtectedRoute>
        } />

        {/* Garden Plots */}
        <Route path="/plots" element={
          <ProtectedRoute>
            <AppShell><GardenPlots /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/plots/add" element={
          <ProtectedRoute adminOnly>
            <AppShell><AddPlot /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/plots/edit/:id" element={
          <ProtectedRoute adminOnly>
            <AppShell><EditPlot /></AppShell>
          </ProtectedRoute>
        } />

        {/* Plants */}
        <Route path="/plants" element={
          <ProtectedRoute>
            <AppShell><Plants /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/plants/add" element={
          <ProtectedRoute>
            <AppShell><AddPlant /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/plants/edit/:id" element={
          <ProtectedRoute>
            <AppShell><EditPlant /></AppShell>
          </ProtectedRoute>
        } />

        {/* Watering */}
        <Route path="/watering" element={
          <ProtectedRoute>
            <AppShell><WateringSchedule /></AppShell>
          </ProtectedRoute>
        } />

        {/* Events */}
        <Route path="/events" element={
          <ProtectedRoute>
            <AppShell><Events /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/events/add" element={
          <ProtectedRoute adminOnly>
            <AppShell><AddEvent /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/events/edit/:id" element={
          <ProtectedRoute adminOnly>
            <AppShell><EditEvent /></AppShell>
          </ProtectedRoute>
        } />

        {/* Members — admin only */}
        <Route path="/members" element={
          <ProtectedRoute adminOnly>
            <AppShell><Members /></AppShell>
          </ProtectedRoute>
        } />

        {/* Profile */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppShell><Profile /></AppShell>
          </ProtectedRoute>
        } />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
