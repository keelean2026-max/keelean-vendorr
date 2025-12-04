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
// import OrdersPage from "./Pages/Orders/OrdersPage"; // create or uncomment if exists

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
       <Route path="/upload-document" element={<UploadDocument />} />
       <Route path="/Info" element={<Info/>}/>
      <Route path="/Toggleline" element={<Toggleline/>}/>
      <Route path="/CustomerOrder" element={<CustomerOrder/>}/>
      <Route path="/sidebar" element={<Sidebar/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
    </Routes>
  );
}

export default App;
