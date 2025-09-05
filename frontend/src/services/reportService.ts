import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000';

export interface CreateReportData {
  startupName: string;
  launchDate: string;
  founderName: string;
  documents: Array<{
    file: File;
    type: string;
  }>;
}

export interface Report {
  report_id: string;
  report_name: string;
  startup_name: string;
  founder_name: string;
  launch_date?: string;  // Add launch date field
  status: 'pending' | 'success' | 'failed';
  created_at: string;
  is_pinned: boolean;
  is_delete: boolean;
  // Frontend interface compatibility
  id?: string;
  startupName?: string;
  founderName?: string;
  createdAt?: string;
  score?: number;
  documentsCount?: number;
}

export interface ReportList {
  reports: Report[];
  total: number;
  skip: number;
  limit: number;
}

class ReportService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  private jsonApi = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async createReport(data: CreateReportData): Promise<Report> {
    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append('startup_name', data.startupName);
      formData.append('launch_date', data.launchDate);
      formData.append('founder_name', data.founderName);
      
      // Add files and their types
      data.documents.forEach((doc, index) => {
        formData.append('files', doc.file);
        formData.append('file_types', doc.type);
      });

      const response = await this.api.post('/reports/', formData);
      return this.transformReportForFrontend(response.data);
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async getReports(
    skip: number = 0,
    limit: number = 100,
    search?: string,
    status?: string,
    pinnedOnly?: boolean
  ): Promise<ReportList> {
    try {
      const params = new URLSearchParams();
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());
      
      if (search) {
        params.append('search', search);
      }
      
      if (status) {
        params.append('status', status);
      }

      if (pinnedOnly) {
        params.append('pinned_only', 'true');
      }

      const response = await this.jsonApi.get(`/reports/?${params.toString()}`);
      
      // Transform the response to match frontend interface
      const transformedReports = response.data.reports.map((report: any) => 
        this.transformReportForFrontend(report)
      );
      
      return {
        ...response.data,
        reports: transformedReports
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReport(reportId: string): Promise<Report> {
    try {
      const response = await this.jsonApi.get(`/reports/${reportId}`);
      return this.transformReportForFrontend(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async getReportOutput(reportId: string): Promise<any> {
    try {
      const response = await this.jsonApi.get(`/reports/${reportId}`);
      return response.data; // raw JSON when backend returns analysis JSON
    } catch (error) {
      console.error('Error fetching report output:', error);
      throw error;
    }
  }

  async deleteReport(reportId: string): Promise<void> {
    try {
      await this.jsonApi.delete(`/reports/${reportId}`);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async togglePinReport(reportId: string): Promise<void> {
    try {
      await this.jsonApi.patch(`/reports/${reportId}/pin`);
    } catch (error) {
      console.error('Error toggling pin status:', error);
      throw error;
    }
  }

  // Transform backend report format to frontend format
  private transformReportForFrontend(report: any): Report {
    return {
      ...report,
      // Map backend fields to frontend interface
      id: report.report_id,
      startupName: report.startup_name,
      founderName: report.founder_name,
      createdAt: report.created_at,
      // Use actual file count from backend, fallback to 0 if not available
      documentsCount: report.file_count || 0,
      // Add mock data for frontend compatibility (only for score)
      score: report.status === 'success' ? Math.floor(Math.random() * 30) + 70 : 0, // Mock score 70-100
      // Map status to frontend format
      status: this.mapStatus(report.status)
    };
  }

  // Map backend status to frontend status
  private mapStatus(backendStatus: string): 'pending' | 'success' | 'failed' {
    switch (backendStatus) {
      case 'pending':
        return 'pending';
      case 'success':
        return 'success';
      case 'failed':
        return 'failed';
      default:
        return 'pending';
    }
  }
}

export const reportService = new ReportService();
