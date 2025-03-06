import { MainLayout, Button } from "../../components";



export default function AdminAccount() {
    return (
        <>
            <MainLayout
            tabName="Admin Account"
            headingTitle="Admin Full Name"
            > 
            <div className="grid grid-cols-2 gap-4">

            
                <div className="bg-gray-200 rounded-lg p-4 grid grid-col">
                    <div>
                        <h1 className="font-semibold text-xl mb-6">Profile Picture</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-32 h-32 bg-blue-500 rounded-full"></div>
                            <div className="flex flex-col">
                            <div>
                                <span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md dark:bg-indigo-900 dark:text-indigo-300">Admin</span>
                            </div>
                            <div className="font-semibold text-xl">Profile Name</div>
                            <div className="font-light text-gray-600">Position</div>
                        </div>
                    </div>
                    <div className="justify-end">
                        <Button label="Edit Details"/>
                    </div>
                    
                    
                </div>
                <div className="bg-gray-200 rounded-lg p-4">

                </div>
            </div>
                
            </MainLayout>

        </>
    );
    }