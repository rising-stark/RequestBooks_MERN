import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-primary text-white">
      <div className="container">
        <div className="row pt-4 pb-2">
          <div className="col-3">
            <h4>RBO</h4>
          </div>
          <div className="col-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink to="/books" className="nav-link p-0 text-white">
                  Home
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink to="/about" className="nav-link p-0 text-white">
                  About Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="row d-flex justify-content-between pt-4 mt-4 border-top">
          <p>© 2022 Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
