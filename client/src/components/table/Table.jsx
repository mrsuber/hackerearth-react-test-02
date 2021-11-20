import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useTable } from 'react-table'


const Table = () => {

const [tableData, setTableData] = useState([])
useEffect(()=>{
  const getData = async () =>{
    try{
      const res = await axios.get("https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json")

      setTableData(res.data)


    }catch(err){
      console.log(err)
    }
  }

  getData()


},[])



function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
const tableData_sorted_by_price = tableData.sort(dynamicSort("price"));



const data = React.useMemo(
   () => tableData_sorted_by_price,
   []
 )

const columns = React.useMemo(
   () => [
     {
       Header: 'Id',
       accessor: 'id', // accessor is the "key" in the data
     },
     {
       Header: 'Food Name',
       accessor: 'name',
     },
     {
       Header: 'Food Category',
       accessor: 'category',
     },

     {
       Header: 'Food Price',
       accessor: 'price',
     },
   ],
   []
 )

const tableInstance = useTable({ columns, data })

const {
   getTableProps,
   getTableBodyProps,
   headerGroups,
   rows,
   prepareRow,
 } = tableInstance
  // Render the UI for your table

  const handleSave = () =>{
    localStorage.setItem("tableData",tableData_sorted_by_price)
  }
  

  return (
    <>
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
     <div className="btn container">
     <button onClick={handleSave}>save</button>
     <button>Reset</button>
     </div>
     </>
  )
}

export default Table
