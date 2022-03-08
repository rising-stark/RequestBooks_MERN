import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  // console.log(JSON.stringify(props))
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow">
      <div className="collapse navbar-collapse px-3">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {
            props.auth ?
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
            :
              <>
              </>
          }
          {
            props.usertype === "user" ?
              <li className="nav-item">
                <NavLink className="nav-link" to="/requestbook">Request a book</NavLink>
              </li>
            :
              props.usertype === "admin" ?
                <li className="nav-item">
                  <NavLink className="nav-link" to="/addemployee">Register new employee</NavLink>
                </li>
              :
                <>
                </>
          }
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">About Us</NavLink>
          </li>
        </ul>
        <NavLink className="navbar-brand fw-bolder fs-2 mx-auto" to="/">RBO</NavLink>

        {
          props.auth ?
          <>
            <NavLink to="/logout" className="btn btn-outline-primary ms-2 px-4 rounded-pill">Logout</NavLink>
          </>
          :
          <>
            <NavLink to="/login" className="btn btn-outline-primary ms-auto px-4 rounded-pill">Login</NavLink>
            <NavLink to="/register" className="btn btn-outline-primary ms-2 px-4 rounded-pill">Register</NavLink>
          </>
        }
      </div>
    </nav>
  );
}

export default Header;