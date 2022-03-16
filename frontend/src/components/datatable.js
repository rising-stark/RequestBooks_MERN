import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { useCookies } from 'react-cookie';
import "./Datatable.css"

const book_state_dict = {
  0: "New Book requested",
  1: "Book assigned to employee",
  2: "More book info asked from user",
  3: "Updated book info",
  4: "Book price is over-budget. Admin authorisation requested",
  5: "Book purchased",
  6: "Book request approved by admin",
  7: "Book request denied by admin",
  8: "Book request cancelled"
}

function getColumns(cookies, pagetype, filterableColumns){
  let columns = [];
  if(pagetype === "home"){
    columns = [
      {
        name: 'Book name',
        selector: row => row.name,
        sortable: true,
        filter: true,
        col: "name"
      },
      {
        name: 'Author name',
        selector: row => row.author,
        sortable: true,
        filter: true,
        col: "author"
      },
      {
        name: 'Description',
        selector: row => row.description,
        sortable: true,
        filter: true,
        col: "description"
      },
      {
        name: 'Price',
        selector: row => row.price,
        sortable: true,
        filter: true,
        col: "price"
      },
      {
        name: 'Requested time',
        selector: row => row.requestedat,
        sortable: true,
        filter: true,
        col: "requestedat"
      },
      {
        name: 'Employee Handling',
        selector: row => row.handledby,
        sortable: true,
        filter: true,
        col: "handledby"
      },
      {
        name: 'Book state',
        selector: row => row.bookstate,
        sortable: true,
        filter: true,
        col: "bookstate"
      },
    ];
    if(cookies.usertype !== "user"){
      columns.push({
        name: 'Requested By',
        selector: row => row.requestedby,
        sortable: true,
        filter: true,
        col: "requestedby"
      })
    }
    if(cookies.usertype !== "admin"){
      columns.push({
        name: "Chat",
        selector: row => row.chat,
      })
    }
    columns.push(
      {
        name: "Actions",
        selector: row => row.a,
      }
    );
  }else if(pagetype === "users"){
    columns = [
      {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
        filter: true,
        col: "name"
      },
      {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
        filter: true,
        col: "email"
      },
      {
        name: 'User Type',
        selector: row => row.usertype,
        sortable: true,
        filter: true,
        col: "usertype"
      },
      {
        selector: row => row.a,
      },
    ];
  }else{
    columns = [
      {
        name: 'Action',
        selector: row => row.bookstate,
        sortable: true,
        filter: true,
        col: "bookstate"
      },
      {
        name: 'Action performed by',
        selector: row => row.username,
        sortable: true,
        filter: true,
        col: "username"
      },
      {
        name: 'Action performed at',
        selector: row => row.timestamp,
        sortable: true,
        filter: true,
        col: "timestamp"
      },
    ];
  }
  for(let i = 0; i < columns.length; i++){
    if(columns[i].filter)
      filterableColumns.push(columns[i].col);
  }
  return columns;
}

