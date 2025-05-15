import  editIcon  from '../../assets/icons/pen-to-square-solid.svg';
import  deleteIcon  from '../../assets/icons/trash-solid.svg';
import  { FormatDate }  from '../../utils';
import  { Badge }  from '../ui';

const TableRow = ({ user, onOpenModal, index }) => {
  const handleActionClick = (action) => () => {
    onOpenModal(action, user);
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  const formattedDate = FormatDate(user.createdAt);

  function handleStyle  (userRole) {
    console.log("user role: " + userRole)

    switch (userRole) {
      case 'admin':
        return 'primary';
      case 'student/rso':
        return 'secondary';
      case 'student':
        return 'tertiary'; 
      default:
        return '';
        
    }
  }

  //   let roleClass = 'bg-gray-100 text-gray-800'; 

  // switch (user.role) {
  //   case 'student':
  //     roleClass = 'bg-green-100 text-green-800';
  //     break;
  //   case 'student/rso':
  //     roleClass = 'bg-blue-100 text-blue-800';
  //     break;
  //   case 'admin':
  //     roleClass = 'bg-yellow-100 text-yellow-800';
  //     break;
  // }
    

  return (
    <tr className='hover:bg-gray-200 transition duration-300 ease-in-out' >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{index}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 flex items-center justify-center">{formattedDate}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <Badge style={handleStyle(user.role)} text={user.role}/>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          {/* <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
            {user.role === 'student' ? 'student' : user.assigned_rso?.RSO_acronym || 'N/A'}
          </span> */}
          {console.log("results: " + handleStyle(user.role))}
          <Badge style={handleStyle(user.role)} text={user.role === 'student' ? 'student' : user.assigned_rso?.RSO_acronym || 'N/A'}/>
        </div>

      </td>
      <td className="px-6 py-4 whitespace-nowrap ">
      <div className='space-x-2 flex flex-row justify-center items-center'>
          <div 
            className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 bg-white transition duration-300 cursor-pointer"
            onClick={handleActionClick('edit')}
          >          
            <img src={editIcon} alt="edit" className="size-4"/>

          </div>
          <div 
            className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 bg-white transition duration-300 cursor-pointer"
            onClick={handleActionClick('delete')}
          >          
            <img src={deleteIcon} alt="delete" className="size-4"/>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;