import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const mockData = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 200 },
  { name: 'Wed', users: 150 },
  { name: 'Thu', users: 300 },
  { name: 'Fri', users: 250 },
];

const RenderLineChart = () => (
  <LineChart
    width={500}
    height={300}
    data={mockData}
    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
);

export default RenderLineChart;
