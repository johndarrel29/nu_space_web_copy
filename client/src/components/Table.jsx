import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';

// TableRow Component
const TableRow = ({ user }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        
        <div className="text-sm font-medium text-gray-900">{user.id}</div>
        <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{user.product.name}</div>
      <div className="text-sm text-gray-500">{user.product.brand}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.type === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {user.type}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.batch}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.quantity}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <a href="#" className="text-indigo-600 hover:text-indigo-900">
        View Details
      </a>
    </td>
  </tr>
);

// Table Component
const Table = () => {

  //Fetches data from data.json
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/data/data.json') 
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const records = data.slice(indexOfFirstPost, indexOfLastPost);
    const npage = Math.ceil(data.length / postsPerPage); //tells number of pages
    const numbers = [...Array(npage + 1).keys()].slice(1); //creates an array of page numbers
  
  

  return (
    
    
   <div>
      {data.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
          <thead className="bg-gray-50">
            <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((user) => (
              <TableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>

          ) : (
            <LoadingAnimation />
          )}
            <nav>
            <ul className="flex justify-center">
              <li className="page-item mx-1 px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded">
                  <a href="#" className='page-link'
                  onClick={prePage}>Prev</a>
              </li>
              {
                numbers.map((n, i) => (
                  <li className={`px-4 py-2 rounded-md font-semibold transition duration-200 hover:bg-blue-500
                   ${currentPage === n ? 'bg-blue-500' : ''}`} key={i}>
                    <a href="#" className='page-link'
                    onClick={() => paginate(n)} >{n}</a>
                  </li>
                ))
              }
              <li className="page-item mx-1 px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded">
                  <a href="#" className='page-link'
                  onClick={nextPage}>Next</a>
              </li>
            </ul>
          </nav>
  </div>

  );


function prePage() {
  if(currentPage !== 1) {
    setCurrentPage(currentPage - 1);
  }
}

function paginate(id) {
  setCurrentPage(id);
}

function nextPage() {
  if(currentPage !== npage) {
    setCurrentPage(currentPage + 1);
  }
}

};
export default Table;