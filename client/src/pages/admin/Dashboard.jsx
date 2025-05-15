import { MainLayout, NumberPane } from "../../components";
import  RenderLineChart  from "../../components/charts/RenderLineChart";


export default function Dashboard() {
    return (
        <>
            <MainLayout
            tabName="Dashboard"
            headingTitle="See previous updates"
            > 
                <div className="lg:flex gap-3 md:flex gap-2 xs: grid grid-cols-1 ">
                    <NumberPane title="Approved Activities" number="16"> </NumberPane>
                    <NumberPane title="Pending Activities" number="70"> </NumberPane>
                    <NumberPane title="Pending Activities" number="70"> </NumberPane>
                </div>
            <div className="border border-mid-gray bg-white rounded-lg p-4 mt-4">
                <RenderLineChart></RenderLineChart>

            </div>
            </MainLayout>

        </>
    );
    }