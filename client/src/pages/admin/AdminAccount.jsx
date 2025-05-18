import { MainLayout, Button, TextInput, Badge } from "../../components";

export default function AdminAccount() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <MainLayout tabName="Admin Account" headingTitle="Admin Full Name">
      <div className="border border-mid-gray bg-white rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-16 fill-gray-500" viewBox="0 0 512 512">
                <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/>
              </svg>
              <Badge text="Admin" style="primary" />
              <div className="font-semibold text-lg">
                <h1>Admin Adminedo</h1>
              </div>
              <p className="text-sm text-gray-600">sdao@national-u.edu.ph</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-sm text-gray-500 font-light">Profile Details</h2>

            <div className="bg-light-gray rounded h-[80px] flex justify-center items-center p-2 border border-mid-gray">
              other details
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <TextInput type="password" placeholder="Enter new password" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <TextInput type="password" placeholder="Confirm new password" />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button style="primary">Save</Button>
              <Button style="secondary">Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
