import React from "react";
import { Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// Auth Components
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from "./components/Auth/Login";
import Logout from "./components/Auth/Logout";

// User Components
import UserForm from "./components/User/UserForm";

// Book Components
import BookForm from "./components/Book/BookForm";

import Header from "./components/Header";
import About from "./components/About";
import Footer from "./components/Footer";
import Datatable from './components/Datatable';

import NotFound from './components/NotFound';

function App() {
  const [cookies] = useCookies();
  console.log("Printing cookies in react App.js")
  console.log(cookies)
  return (
    <React.Fragment>
      <Header auth={cookies.username != null} usertype={cookies.usertype} />
      <Routes>
        <Route path="/" element={<PrivateRoute auth={cookies.username != null} redirectpath="login" />} >
          <Route exact path="/" element={<Datatable pagetype="home" title="All book requests" />} />
          <Route exact path="books" element={<Datatable pagetype="home" title="All book requests" />} />
          <Route exact path="bookhistory/:id" element={<Datatable pagetype="bookhistory" title="Book history" />} />
          <Route exact path="books" element={<PrivateRoute auth={cookies.usertype === "user"} redirectpath="/books" />} >
            <Route exact path="new" element={<BookForm pagetype="new" />} />
            <Route exact path=":id" element={<BookForm pagetype="show" />} />
            <Route exact path=":id/edit" element={<BookForm pagetype="edit" />} />
          </Route>
          <Route exact path="users" element={<PrivateRoute auth={cookies.usertype === "admin"} redirectpath="/books" />} >
            <Route index element={<Datatable pagetype="users" title="All users" />} />
            <Route exact path="new" element={<UserForm usertype="admin"/>} />
          </Route>
          <Route exact path="logout" element={<Logout />} />
        </Route>
        <Route exact path="/about" element={<About />} />
        <Route path="/" element={<PrivateRoute auth={cookies.username == null} redirectpath="/" />} >
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<UserForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
