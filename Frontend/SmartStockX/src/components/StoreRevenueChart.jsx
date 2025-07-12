import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Store, DollarSign } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Store Revenue Line Chart Component
const StoreRevenueChart = ({ stores = [] }) => {
  // Calculate summary statistics
  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);
  const avgRevenue = stores.length > 0 ? totalRevenue / stores.length : 0;
  const maxRevenue = stores.length > 0 ? Math.max(...stores.map(s => s.revenue)) : 0;
  const topStore = stores.find(s => s.revenue === maxRevenue);

  const data = {
    labels: stores.map(store => `Store ${store.id}`),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: stores.map(store => store.revenue),
        fill: true,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
          borderDash: [2, 2]
        },
        ticks: {
          color: 'rgba(107, 114, 128, 1)',
          font: {
            size: 12,
            weight: '500'
          },
          callback: value => `₹${(value / 1000).toFixed(0)}K`
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Store Revenue Overview</h3>
              <p className="text-sm text-gray-600">Performance across all store locations</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ₹{(totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <Store className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{stores.length}</div>
            <div className="text-xs text-gray-500">Total Stores</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">₹{(avgRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">Avg Revenue</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {topStore ? `Store ${topStore.id}` : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Top Performer</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          {stores.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No store data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Revenue (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StoreRevenueChart;