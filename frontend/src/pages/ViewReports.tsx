import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, TrendingUp, Eye, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Report {
  id: string;
  startupName: string;
  founderName: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'pending';
  score: number;
  documentsCount: number;
}

const ViewReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      startupName: 'TechFlow Solutions',
      founderName: 'Sarah Johnson',
      createdAt: '2024-01-15',
      status: 'completed',
      score: 85,
      documentsCount: 4
    },
    {
      id: '2',
      startupName: 'GreenEnergy Innovations',
      founderName: 'Michael Chen',
      createdAt: '2024-01-12',
      status: 'completed',
      score: 92,
      documentsCount: 6
    },
    {
      id: '3',
      startupName: 'HealthTech Pro',
      founderName: 'Emily Rodriguez',
      createdAt: '2024-01-10',
      status: 'processing',
      score: 0,
      documentsCount: 3
    },
    {
      id: '4',
      startupName: 'EduConnect Platform',
      founderName: 'David Kim',
      createdAt: '2024-01-08',
      status: 'pending',
      score: 0,
      documentsCount: 2
    },
    {
      id: '5',
      startupName: 'FinTech Solutions',
      founderName: 'Alex Thompson',
      createdAt: '2024-01-05',
      status: 'completed',
      score: 78,
      documentsCount: 5
    },
    {
      id: '6',
      startupName: 'AI Analytics Corp',
      founderName: 'Lisa Wang',
      createdAt: '2024-01-03',
      status: 'completed',
      score: 89,
      documentsCount: 7
    },
    {
      id: '7',
      startupName: 'Cloud Security Pro',
      founderName: 'Robert Davis',
      createdAt: '2024-01-01',
      status: 'processing',
      score: 0,
      documentsCount: 4
    },
    {
      id: '8',
      startupName: 'Mobile Gaming Studio',
      founderName: 'Jennifer Lee',
      createdAt: '2023-12-28',
      status: 'completed',
      score: 76,
      documentsCount: 3
    }
  ]);

  const handleReportClick = (reportId: string) => {
    navigate(`/dashboard/${reportId}`);
  };

  const handleDeleteReport = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      setReports(reports.filter(report => report.id !== reportId));
      // Reset to first page if current page becomes empty
      const newTotalPages = Math.ceil((reports.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.founderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                View Reports
              </h1>
              <p className="text-lg text-gray-600">
                Access and review your AI-powered startup evaluation reports.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Reports Count and Items Per Page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
          </p>
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentReports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteReport(e, report.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {report.startupName}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{report.founderName}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{report.documentsCount} documents</span>
                  </div>
                  
                  {report.status === 'completed' && (
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{report.score}/100</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors">
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
            </div>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No reports found' : 'No reports yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No reports match "${searchTerm}". Try adjusting your search terms.`
                : 'Create your first startup evaluation report to get started.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;
