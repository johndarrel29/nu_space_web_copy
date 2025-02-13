import Sidebar from "../components/Sidebar";
import MainLayout from "../components/MainLayout";
import NumberPane from "../components/NumberPane"
import style from "../css/Dashboard.module.css"


export default function Dashboard() {
    return (
        <div>
            <MainLayout
            tabName="Dashboard"
            headingTitle="See previous updates"
            > 
                <div className="lg:flex gap-3 md:flex gap-2 mt-6 xs: grid grid-cols-1 ">
                    <NumberPane title="Approved Activities" number="16"> </NumberPane>
                    <NumberPane title="Pending Activities" number="70"> </NumberPane>
                    <NumberPane title="Pending Activities" number="70"> </NumberPane>
                </div>

            </MainLayout>

        </div>
    );
    }