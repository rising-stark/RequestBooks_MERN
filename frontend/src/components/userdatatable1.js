import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import {data, columns} from "./data";

const getUserData = () => {
  let data = [];
  // console.log(cookies)
  // console.log(cookies.username)
  try {
    const res = fetch('http://localhost:5000/', {
      method: "GET",
      credentials: "include"
    })
    console.log(res.status);
    const books = res.json();
    console.log(books.books);
    if (res && res.status === 200) {
      data = books.books;
    } else if (res && res.status === 400) {
      data = [];
    } else {
      alert("Server error. Try again after sometime")
    }
  } catch (error) {
    console.log(error);
  }
  console.log(data);
  return data;
}

const Showtable = () => {
  const [data, setData] = useState();
  data = getUserData();
  // const data = [{ id: 1, title: 'DataTable in ReactJS', year: <NavLink
  //           to="/login" className="btn btn-info rounded-pill pb-2 w-50">
  //           Login
  //         </NavLink> },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },{ id: 1, title: 'DataTable in ReactJS', year: '2021' },];
  const columns = [{
      name: 'Title',
      selector: 'title',
      sortable: true,
    },
    {
      name: 'Year',
      selector: 'year',
      sortable: true
    },
  ];
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
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
        />
      </DataTableExtensions>
    </div>
  );
};

export default Showtable;