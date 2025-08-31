
import React from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateReport = () => {
    navigate('/create-report');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              AI-Powered Startup Evaluation
            </span>
            {/* Glare Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your startup analysis with advanced AI insights. Get comprehensive reports, risk assessments, and investment recommendations.
          </p>
        </div>

        {/* Create Report Section */}
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-lg border border-gray-200 max-w-2xl w-full text-center hover:shadow-xl transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Create your first AI-powered startup evaluation report in minutes. 
              Upload documents, analyze data, and get comprehensive insights.
            </p>
            <button 
              onClick={handleCreateReport}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
