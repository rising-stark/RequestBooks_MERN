import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useCookies } from 'react-cookie';

const Login = () => {
  const history = useNavigate()
  const [input, setInput] = useState({
    username: '',
    password: ''
  });
  const [cookies, setCookie] = useCookies();
  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = input;
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      if (res && res.status === 200) {
        const data = await res.json();
        setCookie('jwt', data.jwt);
        setCookie('usertype', data.usertype);
        setCookie('username', data.username);
        alert("LoggedIn Successfully");
        history('/books')
      } else if (res && res.status === 401) {
        alert("Invalid crednetials");
      } else {
        alert("Server error. Try again after sometime")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container shadow my-4 rounded">
      <div className="row">
        <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center rounded bg-info">
          <h1 className="display-4 fw-bolder">Welcome Back</h1>
          <p className="lead text-center">Enter Your Credentials To Login</p>
          <h5 className="mb-4">OR</h5>
          <NavLink
            to="/register"
            className="btn btn-outline-light rounded-pill pb-2 w-50"
          >
            Register
          </NavLink>
        </div>
        <div className="col-md-6 p-5">
          <h1 className="display-6 fw-bolder mb-5">LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" name="username" value={input.username} onChange={handleInput} aria-describedby="username" placeholder="Enter your username" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={input.password} onChange={handleInput} aria-describedby="password" minLength="6" placeholder="Enter a strong password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-4 rounded-pill">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;