import { MainLayout } from "../../components";


export default function RSOAccountPage() {
    return (
        <MainLayout
        tabName="RSO Account"
        headingTitle="View RSO Account Details"
        >
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">RSOAccount Page</h1>
                <p className="text-lg">This is the RSOAccount page content.</p>
            </div>
        </MainLayout>

    );
}