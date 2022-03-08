import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { useCookies } from 'react-cookie';

const book_state_dict = {
  0: "New Book requested",
  1: "Book assigned to employee",
  2: "More book info asked. Click on Update and add more info in description",
  3: "Updated book info",
  4: "Admin authorisation requested",
  5: "Book request approved",
  6: "Book request denied",
  7: "Book request deleted",
}

const updateHandledBy = async (id) => {
  const res = await fetch(`http://localhost:5000/updatehandledby/${id}`, {
    method: "PUT",
    credentials: "include"
  })
  if (res && res.status === 200) {
    alert("Book assigned successfully");
    window.location.reload();
  }else{
    alert("Some error occured. Pls try again later");
  }
};

const updateStatusHandler = async (id, bookstate_int) => {
  const res = await fetch(`http://localhost:5000/updatestatus/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bookstate: book_state_dict[bookstate_int],
      bookstate_int
    })
  })
  if (res && res.status === 200) {
    alert("Book status updated successfully");
    window.location.reload();
  }else{
    alert("Some error occured. Pls try again later");
  }
};

function getColumns(cookies){
  let columns = [
    {
      name: 'Book name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Author name',
      selector: 'author',
      sortable: true,
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: true,
    },
    {
      name: 'Price',
      selector: 'price',
      sortable: true,
    },
    {
      name: 'Requested time',
      selector: 'requestedat',
      sortable: true,
    },
    {
      name: 'Employee Handling',
      selector: 'handledby',
      sortable: true,
    },
    {
      name: 'Book state',
      selector: 'bookstate',
      sortable: true,
    },
    {
      name: '',
      selector: 'a1'
    },
    {
      name: '',
      selector: 'a2'
    },
    {
      name: '',
      selector: 'a3'
    },
  ];
  return columns;
}

const getData = async (cookies) => {
  try {
    const res = await fetch('http://localhost:5000/', {
      method: "GET",
      credentials: "include"
    })
    console.log(res.status);
    const books = await res.json();
    console.log(books.books);
    if (res && res.status === 200) {
      let data = books.books;
      for (let i = 0; i < data.length; i++) {
          console.log("Here printing in loop")
          console.log("usertype = "+cookies.usertype)
          console.log("data = "+JSON.stringify(data[i]))
          console.log("bookstate = "+data[i].bookstate_int)
          console.log("handledby = "+data[i].handledby)
        data[i].a1 = <NavLink
            to={"/bookhistory/" + data[i]._id} className="btn btn-primary rounded-pill">
            History
          </NavLink>
        if(cookies.usertype === "user"){
          if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger" onClick={ () => updateStatusHandler(data[i]._id, 7)}>Delete book request</button>
          }else if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger" onClick={ () => updateStatusHandler(data[i]._id, 7)}>Delete book request</button>
          }
        }else if(cookies.usertype === "employee"){
          if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger" onClick={ () => updateHandledBy(data[i]._id)}>Assign to self</button>
          }else{
            if(data[i].handledby === cookies.username && data[i].bookstate_int === (1 || 3)){
              data[i].a2 = <button className="btn btn-info" onClick={ () => updateStatusHandler(data[i]._id, 2)}>Ask more info</button>
              data[i].a3 = <button className="btn btn-success" onClick={ () => updateStatusHandler(data[i]._id, 5)}>Approve</button>
              data[i].a4 = <button className="btn btn-warning" onClick={ () => updateStatusHandler(data[i]._id, 4)}>Ask authorisation</button>
            }
          }
        }else{
          if(data[i].bookstate_int === 4){
            data[i].a2 = <button className="btn btn-success" onClick={ () =>updateStatusHandler(data[i]._id, 5)}>Approve</button>
            data[i].a3 = <button className="btn btn-danger" onClick={ () => updateStatusHandler(data[i]._id, 6)}>Deny</button>
          }
        }
      }
      console.log("Here modified data = "+ JSON.stringify(data));
      return books.books;
    }else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
}

const Showtable = () => {
  const [data, setData] = useState();
  const [cookies, setCookie] = useCookies();
  useEffect(() => {
    getData(cookies).then((data) => setData(data));
  }, []);

  const columns = getColumns(cookies);
  const tableData = {
    columns,
    data
  };

  return (
    <div className="main">
      <DataTableExtensions {...tableData}>
        <DataTable
          columns={columns}
          data={data}
          defaultSortField="name"
          pagination
          highlightOnHover
        />
      </DataTableExtensions>
    </div>
  );
};

export default Showtable;
