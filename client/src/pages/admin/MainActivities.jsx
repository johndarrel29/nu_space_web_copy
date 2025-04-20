import { Outlet } from 'react-router-dom';
import defaultPic from '../../assets/images/default-profile.jpg';


export default function MainActivities() {


    return (
    <>
    <div className="flex items-center ">
        <div className="flex flex-row gap-4 items-center">
            <div className="w-32 h-32 bg-card-bg border border-gray-400 rounded-full"
            style={{
                backgroundImage: `url(${defaultPic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}></div>
                <div className="flex flex-col">
                <div className="font-semibold text-xl">Profile Name</div>
                <div className="font-light text-mid_gray">Professional</div>
            </div>
        </div>
    </div>


    
    {/* Table UI */}

    <div className="flex flex-col w-full mt-6">
      <Outlet/>
    </div>

    </>
    );


  }