import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { useCookies } from 'react-cookie';

const book_state_dict = {
  0: "New Book requested",
  1: "Book assigned to employee",
  2: "More book info asked",
  3: "Updated book info",
  4: "Admin authorisation requested",
  5: "Book request approved",
  6: "Book request denied",
  7: "Book request deleted",
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
    columns.push({
      selector: row => row.a,
    });
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
      for (let i = 0; i < data.length; i++) {
        data[i].a = [<NavLink
            to={"/bookhistory/" + data[i]._id} className="btn btn-primary rounded-pill">
            Show book history
          </NavLink>]
        if(cookies.usertype === "user"){
          data[i].a.push(<NavLink
              to={"/books/" + data[i]._id} className="btn btn-info rounded-pill">
              Show book details
            </NavLink>)
          if(data[i].bookstate_int === 0){
            data[i].a.push(<button className="btn btn-danger rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 7)}>Delete book request</button>)
          }else if(data[i].bookstate_int === 2){
            data[i].a.push(<NavLink
              to={"/books/" + data[i]._id + "/edit"} className="btn btn-warning rounded-pill">
              Update book details
            </NavLink>)
          }
        }else if(cookies.usertype === "employee"){
          if(data[i].bookstate_int === 0){
            data[i].a.push(<button className="btn btn-danger rounded-pill" onClick={ () => updateBookHandledBy(data[i]._id)}>Assign to self</button>)
          }else{
            if(data[i].handledby === cookies.username && (data[i].bookstate_int === 1 || data[i].bookstate_int === 3)){
              data[i].a.push(
                <button className="btn btn-info rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 2)}>Ask more info</button>,
                <button className="btn btn-success rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 5)}>Purchase book</button>,
                <button className="btn btn-warning rounded-pill" onClick={ () => updateBookStatus(data[i]._id, 4)}>Ask authorisation</button>
              )
            }
          }
        }else{
          if(data[i].bookstate_int === 4){
            data[i].a.push(<button className="btn btn-success" onClick={ () =>updateBookStatus(data[i]._id, 5)}>Approve purchase</button>)
            data[i].a.push(<button className="btn btn-danger" onClick={ () => updateBookStatus(data[i]._id, 6)}>Deny purchase</button>)
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
  let filterableColumns = [];
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [cookies, setCookie] = useCookies();
  const [filterText, setFilterText] = useState('');
  const id = useParams().id;
  const columns = getColumns(cookies, props.pagetype, filterableColumns);

  useEffect(() => {
    if(cookies.usertype ==="admin" && props.pagetype === "users")
      getUserData(cookies).then((data) => setData(data));
    else if(props.pagetype === "home")
      getBookData(cookies, columns).then((data) => setData(data));
    else if(props.pagetype === "bookhistory")
      getBookHistoryData(id).then((data) => setData(data));
  }, [id, props, cookies]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    let f = filterText.toLowerCase();
    const filteredItems = data.filter(
      item => {
        let result = false;
          console.log("printing in loop")
          console.log(filterableColumns)
        for(let i=0; i < filterableColumns.length; i++){
          // console.log(item)
          // console.log(filterableColumns[i])
          result = result || (item[filterableColumns[i]]+"").toLowerCase().includes(f);
        }
        return result;
      }
      // item => item.name.toLowerCase().includes(f)
    );
    setFilteredData(filteredItems);
  }, [filterText]);

  return (
    <div className="container datatable">
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
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
            />
        </div>
      </div>
    </div>
  );
};

export default Showtable;
