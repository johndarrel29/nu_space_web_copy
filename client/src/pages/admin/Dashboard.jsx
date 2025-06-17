import { MainLayout, NumberPane } from "../../components";
import RenderLineChart from "../../components/charts/RenderLineChart";
import RenderPieChart from "../../components/charts/RenderPieChart";

export default function Dashboard() {
  return (
    <>
      <MainLayout
        tabName="Dashboard"
        headingTitle="See previous updates"
      >
        {/* Responsive layout for number panes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
          <NumberPane title="Approved Activities" number="16" />
          <NumberPane title="Pending Activities" number="70" />
          <NumberPane title="Pending Activities" number="70" />
        </div>

        {/* Statistics section */}
        <div className="border border-mid-gray bg-white rounded-lg p-4 mt-4">
          <h1 className="text-lg font-bold mb-4">Statistics</h1>

          {/* Responsive layout for charts */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <RenderPieChart />
            <RenderLineChart />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
