import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const mockData = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 200 },
  { name: 'Wed', users: 150 },
  { name: 'Thu', users: 300 },
  { name: 'Fri', users: 250 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

const RenderPieChart = () => (
  <PieChart width={500} height={300}>
    <Pie
      data={mockData}
      dataKey="users"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      fill="#8884d8"
      label
    >
      {mockData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default RenderPieChart;
