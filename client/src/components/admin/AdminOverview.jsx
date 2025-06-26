import { FaUsers, FaDumbbell, FaBox, FaShoppingBag } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminOverview = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Total Exercises', value: '567', icon: FaDumbbell, color: 'bg-green-500' },
    { title: 'Products', value: '89', icon: FaBox, color: 'bg-yellow-500' },
    { title: 'Orders', value: '45', icon: FaShoppingBag, color: 'bg-purple-500' },
  ];

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 45, 35, 50, 40, 60],
        borderColor: '#ff2625',
        backgroundColor: 'rgba(255, 38, 37, 0.1)',
        tension: 0.4,
        pointRadius: 5,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Sales' }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="text-white text-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <Line data={salesData} options={chartOptions} />
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { icon: FaUsers, text: 'New user registered', color: 'text-blue-500', time: '5 mins ago' },
              { icon: FaShoppingBag, text: 'New order received', color: 'text-purple-500', time: '15 mins ago' },
              { icon: FaBox, text: 'Product stock updated', color: 'text-yellow-500', time: '1 hour ago' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <item.icon className={`${item.color} text-lg mr-3`} />
                  <span className="text-gray-700">{item.text}</span>
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
