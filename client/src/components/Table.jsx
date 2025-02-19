import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';



// TableRow Component
const TableRow = ({ user }) => (
  <tr >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        
        <div className="text-sm font-medium text-gray-900">{user.id}</div>
        <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{[user.first_name, user.last_name].filter(Boolean).join(' ')}

        </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{user.date}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.type === 'Student' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {user.type}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.type === 'Student' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {user.type === 'Student' ? user.type : 'RSO Name'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.quantity}
    <a href="#" className="text-indigo-600 hover:text-indigo-900">
        Edit
      </a>
      </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <a href="#" className="text-indigo-600 hover:text-indigo-900">
        Delete
      </a>
    </td>
  </tr>
);

// Table Component
const Table = ({ searchQuery }) => {
  const [search, setSearch] = useState('');
  console.log(search);

  //Fetches data from data.json
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/data/MOCK_DATA.json') 
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error loading data:', error));
  }, []);
  

  

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const records = data.slice(indexOfFirstPost, indexOfLastPost);

    const npage = Math.ceil(data.length / postsPerPage); //tells number of pages
    const numbers = [...Array(npage + 1).keys()].slice(1); //creates an array of page numbers
  
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
    


  return (
    
    
   <div>
    <input
      type="text"
      placeholder="Search..."
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded w-full"
    />

      {data.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
          <thead className="bg-gray-50">
            <tr>
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
                Edit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.filter((user) => {
              return search.toLowerCase() === '' || user.first_name.toLowerCase().includes(search.toLowerCase()) || user.last_name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
            }).map((user) => (
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
                  <button className={`px-4 py-2 rounded-md font-semibold transition duration-200 hover:bg-blue-500
                   ${currentPage === n ? 'bg-blue-500' : ''}`} key={i}
                    onClick={() => paginate(n)}>{n}
                  </button>
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

};

export default Table;