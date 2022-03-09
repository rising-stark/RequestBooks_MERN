import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
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

const updateBookHandledBy = async (id) => {
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

const updateBookStatus = async (id, bookstate_int) => {
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

const deleteUser = async (id) => {
  const res = await fetch(`http://localhost:5000/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (res && res.status === 200) {
    alert("User deleted successfully");
    window.location.reload();
  }else{
    alert("Some error occured. Pls try again later");
  }
};

function getColumns(pagetype){
  let columns = [];
  if(pagetype === "home"){
    columns = [
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
  }else if(pagetype === "users"){
    columns = [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
      },
      {
        name: 'User Type',
        selector: 'usertype',
        sortable: true,
      },
      {
        name: '',
        selector: 'a1'
      },
    ];
  }else{
    columns = [
      {
        name: 'Action',
        selector: 'bookstate',
        sortable: true,
      },
      {
        name: 'Action performed by',
        selector: 'username',
        sortable: true,
      },
      {
        name: 'Action performed at',
        selector: 'timestamp',
        sortable: true,
      },
    ];
  }
  return columns;
}

const getUserData = async (cookies) => {
  try {
    const res = await fetch('http://localhost:5000/users', {
      method: "GET",
      credentials: "include"
    })
    console.log(res.status);
    const data = (await res.json()).users;
    console.log(data);
    if (res && res.status === 200) {
      for (let i = 0; i < data.length; i++) {
        if(cookies.usertype === "admin"){
        data[i].a1 = <button className="btn btn-danger rounded-pill" onClick={ () => deleteUser(data[i]._id)}>Delete this user</button>
        }
      }
      return data;
    }else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
}

const getBookHistoryData = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/bookhistory/${id}`, {
      method: "GET",
      credentials: "include"
    })
    console.log(res.status);
    const data = (await res.json()).history;
    console.log(data);
    if (res && res.status === 200) {
      return data;
    }else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
}

const getBookData = async (cookies) => {
  try {
    const res = await fetch('http://localhost:5000/', {
      method: "GET",
      credentials: "include"
    })
    const data = (await res.json()).books;
    if (res && res.status === 200) {
      for (let i = 0; i < data.length; i++) {
        data[i].a1 = <NavLink
            to={"/bookhistory/" + data[i]._id} className="btn btn-primary rounded-pill">
            History
          </NavLink>
        if(cookies.usertype === "user"){
          if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 7)}>Delete book request</button>
          }else if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 7)}>Delete book request</button>
          }
        }else if(cookies.usertype === "employee"){
          if(data[i].bookstate_int === 0){
            data[i].a2 = <button className="btn btn-danger rounded-pill" onClick={ () => updateBookHandledBy(data[i]._id)}>Assign to self</button>
          }else{
            if(data[i].handledby === cookies.username && data[i].bookstate_int === (1 || 3)){
              data[i].a2 = <button className="btn btn-info rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 2)}>Ask more info</button>
              data[i].a3 = <button className="btn btn-success rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 5)}>Approve</button>
              data[i].a4 = <button className="btn btn-warning rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 4)}>Ask authorisation</button>
            }
          }
        }else{
          if(data[i].bookstate_int === 4){
            data[i].a2 = <button className="btn btn-success" onClick={ () =>updateBookStatus(data[i]._id, 5)}>Approve</button>
            data[i].a3 = <button className="btn btn-danger" onClick={ () => updateBookStatus(data[i]._id, 6)}>Deny</button>
          }
        }
      }
      return data;
    }else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
}

const Showtable = (props) => {
  const [data, setData] = useState();
  const [cookies, setCookie] = useCookies();
  const id = useParams().id;

  useEffect(() => {
    if(cookies.usertype ==="admin" && props.pagetype === "users")
      getUserData(cookies).then((data) => setData(data));
    else if(props.pagetype === "home")
      getBookData(cookies).then((data) => setData(data));
    else if(props.pagetype === "bookhistory")
      getBookHistoryData(id).then((data) => setData(data));
  }, []);

  const columns = getColumns(props.pagetype);
  const tableData = {
    columns,
    data
  };

  return (
    <div className="container datatable">
      <div className="row my-4">
        <h3 className="text-center">{props.title}</h3>
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
      </div>
    </div>
  );
};

export default Showtable;
