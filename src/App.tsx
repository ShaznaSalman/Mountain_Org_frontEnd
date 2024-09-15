import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Checkout from "./screens/Checkout/Checkout";
import Login from "./screens/login/login";
import Dashboard from "./screens/Dashboard/dashboard";
import ConfirmOrder from "./screens/Order/confirmOrder";


const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmOrder" element={<ConfirmOrder />} />
      </Routes>
    </Router>
  );
};

export default App;
