import { TabSelector, Button, BackendTable } from "../../components";
import { useState } from "react";

export default function AdminDocuments() {
    const tabs = [
        { label: "All" },
        { label: "General Documents" },
        { label: "Activity Documents" }
    ]
    const [activeTab, setActiveTab] = useState(0);

    const onTabChange = (index) => {
        setActiveTab(index);
    }

    return (
        <div>
            <div className="flex justify-between items-center w-full mb-4">
                <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
                <Button style={"secondary"}>Document Templates</Button>
            </div>
            {<BackendTable activeTab={activeTab} />}
        </div>
    );
}