import React from "react";
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import Footer from "./components/Footer";
import RequestBook from "./components/RequestBook";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [cookies, setCookie] = useCookies();
  console.log(cookies)
  return (
    <React.Fragment>
      <Header auth={cookies.username != null} usertype={cookies.usertype} />
      <Routes>
        <Route exact path='/' element={<PrivateRoute auth={cookies.username != null} redirectpath="login" />} >
          <Route exact path="/" element={<Home />} />
          <Route exact path="/requestbook" element={<RequestBook />} />
          <Route exact path="/logout" element={<Logout />}/>
        </Route>
        <Route path="/about" element={<About />} exact />
        <Route exact path='/' element={<PrivateRoute auth={cookies.username == null} redirectpath="/" />} >
          <Route path="/login" element={<Login />} exact />
          <Route path="/register" element={<Register />} exact />
        </Route>
      </Routes>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
