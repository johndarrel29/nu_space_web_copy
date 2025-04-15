import { MainLayout, Searchbar, Button } from "../../components";


export default function ActivityPage() {
    return (
        <MainLayout
        tabName="Dashboard"
        headingTitle="See previous updates"
        >
            <div className="flex flex-col items-center  min-h-screen bg-gray-100">
                <div className="w-[1000px]">
                    
                    <div className="bg-white h-auto w-full rounded-md shadow-md p-4 mt-4">
                        <div className="flex items-center justify-center space-x-10 ">
                            <h1>RSO Name</h1>
                            <h1>47 Activities Posted</h1>
                            <h1>14 Members</h1>
                        </div>
                    </div>

                    <div className="bg-white h-auto w-full rounded-md shadow-md p-4 mt-4">
                        <h2 className="text-2xl font-semibold mb-2">Table goes here</h2>
                        <div className="flex items-center justify-between space-x-2 ">
                            <div className="w-full">
                                <Searchbar
                                placeholder={"Search for activities..."}
                                />
                            </div>

                            <Button
                            className={"pr-4 pl-4 w-1/2"}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-white size-4" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>                              
                                    <h1>Create a new activity</h1>                                   
                                </div>
                            </Button>
                        </div>

                        <div className="flex items-center justify-between space-x-2 mt-4">
                            {/* Dropdown filters go here */}
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>

    );
}