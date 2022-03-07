import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestBook = () => {
  const history = useNavigate();
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    author: "",
  });
  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, author, description, price} = input;
    try {
      const res = await fetch('http://localhost:5000/', {
        method : "POST",
        credentials : "include",
        body : JSON.stringify({name, author, description, price})
      })
      console.log(res.status)
      if(res && res.status === 200){
        alert("Book requested Successfully");
        history('/')
      }else{
        alert("Server error. Try again after sometime")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row my-4 py-2">
        <div className="col-md-8 offset-md-2">
          <h4 className="m-2 text-center">Please fill in the following details to request a book </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="bookname" className="form-label">Book Name</label>
              <input type="text" className="form-control" name="name" value={input.name} onChange={handleInput} aria-describedby="bookName" placeholder="Enter book name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="authorname" className="form-label">Author Name</label>
              <input type="text" className="form-control" name="author" value={input.author} onChange={handleInput} aria-describedby="authorName"  placeholder="Enter book name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" name="description" value={input.description} onChange={handleInput} aria-describedby="description" placeholder="Describe the book"  rows="3"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="Price" className="form-label">Price ($)</label>
              <input type="number" className="form-control" name="price" value={input.price} onChange={handleInput} aria-describedby="price" placeholder="Enter book price" required />
            </div>
            <button type="submit" className="btn btn-primary col-4 offset-4">Request book</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestBook
