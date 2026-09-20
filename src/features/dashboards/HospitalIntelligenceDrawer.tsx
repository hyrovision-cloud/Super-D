import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database,
  History,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ownerIntelligenceApi,
  OwnerAiResponse,
  OwnerAiInsight,
} from '@/services/api/ownerIntelligenceApi';
import { useBranch } from '@/app/providers/BranchProvider';

interface HospitalIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUESTION_CHIPS = [
  'Summarize this month’s revenue.',
  'Compare all branches.',
  'Which branch needs attention?',
  'Show top revenue categories.',
  'Give weekly management actions.',
];

export const HospitalIntelligenceDrawer: React.FC<HospitalIntelligenceDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedBranchId } = useBranch();
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<OwnerAiResponse | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      const hist = await ownerIntelligenceApi.getQueryHistory();
      setHistory(hist || []);
    } catch {
      // Ignored if offline
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setQueryInput(queryText);
    setIsLoading(true);
    setError(null);

    try {
      const res = await ownerIntelligenceApi.queryIntelligence(queryText, {
        branchId: selectedBranchId,
      });
      setResponse(res);
      fetchHistory();
    } catch (err: any) {
      setError(
        err.message ||
          'Hospital Intelligence encountered an error communicating with the analytical service. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeverityIcon = (severity: OwnerAiInsight['severity']) => {
    switch (severity) {
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-mint-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-critical-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-clinical-600 shrink-0" />;
    }
  };

  const getSeverityBg = (severity: OwnerAiInsight['severity']) => {
    switch (severity) {
      case 'positive':
        return 'bg-mint-50 border-mint-200 text-mint-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'critical':
        return 'bg-critical-50 border-critical-200 text-critical-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Hospital Intelligence"
      subtitle="Executive AI Command Copilot — Powered by Hardened Analytical Aggregations"
      width="xl"
    >
      <div className="flex flex-col h-full space-y-5">
        {/* Guardrail Banner */}
        <div className="bg-navy-50 border border-navy-100 rounded-lg p-3 text-xs text-navy-800 flex items-start gap-2.5">
          <Database className="w-4 h-4 text-clinical-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Owner-Governed Intelligence: </span>
            This copilot queries verified MongoDB aggregation pipelines through 8 allow-listed analytical tools. RAG is prohibited from computing numerical totals, ensuring 100% financial consistency.
          </div>
        </div>

        {/* Query Input Box */}
        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery(queryInput)}
              placeholder="Ask a strategic, financial, or operational question..."
              className="w-full pl-3 pr-24 py-2.5 text-sm bg-white border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-500 shadow-xs"
              disabled={isLoading}
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecuteQuery(queryInput)}
                disabled={isLoading || !queryInput.trim()}
                className="gap-1.5"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Ask
              </Button>
            </div>
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SAMPLE_QUESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExecuteQuery(chip)}
                disabled={isLoading}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 py-6">
            <div className="flex items-center gap-3 text-sm text-clinical-700 font-medium">
              <RefreshCw className="w-4 h-4 animate-spin text-clinical-600" />
              <span>Executing allow-listed aggregation tools & synthesizing insights...</span>
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-critical-50 border border-critical-200 rounded-lg p-4 text-critical-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <AlertCircle className="w-4 h-4 text-critical-600" />
              Intelligence Query Failed
            </div>
            <p className="text-xs text-critical-700">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExecuteQuery(queryInput)}
              className="text-xs"
            >
              Retry Query
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !response && (
          <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 my-auto">
            <div className="w-12 h-12 bg-clinical-50 text-clinical-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-900">Hospital Intelligence Command Center</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click any prompt chip above or type your own question to analyze cross-branch financial performance, patient footfall, and operational risks.
              </p>
            </div>
          </div>
        )}

        {/* Result State */}
        {!isLoading && !error && response && (
          <div className="space-y-4 overflow-y-auto pr-1 pb-4">
            {/* Scope & Sources Header */}
            <div className="flex flex-wrap items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 gap-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Period: <strong>{response.summary.period}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Scope: <strong>{response.summary.branchScope}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Sources:</span>
                {response.sources.map((s, idx) => (
                  <Badge key={idx} variant="info" className="text-[10px] py-0 px-1.5">
                    {s.tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Executive Answer Card */}
            <div className="bg-white border-2 border-clinical-200 rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-clinical-800 font-semibold text-xs tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-clinical-600" />
                Executive Summary
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                {response.answer}
              </p>
            </div>

            {/* Severity-coded Insights */}
            {response.insights?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Strategic Insights ({response.insights.length})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {response.insights.map((ins, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-start gap-2.5 ${getSeverityBg(
                        ins.severity
                      )}`}
                    >
                      {renderSeverityIcon(ins.severity)}
                      <div className="space-y-1">
                        <div className="text-xs font-bold">{ins.title}</div>
                        <div className="text-xs opacity-90 leading-snug">{ins.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {response.recommendedActions?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-clinical-600" />
                  Recommended Management Actions
                </h5>
                <ul className="space-y-2">
                  {response.recommendedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-clinical-500 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analytical Visualizations */}
            {response.charts?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-clinical-600" />
                  Visual Breakdowns
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {response.charts.map((chart, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="text-xs font-semibold text-slate-800">{chart.title}</div>
                      <div className="space-y-1.5">
                        {chart.data.map((d, dIdx) => (
                          <div key={dIdx} className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-600">
                              <span>{d.label}</span>
                              <span className="font-semibold">₹{(d.value / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-clinical-600 h-full rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (d.value / (chart.data[0]?.value || 1)) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Toggle for Query History */}
        <div className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            {showHistory ? 'Hide Query History' : `Query Audit History (${history.length})`}
          </button>
          <span className="text-[11px] text-slate-400">Strictly Owner Scoped</span>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto text-xs">
            <div className="font-semibold text-slate-700">Recent Invocations:</div>
            {history.length === 0 ? (
              <div className="text-slate-400">No previous queries logged in this session.</div>
            ) : (
              <div className="space-y-1.5">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleExecuteQuery(h.query)}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:border-clinical-400 cursor-pointer flex justify-between items-center"
                  >
                    <span className="truncate pr-2">{h.query}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{h.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};
