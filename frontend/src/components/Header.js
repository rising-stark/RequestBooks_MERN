import { NavLink } from 'react-router-dom';

const Header = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-md-none fw-bolder fs-2 mx-auto" to="/books">RBO</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="col-4">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {
                props.auth?
                  <>
                    <li className="nav-item">
                      <NavLink exact="true" className="nav-link" to="/books">Home</NavLink>
                    </li>
                    {
                      props.usertype === "user" ?
                        <li className="nav-item">
                          <NavLink exact="true" className="nav-link" to="/books/new">Request a book</NavLink>
                        </li>
                      :
                        props.usertype === "admin" ?
                          <>
                            <li className="nav-item">
                              <NavLink className="nav-link" to="/users">Show all users</NavLink>
                            </li>
                            <li className="nav-item">
                              <NavLink className="nav-link" to="/users/new">Register new employee</NavLink>
                            </li>
                          </>
                        :
                          <>
                          </>
                    }
                  </>
                :
                  <>
                  </>
              }
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">About Us</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-4 text-center d-none d-lg-block">
            <NavLink className="navbar-brand fw-bolder fs-1 mx-auto" to="/books">RBO</NavLink>
          </div>
          <div className="col-4 d-flex px-4 justify-content-end">
            {
              props.auth ?
              <>
                <NavLink to="/logout" className="btn btn-outline-primary ms-2 px-4 rounded-pill"><span>Logout <i className="fa fa-sign-out" aria-hidden="true"></i></span></NavLink>
              </>
              :
              <>
                <NavLink to="/login" className="btn btn-outline-primary ms-auto px-4 rounded-pill"><span>Login <i className="fa fa-sign-in" aria-hidden="true"></i></span></NavLink>
                <NavLink to="/register" className="btn btn-outline-primary ms-2 px-4 rounded-pill"><span>Register <i className="fa fa-user-plus" aria-hidden="true"></i></span></NavLink>
              </>
            }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
