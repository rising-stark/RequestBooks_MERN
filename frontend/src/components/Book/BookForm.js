import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const heading_dict = {
  "new": "Please fill in the following details to request a new book",
  "show": "Here are the details of the book",
  "edit": "Edit details of the book",
}

const btn_dict = {
  "new": "Request New Book",
  "edit": "Update Book",
}

const BookForm = (props) => {
  const pagetype = props.pagetype;
  const navigate = useNavigate();
  const id = useParams().id;
  const [heading, setHeading] = useState(heading_dict[pagetype]);
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    author: "",
  });
  const [btn, setbtn] = useState(btn_dict[pagetype]);
  const handleInput = (e) => {
    setInput((prevState) => ({ ...prevState, [e.target.name]: e.target.value,}));
  };

  const getBookById = async () => {
    try {
      const res = await fetch(`http://localhost:5000/books/${id}`, {
        method: "GET",
        credentials: "include"
      });
      console.log(res.status);
      let book;
      if (res && res.status === 200) {
        book = (await res.json()).book;
        return book;
      }
      if(book === undefined)
        navigate("/books");
    } catch (error) {
      console.log(error);
      alert("Server error. Try again later")
    }
  }

  useEffect(() => {
    if(id !== undefined && (pagetype === "edit" || pagetype === "show"))
      getBookById().then((data) => {
        if(data.bookstate_int !== 2 && pagetype === "edit")
          navigate("/books/" + id);
        setInput(data);
        setHeading(heading_dict[props.pagetype]);
        setbtn(btn_dict[props.pagetype]);
      });
  }, [id, pagetype]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const {name, author, description, price} = input;
      let URL = "http://localhost:5000/books/new", method = "POST", msg = "requested";
      if(id !== undefined && props.pagetype === "edit"){
        URL = `http://localhost:5000/books/${id}/update`;
        method = "PUT";
        msg = "updated";
      }
      const res = await fetch(URL, {
        method : method,
        credentials : "include",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({name, author, description, price})
      });
      console.log(res.status)
      if(res && res.status === 200){
        alert("Book "+msg+" Successfully");
        navigate('/books')
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
          <h4 className="m-2 text-center">
            {heading}
          </h4>
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
              <input type="number" className="form-control" name="price" value={input.price} onChange={handleInput} min="0" max="1000" aria-describedby="price" placeholder="Enter book price" required />
            </div>
            <div className="d-flex justify-content-evenly mt-4">
              <NavLink
                to={"/books"} className="btn btn-danger col-4">
                <span>Cancel/Back <i className="fa fa-reply" aria-hidden="true"></i></span>
              </NavLink>
              {
                (props.pagetype === "new" || props.pagetype === "edit")?
                  <button type="submit" className="btn btn-primary col-4">
                    {btn}
                  </button>
                :
                  <></>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
