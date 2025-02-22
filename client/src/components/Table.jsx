import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';
import DeleteModal from './DeleteModal';


// TableRow Component
const TableRow = ({ user, onOpenModal }) => {

  

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{user.id}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {[user.first_name, user.last_name].filter(Boolean).join(' ')}
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {user.quantity}
        <button  onClick={() => console.log("Modal open")} className="text-indigo-600 hover:text-indigo-900">
          Edit
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onClick={
          onOpenModal}
           className="text-indigo-600 hover:text-indigo-900">
          Delete
        </button>
        
      </td>
    </tr>
  );
};

// Table Component
const Table = ({ searchQuery }) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    console.log("Modal open");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Modal close");
    setShowModal(false);
  }



  //Fetches data from data.json
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/data/MOCK_DATA.json') 
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error loading data:', error));
  }, []);


  

  const filteredRecords = data.filter((user) =>
    search.toLowerCase() === '' ||
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const records = filteredRecords.slice(indexOfFirstPost, indexOfLastPost);

    const npage = Math.ceil(filteredRecords.length / postsPerPage); //tells number of pages
    const numbers = [...Array(npage + 1).keys()].slice(1); //creates an array of page numbers

    useEffect(() => {
      setCurrentPage(1);
    }, [search, filteredRecords.length ]);
  
    
    function prePage() {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    }
    
    function paginate(id) {
      setCurrentPage(id);
    }
    
    function nextPage() {
      if (currentPage !== npage) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(npage);
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
    {/* Rendering of modal  */}
    {showModal && <DeleteModal onClose={handleCloseModal} />}

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
              return (
                
                search.toLowerCase() === '' ||
                user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              );
            }).length > 0 ? (
              records.filter((user) => {
                return (
                  search.toLowerCase() === '' ||
                  user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                  user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
                  
                );
              })
              .map((user) => (
              <TableRow key={user.id} user={user} onOpenModal={handleOpenModal} />
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center" colSpan={6}>
                  No records found
                </td>
              </tr>
            )}
            
          </tbody>
        </table>

          ) : (
            <LoadingAnimation />
          )}

          {/* make tab bar consistent position on the page  */}
          <div className='bg-red  w-full fixed bottom-20'>
            <nav>
              <ul className="flex justify-center">
                <li className="page-item mx-1 px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded">
                    <button className='page-link' 
                    onClick={prePage}>Prev</button>
                </li>

                <div className="px-4 py-2 font-semibold">
                {npage > 0 ? `${currentPage} of ${npage}` : "0 of 0"}
                </div>
                                
                <li className="page-item mx-1 px-3 py-2 bg-gray-200 text-gray-800 font-semibold rounded">
                    <button className='page-link'
                    onClick={nextPage}>Next</button>
                </li>

                
              </ul>
              
            </nav>  
          </div>
            
  </div>

  );

};

export default Table;