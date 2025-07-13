import { useEffect, useState } from 'react';
import InventoryPage from './pages/InventoryPage';
import PredictionsPage from './pages/PredictionsPage';
import TransferSuggestionsPage from './pages/TransferSuggestionsPage';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import Navbar from './components/Navbar';


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      pingBackend();
      console.log("Hi");
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'inventory':
        return <InventoryPage />;
      case 'upload':
        return <UploadPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'transfers':
        return <TransferSuggestionsPage />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main>
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 SmartStockX - Walmart Hackathon Project
            </p>
            <p className="text-gray-400 mt-2">
              Optimizing retail inventory with AI and machine learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;