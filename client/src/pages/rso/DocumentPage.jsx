import { MainLayout } from "../../components";

export default function DocumentPage() {
    return (
        <MainLayout
            tabName="Documents"
            headingTitle="View and Upload Documents"
        >
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Document Page</h1>
                <p className="text-lg">This is the document page content.</p>
            </div>
        </MainLayout>
    );
}