import { TabSelector, Button, BackendTable } from "../../../components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainAdmin() {
    const navigate = useNavigate();
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
                <Button style={"secondary"} onClick={() => {
                    // Navigate to templates page
                    navigate("templates");
                }}>Document Templates</Button>
            </div>
            {<BackendTable activeTab={activeTab} />}
        </div>
    );
}
