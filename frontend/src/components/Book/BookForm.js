import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const history = useNavigate();
  const id = useParams().id;
  const bookInitialState = {
    name: "",
    description: "",
    price: "",
    author: "",
  };
  const [heading, setHeading] = useState(heading_dict[props.pagetype]);
  const [input, setInput] = useState(bookInitialState);
  const [btn, setbtn] = useState(btn_dict[props.pagetype]);
  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getBookById = async () => {
    console.log("Printing the show/update book page");
    console.log(JSON.stringify(props));
    console.log(id);
    try {
      const res = await fetch(`http://localhost:5000/books/${id}`, {
        method: "GET",
        credentials: "include"
      });
      console.log(res.status);
      if (res && res.status === 200) {
        const book = (await res.json()).book;
        if(book === undefined)
          alert("Book not found");
        return book || bookInitialState;
      }else {
        alert("Server error. Try again later")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("JSON.stringify(props)")
    console.log(JSON.stringify(props))
    console.log("id")
    console.log(id)
    if(id !== undefined && props.pagetype == "edit" || props.pagetype == "show")
      getBookById().then((data) => {
        setInput(data);
        setHeading(heading_dict[props.pagetype]);
        setbtn(btn_dict[props.pagetype]);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, author, description, price} = input;
    try {
      let URL = "http://localhost:5000/books/new", method = "POST", msg = "requested";
      if(id !== undefined && props.pagetype === "update"){
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
        history('/books')
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
            {
              (props.pagetype == "new" || props.pagetype == "edit")?
                <button type="submit" className="btn btn-primary col-4 offset-4">
                  {btn}
                </button>
              :
                <></>
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
