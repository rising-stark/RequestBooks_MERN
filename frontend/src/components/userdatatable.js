import React, { useState } from "react";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
// import { useCookies } from 'react-cookie'

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
			Search:{' '}
			<input
				className="form-control"
				value={value || ""}
				onChange={e => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder={`${count} records...`}
			/>
		</span>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
			className="form-control"
			value={filterValue || ''}
			onChange={e => {
				setFilter(e.target.value || undefined)
			}}
			placeholder={`Search ${count} records...`}
		/>
  )
}

function Table({ columns, data }) {

  const defaultColumn = React.useMemo(
    () => ({
      // Default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
      columns,
      data,
      defaultColumn
    },
    useFilters,
    useGlobalFilter
  )

  return (
    <div>
			<GlobalFilter
				preGlobalFilteredRows={preGlobalFilteredRows}
				globalFilter={state.globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
			<table className="table" {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									{column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
							<br />
				      <div>Showing the first 20 results of {rows.length} rows</div>
				      <div>
				          <pre>
				              <code>{JSON.stringify(data)}</code>
				          </pre>
				      </div>
		</div>
  )
}

// const getUserData = async () => {
// 	let data = [];
// 	// console.log(cookies)
// 	// console.log(cookies.username)
// 	try {
// 	  const res = await fetch('http://localhost:5000/', {
// 	    method : "GET",
//       credentials : "include"
// 	  })
// 	  console.log(res.status);
// 	  const books = await res.json();
// 	  console.log(books.books);
// 	  if(res && res.status === 200){
// 	  	data = books.books;
// 	  }else if(res && res.status === 400){
// 	    data = [];
// 	  }else{
// 	    alert("Server error. Try again after sometime")
// 	  }
// 	} catch (error) {
// 	  console.log(error);
// 	}
//   	console.log(data);
// 	return data;
// }

function Datatable() {
  // const [cookies, setCookie] = useCookies();
  const columns = React.useMemo(
    () => [{
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName'
      },
      {
        Header: 'Age',
        accessor: 'age'
      },
      {
        Header: 'Visits',
        accessor: 'visits'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress'
      },
    ],
    []
  )

  let data = [];
  // data = getUserData();

  // const data = [{
  //     "firstName": "horn-od926",
  //     "lastName": "selection-gsykp",
  //     "age": 22,
  //     "visits": 20,
  //     "progress": 39,
  //     "status": "single"
  //   },
  //   {
  //     "firstName": "heart-nff6w",
  //     "lastName": "information-nyp92",
  //     "age": 16,
  //     "visits": 98,
  //     "progress": 40,
  //     "status": "complicated"
  //   },
  //   {
  //     "firstName": "minute-yri12",
  //     "lastName": "fairies-iutct",
  //     "age": 7,
  //     "visits": 77,
  //     "progress": 39,
  //     "status": "single"
  //   },
  //   {
  //     "firstName": "degree-jx4h0",
  //     "lastName": "man-u2y40",
  //     "age": 27,
  //     "visits": 54,
  //     "progress": 92,
  //     "status": "relationship"
  //   }
  // ]
  console.log(typeof data)
  console.log(typeof data[0])

  console.log(data)
  console.log(data[0])

  return (
    <Table columns={columns} data={data} />
  )
}

export default Datatable;
