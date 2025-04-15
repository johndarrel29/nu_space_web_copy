import { MainLayout } from "../../components";


export default function UserMgmtPage() {
    return (
        <MainLayout
        tabName="User Management"
        headingTitle="Approve User Membership"
        >
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">User Management Page</h1>
                <p className="text-lg">This is the User Management page content.</p>
            </div>
        </MainLayout>

    );
}