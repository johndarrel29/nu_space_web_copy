import { TabSelector, Button, BackendTable } from "../../components";


export default function AdminDocuments() {
    const tabs = [
        { label: "All" },
        { label: "General Documents" },
        { label: "Activity Documents" }
    ]

    return (
        <div>
            <div className="flex justify-between items-center w-full mb-4">
                <TabSelector tabs={tabs} />
                <Button style={"secondary"}>Document Templates</Button>
            </div>
            <BackendTable />
        </div>
    );
}