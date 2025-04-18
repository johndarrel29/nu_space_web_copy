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
        
            
            {/* <div className="bg-white h-auto w-full rounded-md shadow-md p-4 mt-4">
                <div className="flex items-center justify-between space-x-10 ">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="rounded-full h-8 w-8 bg-mid-gray"/>
                        <h1>RSO Name</h1>
                    </div>
                    
                    <h1>47 Activities Posted</h1>
                    <h1>14 Members</h1>
                </div>
            </div> */}

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
                className="flex justify-between space-x-2 mt-4 hover:bg-light-gray rounded-md p-4 cursor-pointer"
                onClick={() => navigate("activity-documents")}
                >
                    <div className="flex space-x-20">
                        <div className="flex items-center">
                            <h1 className="font-bold">1</h1>
                        </div>
                        <div className="flex flex-col items-center  space-y-2">
                            <div className="flex justify-center  space-x-2">
                                <div className="h-full w-[150px] rounded-md bg-gradient-to-b from-light-gray to-mid-gray"/>
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-center space-x-2">
                                        <h1 className="text-dark-gray font-bold">Activity Name</h1>
                                        <span class="bg-primary-rso text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Pending</span>                                           
                                    </div>
                                    <h1 className="text-dark-gray">16/04/2025</h1>
                                    <div className="bg-mid-gray h-[1px] w-full mt-4"/>
                                    <div className="flex items-center justify-start space-x-2 mt-2">
                                        <h1 className="text-dark-gray text-sm">7:00AM</h1>
                                        <h1 className="text-dark-gray text-sm">412MB</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1>Open for all</h1>
                    </div>
                </div>
            </div>
        

    </div>
    );
}