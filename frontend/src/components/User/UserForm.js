import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';

const UserForm = (props) => {
  const history = useNavigate()
  const [input, setInput] = useState({
    username : "",
    email : "",
    name : "",
    password : "",
    cnfpassword : ""
  });
  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event)=>{
    event.preventDefault();
    const {username, name, email, password, cnfpassword} = input;
    if(password !== cnfpassword){
      alert("Passwords do not match");
      return false;
    }
    try {
      const res = await fetch('http://localhost:5000/users/new', {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        credentials: "include",
        body : JSON.stringify({username, name, email, password})
      })
      if(res && res.status === 200){
        alert("User registered Successfully");
        history('/login')
      }else if(res && res.status === 400){
        alert("Username/email already taken. choose a different one");
      }else{
        alert("Server error. Try again after sometime")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container shadow my-4 rounded">
      <div className="row justify-content-center">
        {
          props.usertype !== "admin" ?
            <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center order-2 bg-info rounded">
              <h1 className="display-4 fw-bolder">Hello, reader</h1>
              <p className="lead text-center">Enter Your Details to Register</p>
              <h5 className="mb-4">OR</h5>
              <NavLink
                to="/login" className="btn btn-outline-light rounded-pill pb-2 w-50">
                Login
              </NavLink>
            </div>
          :
            <>
            </>
        }
        <div className="col-md-6 p-4 m-2">
          {
            props.usertype === "admin" ?
              <h2 className="m-2 text-center">Register New employee</h2>
            :
              <h2 className="m-2 text-center">Register Yourself</h2>
          }
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={input.name} onChange={handleInput} aria-describedby="fullName" placeholder="Enter your full name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" name="username" value={input.username} onChange={handleInput} aria-describedby="username" placeholder="Choose a username" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email id</label>
              <input type="email" className="form-control" name="email" value={input.email} onChange={handleInput} aria-describedby="email" placeholder="Enter your email" required />
              <div className="form-text">
                We&apos;ll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={input.password} onChange={handleInput} aria-describedby="password" minLength="6" placeholder="Enter a strong password" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Confirm Password</label>
              <input type="password" className="form-control" name="cnfpassword" value={input.cnfpassword} onChange={handleInput} aria-describedby="password" minLength="6" placeholder="Re-enter your password" required />
            </div>
            <div className="d-flex justify-content-evenly mt-4">
              {
                props.usertype === "admin"?
                  <NavLink
                    to={"/books"} className="btn btn-danger col-4">
                    <span>Cancel/Back <i className="fa fa-reply" aria-hidden="true"></i></span>
                  </NavLink>
                :
                  <></>
              }
              <button type="submit" className="btn btn-outline-primary col-4 rounded-pill">
              Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
