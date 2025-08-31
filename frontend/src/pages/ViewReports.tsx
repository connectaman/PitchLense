import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, TrendingUp, Eye, Trash2, Search, ChevronLeft, ChevronRight, Loader2, Filter, Pin } from 'lucide-react';
import { reportService, Report } from '../services/reportService';
import { showConfirmDialog, showErrorToast, showSuccessToast } from '../utils/notifications';

const ViewReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReports, setTotalReports] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const skip = (currentPage - 1) * itemsPerPage;
      
      const response = await reportService.getReports(
        skip, 
        itemsPerPage, 
        searchTerm, 
        statusFilter || undefined,
        pinnedOnly
      );
      
      setReports(response.reports);
      setTotalReports(response.total);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.detail || 'Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports when component mounts or dependencies change
  useEffect(() => {
    fetchReports();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, pinnedOnly]);

  const handleReportClick = (reportId: string) => {
    navigate(`/dashboard/${reportId}`);
  };

  const handleDeleteReport = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    const isConfirmed = await showConfirmDialog(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      'Delete',
      'Cancel'
    );
    
    if (isConfirmed) {
      try {
        await reportService.deleteReport(reportId);
        showSuccessToast('Report deleted successfully');
        // Refresh the reports list
        fetchReports();
      } catch (err: any) {
        console.error('Error deleting report:', err);
        showErrorToast(err.response?.data?.detail || 'Failed to delete report. Please try again.');
      }
    }
  };

  const handleTogglePin = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation(); // Prevent card click when clicking pin
    try {
      await reportService.togglePinReport(reportId);
      showSuccessToast('Report pin status updated successfully');
      // Refresh the reports list
      fetchReports();
    } catch (err: any) {
      console.error('Error toggling pin status:', err);
      showErrorToast(err.response?.data?.detail || 'Failed to toggle pin status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(totalReports / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalReports);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Loading state
  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            
            {/* Search and Filter Controls */}
            <div className="flex items-center space-x-3">
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
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  showFilters || statusFilter || pinnedOnly
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

                 {/* Filter Panel */}
         {showFilters && (
           <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
               <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                 {/* Status Filter */}
                 <div className="flex-1 min-w-0">
                   <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                     Status
                   </label>
                   <select
                     id="statusFilter"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   >
                     <option value="">All Statuses</option>
                     <option value="pending">Pending</option>
                     <option value="success">Completed</option>
                     <option value="failed">Failed</option>
                   </select>
                 </div>

                 {/* Pinned Only Toggle */}
                 <div className="flex items-center">
                   <label className="flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={pinnedOnly}
                       onChange={(e) => setPinnedOnly(e.target.checked)}
                       className="sr-only"
                     />
                     <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                       pinnedOnly ? 'bg-blue-600' : 'bg-gray-200'
                     }`}>
                       <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${
                         pinnedOnly ? 'translate-x-6' : 'translate-x-1'
                       }`} />
                     </div>
                     <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                       <Pin className="w-4 h-4 mr-1" />
                       Pinned Only
                     </span>
                   </label>
                 </div>
               </div>

               {/* Clear Filters */}
               {(statusFilter || pinnedOnly) && (
                 <button
                   onClick={() => {
                     setStatusFilter('');
                     setPinnedOnly(false);
                   }}
                   className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                 >
                   Clear Filters
                 </button>
               )}
             </div>
           </div>
         )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Reports Count and Items Per Page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing {startIndex + 1}-{endIndex} of {totalReports} reports
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
          {reports.map((report) => (
            <div
              key={report.report_id}
              onClick={() => handleReportClick(report.report_id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  {report.is_pinned && (
                    <div className="flex items-center text-yellow-600">
                      <Pin className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                  {/* Pin/Unpin Button */}
                  <button
                    onClick={(e) => handleTogglePin(e, report.report_id)}
                    className={`p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                      report.is_pinned 
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                    title={report.is_pinned ? 'Unpin report' : 'Pin report'}
                  >
                    <Pin className={`w-4 h-4 ${report.is_pinned ? 'fill-current' : ''}`} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteReport(e, report.report_id)}
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
                  {report.startup_name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{report.founder_name}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{report.documentsCount || 0} documents</span>
                  </div>
                  
                  {report.status === 'success' && (
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{report.score || 0}/100</span>
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

        {/* Loading indicator for pagination */}
        {loading && reports.length > 0 && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin mr-2" />
            <span className="text-gray-600">Loading...</span>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
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
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
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
