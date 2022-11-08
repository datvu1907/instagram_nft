// import logo from './logo.svg';
import "./App.css";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import { AuthProvider } from "./firebase";
import Login from "./pages/login/Login";
// import PrivateRoute from "./PrivateRoute";
import Setting from "./pages/setting/Setting";
import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<PrivateRoute />}></Route> */}
      <Route path="/" element={<Login />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/home" element={<Home />} />
      <Route path="/setting" element={<Setting />} />
    </Routes>
  );
}

export default App;
