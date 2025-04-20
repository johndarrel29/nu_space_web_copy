import { 
    Searchbar, 
    Button, 
    ReusableDropdown
} from "../../components";
import { useNavigate } from 'react-router-dom';


export default function MainActivityPage() {
    const navigate = useNavigate();

    return(
    <div className="flex flex-col items-center  h-auto bg-gray-100">


            <div className="bg-white h-auto w-full rounded-lg shadow-md p-4 mt-4">

                <div className="flex items-center justify-between space-x-2 ">
                    <div className="w-full">
                        <Searchbar
                        placeholder={"Search for activities..."}
                        />
                    </div>

                    <Button
                    className={"pr-4 pl-4 w-1/2"}
                    onClick={() => navigate("create-activity")}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-white size-4" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>                              
                            <h1>Create a new activity</h1>                                   
                        </div>
                    </Button>
                </div>

                <div className="flex items-center justify-between space-x-2 mt-4">
                    <div className="w-1/4">
                        <ReusableDropdown 
                        showAllOption={true}
                        options={["Most Recent", "Most Viewed", "Cherry"]} />
                    </div>

                    <div>
                        <h1 className="text-dark-gray">Showing 10 Entries</h1>
                    </div>
                </div>
                
            {/* Activity Card */}
            <div 
    className="flex justify-between items-center space-x-4 mt-4 p-4 rounded-md cursor-pointer hover:bg-gray-200 hover:shadow-sm transition duration-150 ease-in-out"
    onClick={() => navigate("activity-documents")}
>
    <div className="flex items-start space-x-6">
        <h1 className="font-bold text-xl">1</h1>
        <div className="flex space-x-4">
            <div className="w-[200px] h-[120px] rounded-md bg-gradient-to-b from-light-gray to-mid-gray" />
            <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                    <h1 className="text-black font-semibold text-lg">Activity Name</h1>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Pending</span>
                </div>
                <h2 className="text-gray-600 text-sm mt-1">16/04/2025</h2>
                <div className="bg-gray-300 h-[1px] w-full my-2" />
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>7:00AM</span>
                    <span>412MB</span>
                </div>
            </div>
        </div>
    </div>
    <div className="flex flex-col items-center ">
        <div className="flex items-center justify-end gap-1 text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-current" viewBox="0 0 320 512"><path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z"/></svg>
            <span>1,247</span>
        </div>
        <span className="text-sm text-gray-700">Open for all</span>
        
    </div>
</div>

            </div>
        

    </div>
    );
}