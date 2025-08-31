import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, FileText, Brain, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();

  // Mock data for the specific report
  const reportData = {
    startupName: 'TechFlow Solutions',
    founderName: 'Sarah Johnson',
    score: 85,
    documentsAnalyzed: 4,
    analysisDate: '2024-01-15',
    status: 'completed'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Report Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered analysis results for {reportData.startupName}
          </p>
        </div>

        {/* Report Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{reportData.startupName}</h2>
              <p className="text-gray-600">Founded by {reportData.founderName}</p>
              <p className="text-sm text-gray-500">Analysis completed on {new Date(reportData.analysisDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{reportData.score}/100</div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Market Score</p>
                <p className="text-2xl font-bold text-gray-900">78</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Potential</p>
                <p className="text-2xl font-bold text-gray-900">92</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Score</p>
                <p className="text-2xl font-bold text-gray-900">88</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.documentsAnalyzed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Market Risk</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Financial Risk</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Competition Risk</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Strong market positioning with clear competitive advantages</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Experienced founding team with relevant industry expertise</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Moderate competition in target market segment</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Scalable business model with strong growth potential</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Analysis Summary</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Based on the comprehensive analysis of {reportData.documentsAnalyzed} documents, {reportData.startupName} demonstrates strong potential for success. 
            The startup shows excellent market positioning with a clear value proposition and experienced leadership. 
            The business model is scalable and the team has the necessary expertise to execute their vision. 
            While there is moderate competition in the market, the startup's unique approach and strong founding team provide a solid foundation for growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
