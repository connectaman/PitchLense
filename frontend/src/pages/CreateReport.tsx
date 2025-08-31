import React, { useState } from 'react';
import { Plus, Upload, X, FileText, Loader2 } from 'lucide-react';
import { reportService, CreateReportData } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../utils/notifications';

interface Document {
  id: string;
  file: File;
  type: string;
}

const CreateReport: React.FC = () => {
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [founderName, setFounderName] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentTypes = [
    'pitch deck',
    'call recording',
    'meeting recording',
    'founder profile',
    'news report',
    'company document'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: Document[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: 'pitch deck' // default type
      }));
      setDocuments([...documents, ...newDocuments]);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const updateDocumentType = (id: string, type: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, type } : doc
    ));
  };

  const handleGenerateReport = async () => {
    if (!startupName || !launchDate || !founderName || documents.length === 0) {
      showErrorToast('Please fill in all required fields and upload at least one document');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData: CreateReportData = {
        startupName,
        launchDate,
        founderName,
        documents: documents.map(doc => ({
          file: doc.file,
          type: doc.type
        }))
      };

      const report = await reportService.createReport(reportData);
      
      console.log('Report created successfully:', report);
      
      showSuccessToast('Report created successfully!');
      
      // Navigate to the reports list
      navigate('/reports');
      
    } catch (err: any) {
      console.error('Error creating report:', err);
      showErrorToast(err.response?.data?.detail || 'Failed to create report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Startup Report
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the startup details and upload relevant documents to generate your AI-powered evaluation report.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Startup Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Startup Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startupName" className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name *
                </label>
                <input
                  type="text"
                  id="startupName"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter startup name"
                  required
                />
              </div>
              <div>
                <label htmlFor="launchDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Launch Date *
                </label>
                <input
                  type="date"
                  id="launchDate"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="founderName" className="block text-sm font-medium text-gray-700 mb-2">
                  Founder Name *
                </label>
                <input
                  type="text"
                  id="founderName"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter founder name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Document Upload
            </h2>
            
            {/* Upload Button */}
            <div className="mb-6">
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to upload documents
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX, MP3, MP4, or image files accepted
                  </p>
                </div>
              </label>
              <input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.jpeg,.png"
              />
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Uploaded Documents ({documents.length})
                </h3>
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Generate Report Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateReport}
              disabled={!startupName || !launchDate || !founderName || documents.length === 0 || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
            {(!startupName || !launchDate || !founderName || documents.length === 0) && !isSubmitting && (
              <p className="text-sm text-gray-500 mt-2">
                Please fill in all required fields and upload at least one document
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
