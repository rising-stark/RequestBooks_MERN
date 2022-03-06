import React, { useEffect, useState } from "react";
import axios from "axios";
// import Book from "./Book";
import { Link } from "react-router-dom";

const URL = "http://localhost:5000/";
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};



const Home = () => {
  const [books, setBooks] = useState();
  return (
    <div class="container">
      <div class="row my-4">
        <div class="col-md-8 offset-md-2">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Author</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
