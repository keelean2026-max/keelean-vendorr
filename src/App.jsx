// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./Pages/SignUp/SignUp";
import UploadDocument from "./Pages/SignUp/UploadDocument";
import Info from "./Pages/SignUp/Info";
import Toggleline from "./Pages/Toggleline/Toggleline";
import CustomerOrder from "./Components/dataTable/CustomerOrder";

import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";

/**
 * Simple ProtectedRoute wrapper.
 * Replace the `isAuthenticated` logic with your real auth check (token, context, etc).
 */
function ProtectedRoute({ children }) {
  // Example auth check (change to your real logic)
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // or use context/redux

  if (!isAuthenticated) {
    // if not authenticated, redirect to signup/login ("/")
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<SignUp />} />

      {/* Protected routes */}
      <Route
        path="/upload-document"
        element={
          <ProtectedRoute>
            <UploadDocument />
          </ProtectedRoute>
        }
      />

      <Route
        path="/info"
        element={
          <ProtectedRoute>
            <Info />
          </ProtectedRoute>
        }
      />

      <Route
        path="/toggleline"
        element={
          <ProtectedRoute>
            <Toggleline />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customerorder"
        element={
          <ProtectedRoute>
            <CustomerOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sidebar"
        element={
          <ProtectedRoute>
            <Sidebar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
