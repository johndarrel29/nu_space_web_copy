
import defaultPic from '../../assets/images/default-picture.png';
import { useLocation } from 'react-router-dom';
import { ReusableTable } from '../../components';


export default function Activities() {
  const location = useLocation()
  const { activity } = location.state || {}; 

    // Sample documents data
    const documents = [
      { id: 1, name: "Activity Guidelines", type: "PDF", uploadedBy: "Admin" },
      { id: 2, name: "Event Proposal", type: "Word Document", uploadedBy: "RSO Leader" },
      { id: 3, name: "Budget Report", type: "Excel Sheet", uploadedBy: "Treasurer" },
    ];
  
    const tableHeading = [
      { id: 1, name: "Document Name", key: "name" },
      { id: 2, name: "Type", key: "type" },
      { id: 3, name: "Uploaded By", key: "uploadedBy" },
    ];
  

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="flex flex-row gap-4 items-center">
            <div className="w-32 h-32 bg-card-bg border border-gray-400 rounded-md"
            style={{
                backgroundImage: `url(${defaultPic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}></div>
              <div className="flex flex-col">
                <div className="font-semibold text-xl">{activity.Activity_name}</div>
                <div className="font-light text-mid_gray">{activity.RSO_id.RSO_name}</div>
            </div>


        </div>
        <div className='w-full h-[300px] flex flex-row justify-center items-center border border-mid-gray mt-2 rounded-md'>
              Activity Details
        </div>

        <div>
        <ReusableTable
            columnNumber={3}
            tableHeading={tableHeading}
            tableRow={documents}
            options={["All", "PDF", "Word Document", "Excel Sheet"]}
            value={"All"}
            onChange={(e) => console.log("Filter changed:", e.target.value)}
            showAllOption={true}
            onClick={(row) => console.log("Document clicked:", row)}
          />
        </div>
    </div>
    </>

  );

}