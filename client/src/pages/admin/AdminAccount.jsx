import { MainLayout, Button, TextInput, Badge } from "../../components";



export default function AdminAccount() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <>
            <MainLayout
            tabName="Admin Account"
            headingTitle="Admin Full Name"
            > 
            <div className="border border-mid-gray bg-white rounded-lg p-4">
                <div className="flex gap-4 items-start justify-center">
                    {/* profile overview */}
                    <div className="w-1/2">
                        <div className="flex flex-col gap-2 justify-center items-start">
                            <div className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-12 fill-gray-500" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                                <div className="flex flex-col items-start">
                                    <Badge text={"Admin"} style={"primary"}/>
                                    <div className="flex  gap-1 font-semibold text-lg">
                                        <h1>Admin</h1>
                                        <h1>Adminedo</h1>
                                    </div>
                                    <h1 className="text-sm text-gray-600">sdao@national-u.edu.ph</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* profile input fields for edit */}
                    <div className=" w-full">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-sm color-gray-400 font-light">Profile Details</h1>
                            <div className="bg-light-gray rounded h-[80px] flex justify-center items-center p-2 border border-mid-gray">
                                other details
                            </div>
                            <div children="flex flex-col gap-2">
                                <label> Password</label>
                                <TextInput type="password" placeholder={"password"}></TextInput>
                            </div>
                            <div children="flex flex-col gap-2">
                                <label>Confirm Password</label>
                                <TextInput type="password" placeholder={"password"}></TextInput>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button  style={"primary"}>Save</Button>
                            <Button  style={"secondary"}>Cancel</Button>
                        </div>
                    </div>

                </div>
            </div>
                
            </MainLayout>

        </>
    );
    }