const updateBookHandledBy = async (id) => {
  const res = await fetch(`http://localhost:5000/books/${id}/updatehandledby`, {
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
  const res = await fetch(`http://localhost:5000/books/${id}/updatestatus`, {
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

const getUserData = async (cookies) => {
  try {
    const res = await fetch('http://localhost:5000/users', {
      method: "GET",
      credentials: "include"
    })
    const data = (await res.json()).users;
    if (res && res.status === 200) {
      let key = 0;
      for (let i = 0; i < data.length; i++) {
        if(cookies.usertype === "admin"){
        data[i].a= [<button className="btn btn-danger rounded-pill" key={key++} onClick={ () => deleteUser(data[i]._id)}><span>Delete this user <i className="fa fa-trash" aria-hidden="true"></i></span></button>]
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
    const data = (await res.json()).history;
    if (res && res.status === 200) {
      return data;
    }else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
}

const getBookData = async (cookies, columns) => {
  try {
    const res = await fetch('http://localhost:5000/books', {
      method: "GET",
      credentials: "include"
    })
    const data = (await res.json()).books;
    if (res && res.status === 200) {
      let key = 0;
      for (let i = 0; i < data.length; i++) {
        // U can chat only if the book is assigned to somebody and it is not deleted.
        if([1, 2, 3, 4, 6, 7].includes(data[i].bookstate_int) && (cookies.usertype === "user" || (cookies.usertype === "employee" && data[i].handledby === cookies.username))){
          data[i].chat = <NavLink
            to={"/chats/" + data[i]._id} className="btn btn-primary rounded-pill">
            <span>Chat <i className="fa fa-commenting-o" aria-hidden="true"></i></span>
          </NavLink>
        }
        data[i].a = [
          <NavLink
            to={"/bookhistory/" + data[i]._id} className="btn btn-primary rounded-pill" key={key++}>
            <span>Book history <i className="fa fa-history" aria-hidden="true"></i></span>
          </NavLink>,
          <NavLink
            to={"/books/" + data[i]._id} className="btn btn-info rounded-pill" key={key++}>
            <span>Book details <i className="fa fa-info-circle" aria-hidden="true"></i></span>
          </NavLink>
        ]
        if(cookies.usertype === "user"){
          data[i].a.push()
          if(data[i].bookstate_int === 0){
            data[i].a.push(<button className="btn btn-danger rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 8)}><span>Cancel request <i className="fa fa-trash" aria-hidden="true"></i></span></button>)
          }else if(data[i].bookstate_int === 2){
            data[i].a.push(<NavLink
              to={"/books/" + data[i]._id + "/edit"} className="btn btn-warning rounded-pill" key={key++}>
              <span>Update book details <i className="fa fa-edit" aria-hidden="true"></i></span>
            </NavLink>)
          }
        }else if(cookies.usertype === "employee"){
          if(data[i].bookstate_int === 0){
            data[i].a.push(<button className="btn btn-danger rounded-pill" key={key++} onClick={ () => updateBookHandledBy(data[i]._id)}><span>Assign to self <i className="fa fa-plus-square-o" aria-hidden="true"></i></span></button>)
          }else if(data[i].handledby === cookies.username){
            if(data[i].bookstate_int === 1 || data[i].bookstate_int === 3 || data[i].bookstate_int === 6){
              data[i].a.push(
                <button className="btn btn-info rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 2)}><span>Ask more info <i className="fa fa-question-circle" aria-hidden="true"></i></span></button>,
                <button className="btn btn-success rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 5)}><span>Purchase book <i className="fa fa-check-square-o" aria-hidden="true"></i></span></button>,
              )
              if(!data[i].isAuthorised)
                data[i].a.push(<button className="btn btn-warning rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 4)}><span>Ask authorisation <i className="fa fa-question-circle" aria-hidden="true"></i></span></button>)
            }else if(data[i].bookstate_int === 7){
              data[i].a.push(<button className="btn btn-danger rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 8)}><span>Cancel request <i className="fa fa-trash" aria-hidden="true"></i></span></button>)
            }
          }
        }else{
          if(data[i].bookstate_int === 4){
            data[i].a.push(<button className="btn btn-success rounded-pill" key={key++} onClick={ () =>updateBookStatus(data[i]._id, 6)}><span>Approve purchase <i className="fa fa-thumbs-o-up" aria-hidden="true"></i></span></button>)
            data[i].a.push(<button className="btn btn-danger rounded-pill" key={key++} onClick={ () => updateBookStatus(data[i]._id, 7)}><span>Deny purchase <i className="fa fa-ban" aria-hidden="true"></i></span></button>)
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
  let pagetype = props.pagetype;
  let filterableColumns = [];
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [cookies] = useCookies();
  const [filterText, setFilterText] = useState('');
  const id = useParams().id;
  const columns = getColumns(cookies, pagetype, filterableColumns);

  useEffect(() => {
    setData([])
    if(cookies.usertype ==="admin" && pagetype === "users")
      getUserData(cookies).then((data) => setData(data));
    else if(pagetype === "home")
      getBookData(cookies, columns).then((data) => setData(data));
    else if(pagetype === "bookhistory")
      getBookHistoryData(id).then((data) => setData(data));
  }, [id, pagetype, cookies]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    let f = filterText.toLowerCase();
    const filteredItems = data.filter(
      item => {
        let result = false;
        for(let i=0; i < filterableColumns.length; i++){
          result = result || (item[filterableColumns[i]]+"").toLowerCase().includes(f);
        }
        return result;
      }
    );
    setFilteredData(filteredItems);
  }, [filterText]);

  return (
    <div className="container">
      <div className="row my-4">
        <h3 className="text-center">{props.title}</h3>
        <div className="main">
          <div className="row g-3 align-items-center my-3">
            <div className="col-auto">
              <label htmlFor="search" className="form-label">Search:</label>
            </div>
            <div className="col-auto">
              <input type="text" className="mx-3 form-control" value={filterText} onChange={e => setFilterText(e.target.value)} aria-describedby="Search Input" placeholder="Enter search text" />
            </div>
          </div>
          <div className="datatable border rounded">
            <DataTable
              conditionalRowStyles={
                [
                  {
                    when: (row) => row.bookstate_int === 5,
                    style: {
                      backgroundColor: "seagreen",
                      color: "white",
                    }
                  },
                  {
                    when: (row) => row.bookstate_int === 8,
                    style: {
                      backgroundColor: "darkred",
                      color: "white",
                    }
                  },
                ]
              }
              columns={columns}
              data={filteredData}
              pagination
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showtable;
