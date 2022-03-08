import React from "react";
import { Routes, Route } from 'react-router-dom';
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
  const [cookies] = useCookies();
  console.log("Printing cookies in react App.js")
  console.log(cookies)
  return (
    <React.Fragment>
      <Header auth={cookies.username != null} usertype={cookies.usertype} />
      <Routes>
        <Route exact path='/' element={<PrivateRoute auth={cookies.username != null} redirectpath="login" />} >
          <Route exact path="/" element={<Home />} />
          <Route exact path='/' element={<PrivateRoute auth={cookies.usertype === "user"} redirectpath="/" />} >
            <Route exact path="/requestbook" element={<RequestBook />} />
          </Route>
          <Route exact path='/' element={<PrivateRoute auth={cookies.usertype === "admin"} redirectpath="/" />} >
            <Route exact path="/addemployee" element={<Register usertype = "admin"/>} />
          </Route>
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
