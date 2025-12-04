// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./Pages/SignUp/SignUp";
import UploadDocument from "./Pages/SignUp/UploadDocument";
// import Info from "./Pages/SignUp/Info";
// import Toggleline from "./Pages/Toggleline/Toggleline";
// import CustomerOrder from "./Components/dataTable/CustomerOrder";

import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard/Dashboard";
// import OrdersPage from "./Pages/Orders/OrdersPage"; // create or uncomment if exists

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar always visible (it accepts panelContent to show a mini-dashboard on the right of the icon rail) */}
      <Sidebar panelContent={<Dashboard />} />

      {/* Main app area (routes render here) */}
      <main className="flex-1 bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          <Routes>
            {/* default root -> signup or dashboard; adjust as you prefer */}
            <Route path="/" element={<SignUp />} />
            <Route path="/upload-document" element={<UploadDocument />} />

            {/* dashboard route */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* other app pages (uncomment when created) */}
            {/* <Route path="/orders" element={<OrdersPage />} /> */}
            {/* <Route path="/info" element={<Info />} /> */}
            {/* <Route path="/toggleline" element={<Toggleline />} /> */}
            {/* <Route path="/customer-order" element={<CustomerOrder />} /> */}

            {/* fallback: redirect unknown paths to dashboard (or 404 page) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
