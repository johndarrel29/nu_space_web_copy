import { Outlet } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';


export default function Activities() {
    const navigate = useNavigate();

    return (
    <>
    <div className="flex justify-center items-center">
        <div className="flex flex-row gap-4 items-center">
            <div className="w-32 h-32 bg-blue-500 rounded-full"></div>
                <div className="flex flex-col">
                <div className="font-semibold text-xl">Profile Name</div>
                <div className="font-light text-gray-600">Position</div>
            </div>
        </div>
    </div>
    
    {/* Table UI */}

    <div className="flex flex-col w-full mt-6">
        <Outlet/>
        <ActivitiesTable   navigate={navigate}  />
    </div>

    </>
    );

    function ActivitiesTable({navigate}) {
      return (<table className="min-w-full border-collapse border border-gray-200 shadow-md">
    <thead>
      <tr className="bg-gray-100 text-gray-700">
        <th className="border border-gray-300 px-4 py-2 text-left">Document</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Activity Name</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Activity Status</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Document Status</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Date of Creation</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-gray-50" onClick={() => navigate("requirements")}>
        <td className="border border-gray-300 px-4 py-2">Culminating Activity</td>
        <td className="border border-gray-300 px-4 py-2">Pending</td>
        <td className="border border-gray-300 px-4 py-2 text-green-600">Approved</td>
        <td className="border border-gray-300 px-4 py-2">15/02/2025</td>
      </tr>
    </tbody>
  </table>);
    }
  }