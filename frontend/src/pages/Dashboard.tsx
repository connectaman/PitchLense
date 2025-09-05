import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reportService } from '../services/reportService';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'overall' | 'detailed'>('overall');
  const [activeAnalysisKey, setActiveAnalysisKey] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!reportId) {
          setError('Missing report id');
          return;
        }
        const output = await reportService.getReportOutput(reportId);
        setData(output);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err?.response?.data?.detail || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reportId]);

  const analysis = data?.startup_analysis;
  const radar = analysis?.radar_chart;
  const analyses = analysis?.analyses || {};
  const analysisKeys: string[] = Object.keys(analyses);

  useEffect(() => {
    if (analysisKeys.length > 0 && !activeAnalysisKey) {
      setActiveAnalysisKey(analysisKeys[0]);
    }
  }, [analysisKeys, activeAnalysisKey]);

  const radarData: Array<{ dimension: string; score: number }> = radar
    ? radar.dimensions.map((dim: string, idx: number) => ({ dimension: dim, score: radar.scores[idx] || 0 }))
    : [];

  const flattenedIndicators: Array<{ analysis: string; indicator: string; score: number; risk: string }> =
    Object.entries(analyses).flatMap(([key, a]: [string, any]) =>
      (Array.isArray(a?.indicators) ? a.indicators : []).map((ind: any) => ({
        analysis: a?.category_name || key,
        indicator: ind.indicator,
        score: ind.score,
        risk: (ind.risk_level || '').toLowerCase(),
      }))
    );

  const groupedIndicators: Array<{ analysis: string; rows: Array<{ indicator: string; score: number; risk: string }> }> =
    Object.entries(analyses)
      .map(([key, a]: [string, any]) => {
        const analysisName = a?.category_name || key;
        const inds: any[] = Array.isArray(a?.indicators) ? a.indicators : [];
        const rows = inds.map((ind: any) => ({
          indicator: ind.indicator,
          score: ind.score,
          risk: (ind.risk_level || '').toLowerCase(),
        }));
        return { analysis: analysisName, rows };
      })
      .filter(group => group.rows.length > 0);

  const getRiskTagClasses = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRiskDotBg = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  const scoreTagClasses = 'bg-indigo-100 text-indigo-800';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Detailed analysis selected content
  const selectedAnalysis: any = activeAnalysisKey ? analyses[activeAnalysisKey] : null;
  const hasIndicators = selectedAnalysis && Array.isArray(selectedAnalysis?.indicators) && selectedAnalysis.indicators.length > 0;
  const hasComparison = selectedAnalysis && Array.isArray(selectedAnalysis?.comparison_table) && selectedAnalysis.comparison_table.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Dashboard</h1>
          <p className="text-gray-600">Insights for report {reportId}</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overall')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'overall' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overall Analysis
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'detailed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Detailed Analysis
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium ${
                activeTab === 'view' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              View data
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'view' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Blank placeholder for future content */}
            <div className="text-gray-500 text-sm">No content yet.</div>
          </div>
        )}

        {activeTab === 'overall' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Radar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Risk Radar</h3>
              {radarData.length > 0 ? (
                <>
                  <div className="h-[560px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="80%">
                        <defs>
                          <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" />
                        <PolarRadiusAxis angle={30} domain={[0, radar?.scale || 10]} tickCount={(radar?.scale || 10) + 1} />
                        <Radar name="Score (1=Low, 10=High)" dataKey="score" stroke="#6366f1" fill="url(#riskGradient)" fillOpacity={0.6} />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 12 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Risk scale bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>1 • Low risk</span>
                      <span>10 • High risk</span>
                    </div>
                    <div className="h-3 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%)' }} />
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No radar data available.</div>
              )}
            </div>

            {/* Right: Table same height and scrollable */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">All Indicators</h4>
              <div className="h-[560px] overflow-y-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-2 px-4">Analysis</th>
                      <th className="py-2 px-4">Indicator</th>
                      <th className="py-2 px-4">Score (1 - 10)</th>
                      <th className="py-2 px-4">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedIndicators.map((group, gIdx) => (
                      <React.Fragment key={gIdx}>
                        {group.rows.map((row, rIdx) => (
                          <tr key={`${gIdx}-${rIdx}`} className="border-b odd:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                            {rIdx === 0 && (
                              <td rowSpan={group.rows.length} className="py-2 px-4 text-center align-top font-medium text-gray-900">
                                {group.analysis}
                              </td>
                            )}
                            <td className="py-2 px-4">{row.indicator}</td>
                            <td className="py-2 px-4">{row.score}</td>
                            <td className="py-2 px-4">
                              <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskTagClasses(row.risk)}`}>
                                <span className={`inline-block h-2 w-2 rounded-full ${getRiskDotBg(row.risk)}`} />
                                {row.risk || 'unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-6">
            {/* Sub-tabs for analyses */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200 px-4 pt-4 pb-4 mb-2">
                <div className="flex flex-wrap gap-2">
                  {analysisKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveAnalysisKey(key)}
                      className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                        activeAnalysisKey === key
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {analyses[key]?.category_name || key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected analysis content */}
              <div className="p-6">
                {!selectedAnalysis && (
                  <div className="text-gray-500 text-sm">No analysis selected.</div>
                )}

                {selectedAnalysis && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedAnalysis.category_name || activeAnalysisKey}</h3>
                      <div className="flex items-center gap-2">
                        {/* Overall risk tag */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskTagClasses((selectedAnalysis.overall_risk_level || selectedAnalysis.overall_benchmark_level || '').toLowerCase())}`}>
                          Overall: {selectedAnalysis.overall_risk_level || selectedAnalysis.overall_benchmark_level || 'N/A'}
                        </span>
                        {/* Overall score tag */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreTagClasses}`}>
                          Score: {selectedAnalysis.category_score ?? selectedAnalysis.benchmark_score ?? 'N/A'}
                        </span>
                      </div>
                    </div>

                    {hasIndicators && (
                      <div className="overflow-x-auto mb-6">
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr className="text-left text-gray-600 border-b">
                                <th className="py-2 px-4">Indicator</th>
                                <th className="py-2 px-4">Description</th>
                                <th className="py-2 px-4">Recommendation</th>
                                <th className="py-2 px-4">Score (1 - 10)</th>
                                <th className="py-2 px-4">Risk</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedAnalysis.indicators.map((ind: any, i: number) => (
                                <tr key={i} className="border-b align-top odd:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                                  <td className="py-2 px-4 font-medium text-gray-900">{ind.indicator}</td>
                                  <td className="py-2 px-4 max-w-xl">{ind.description}</td>
                                  <td className="py-2 px-4 max-w-xl">{ind.recommendation}</td>
                                  <td className="py-2 px-4">{ind.score}</td>
                                  <td className="py-2 px-4">
                                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskTagClasses((ind.risk_level || '').toLowerCase())}`}>
                                      <span className={`inline-block h-2 w-2 rounded-full ${getRiskDotBg((ind.risk_level || '').toLowerCase())}`} />
                                      {(ind.risk_level || '').toLowerCase() || 'unknown'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {hasComparison && (
                      <div className="overflow-x-auto mb-6">
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr className="text-left text-gray-600 border-b">
                                <th className="py-2 px-4">Metric</th>
                                <th className="py-2 px-4">Startup</th>
                                <th className="py-2 px-4">Peer Median</th>
                                <th className="py-2 px-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedAnalysis.comparison_table.map((row: any, i: number) => (
                                <tr key={i} className="border-b odd:bg-gray-50 hover:bg-blue-50/40 transition-colors">
                                  <td className="py-2 px-4 font-medium text-gray-900">{row.metric}</td>
                                  <td className="py-2 px-4">{row.startup}</td>
                                  <td className="py-2 px-4">{row.peer_median}</td>
                                  <td className="py-2 px-4">{row.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedAnalysis.summary && (
                      <div className="flex items-start">
                        <p className="text-gray-700 leading-relaxed">{selectedAnalysis.summary}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
