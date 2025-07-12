import React from 'react';
import { Package, TrendingUp, BarChart3, Users, Shield, Zap, ArrowRightLeft, Brain, Clock } from 'lucide-react';

const LandingPage = ({ setCurrentPage }) => {
  const features = [
    {
      icon: Brain,
      title: "ML Predictions",
      description: "Advanced machine learning algorithms predict demand patterns and optimize inventory levels",
      iconColor: "bg-blue-500"
    },
    {
      icon: ArrowRightLeft,
      title: "Smart Transfers",
      description: "Automated transfer recommendations based on real-time demand and expiry analysis",
      iconColor: "bg-green-500"
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Comprehensive inventory tracking with real-time updates across all store locations",
      iconColor: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Price Optimization",
      description: "AI-powered price suggestions to maximize sales and reduce waste",
      iconColor: "bg-orange-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time dashboards with sales forecasting and performance metrics",
      iconColor: "bg-red-500"
    },
    {
      icon: Shield,
      title: "Loss Prevention",
      description: "Early expiry alerts and automated transfer recommendations",
      iconColor: "bg-teal-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Inventory Management
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Smart<span className="text-blue-600">Stock</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">X</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Optimize inventory transfer between retail stores using ML-powered demand prediction and intelligent logistics.
            Everything you need to manage inventory efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentPage('inventory')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              View Inventory
            </button>
            <button
              onClick={() => setCurrentPage('predictions')}
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              See Predictions
            </button>
          </div>
        </div>


        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Inventory
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and features designed to streamline your operations and boost
            profitability across all locations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 hover:shadow-lg hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${feature.iconColor} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of retailers who trust SmartStockX for their inventory optimization needs.
            </p>
            <button
              onClick={() => setCurrentPage('upload')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 cursor-pointer"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;