import { useEffect, useState } from 'react';
import { 
  Loader, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import StoreRevenueChart from '../components/StoreRevenueChart';

// Metric Card Component
const MetricCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <Icon className="h-8 w-8 opacity-75" />
      </div>
    </div>
  );
};

// Prediction Chart Component
const PredictionChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-500">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Risk Assessment Component
const RiskAssessment = ({ risks }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getRiskColor(risk.level)}`}>
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{risk.title}</p>
                <p className="text-sm opacity-75">{risk.description}</p>
                <p className="text-xs mt-1 font-medium">Impact: {risk.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// Main Analytics Page Component
const AnalyticsPage = () => {
  const [inventory, setInventory] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryData, transfersData] = await Promise.all([
        api.get('/api/inventory/'),
        api.get('/api/transfers/')
      ]);
      
      setInventory(inventoryData);
      setTransfers(transfersData);
      generateAnalytics(inventoryData, transfersData);
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalytics = (inventoryData, transfersData) => {
    // Revenue projections
    const totalRevenue = inventoryData.reduce((sum, item) => 
      sum + (item.expected_sales * item.final_price), 0
    );
    
    const potentialLoss = inventoryData
      .filter(item => item.days_to_expiry <= 7)
      .reduce((sum, item) => sum + (item.stock * item.final_price), 0);

    // Demand predictions
    const demandPredictions = inventoryData
      .slice(0, 10)
      .map(item => ({
        label: `${item.product_name} (${item.store_id})`,
        value: Math.round(item.predicted_demand)
      }));

    // Risk assessment
    const risks = [
      {
        title: "High Expiry Risk Items",
        description: `${inventoryData.filter(item => item.days_to_expiry <= 7).length} items expiring within 7 days`,
        level: inventoryData.filter(item => item.days_to_expiry <= 7).length > 10 ? "High" : "Medium",
        impact: `₹${potentialLoss.toLocaleString()} potential loss`
      },
      {
        title: "Overstocking Risk",
        description: `${inventoryData.filter(item => item.stock > item.expected_sales * 2).length} items significantly overstocked`,
        level: inventoryData.filter(item => item.stock > item.expected_sales * 2).length > 5 ? "High" : "Low",
        impact: "Capital tied up, storage costs"
      },
      {
        title: "Transfer Efficiency",
        description: `${transfersData.filter(t => t.distance_km > 20).length} long-distance transfers suggested`,
        level: transfersData.filter(t => t.distance_km > 20).length > 5 ? "Medium" : "Low",
        impact: "Increased logistics costs"
      }
    ];

    // Store performance
    const storePerformance = [...new Set(inventoryData.map(item => item.store_id))]
      .map(storeId => {
        const storeItems = inventoryData.filter(item => item.store_id === storeId);
        const efficiency = Math.round(
          (storeItems.reduce((sum, item) => sum + (item.expected_sales / item.stock), 0) / storeItems.length) * 100
        );
        const expiringItems = storeItems.filter(item => item.days_to_expiry <= 7).length;
        const wasteRisk = expiringItems > 3 ? "High" : expiringItems > 1 ? "Medium" : "Low";
        const revenue = storeItems.reduce((sum, item) => sum + (item.expected_sales * item.final_price), 0);
        
        return {
          id: storeId,
          efficiency: Math.min(efficiency, 100),
          wasteRisk,
          revenue: Math.round(revenue)
        };
      });

    setAnalytics({
      totalRevenue,
      potentialLoss,
      demandPredictions,
      risks,
      storePerformance,
      totalProducts: inventoryData.length,
      totalTransfers: transfersData.length,
      avgDaysToExpiry: Math.round(inventoryData.reduce((sum, item) => sum + item.days_to_expiry, 0) / inventoryData.length),
      highDemandItems: inventoryData.filter(item => item.predicted_demand > 200).length
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Predictions</h1>
        <p className="text-gray-600">Data-driven insights for inventory optimization and business intelligence</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Projected Revenue"
          value={`₹${(analytics.totalRevenue / 100000).toFixed(1)}L`}
          change="+12.5%"
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Potential Loss"
          value={`₹${(analytics.potentialLoss / 1000).toFixed(0)}K`}
          change="-8.3%"
          changeType="decrease"
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Avg Days to Expiry"
          value={analytics.avgDaysToExpiry}
          change="+2 days"
          changeType="increase"
          icon={Calendar}
          color="yellow"
        />
        <MetricCard
          title="High Demand Items"
          value={analytics.highDemandItems}
          change="+15%"
          changeType="increase"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PredictionChart 
          data={analytics.demandPredictions} 
          title="Top 10 Demand Predictions"
        />
        <RiskAssessment risks={analytics.risks} />
      </div>

      {/* Store Performance */}
      <div className="mb-8">
        <StoreRevenueChart stores={analytics.storePerformance} />
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Activity className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                {Math.round((analytics.highDemandItems / analytics.totalProducts) * 100)}% of products show high demand potential
              </p>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                Average inventory turnover suggests {analytics.avgDaysToExpiry > 30 ? 'healthy' : 'tight'} stock management
              </p>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                {analytics.totalTransfers} inter-store transfers recommended for optimization
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Target className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                Focus on high-demand items to maximize revenue potential
              </p>
            </div>
            <div className="flex items-start">
              <Package className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                Implement dynamic pricing for items nearing expiry
              </p>
            </div>
            <div className="flex items-start">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <p className="text-sm text-gray-700">
                Optimize stock levels based on predicted demand patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;