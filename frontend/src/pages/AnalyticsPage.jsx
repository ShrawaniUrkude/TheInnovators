import React, { useMemo, useState } from 'react';
import {
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ZAxis,
} from 'recharts';
import { BrainCircuit, Download, Lightbulb, Target, Sparkles, TrendingUp } from 'lucide-react';
import AlertItem from '../components/AlertItem';
import ChartCard from '../components/ChartCard';
import CustomTooltip from '../components/CustomTooltip';
import { useCityData } from '../hooks/useCityData';

const categoryColors = {
  Traffic: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
  Energy: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  Water: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4' },
  Transport: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
  Environment: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
};

const AnalyticsPage = () => {
  const [filter, setFilter] = useState('All');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const { cityName, areaName, data } = useCityData();
  const { aiInsights, alertsData, predictiveData, correlationMatrix } = data;
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const predictionMeta = useMemo(() => {
    const past = predictiveData.filter((p) => p.actual !== null);
    const future = predictiveData.filter((p) => p.actual === null);

    const lastActual = past.length ? past[past.length - 1].actual : null;
    const nextForecast = future.length ? future[0].predicted : null;
    const avgForecast = future.length
      ? Math.round(future.reduce((sum, p) => sum + p.predicted, 0) / future.length)
      : null;
    const delta = (lastActual !== null && nextForecast !== null) ? (nextForecast - lastActual) : 0;

    const risk = avgForecast === null
      ? 'N/A'
      : avgForecast >= 150
        ? 'High'
        : avgForecast >= 100
          ? 'Medium'
          : 'Low';

    return {
      past,
      future,
      lastActual,
      nextForecast,
      avgForecast,
      delta,
      risk,
    };
  }, [predictiveData]);

  const predictionText = useMemo(() => {
    const { future, lastActual, nextForecast, avgForecast, delta, risk } = predictionMeta;

    if (!future.length) {
      return {
        headline: 'Prediction data is not available yet.',
        summary: 'There is not enough historical AQI data to generate a forward-looking monthly forecast for this area.',
        periods: [],
        recommendation: 'Collect a longer history window and rerun the model.',
      };
    }

    const direction = delta > 0 ? 'increase' : delta < 0 ? 'decrease' : 'remain stable';
    const magnitude = Math.abs(delta);
    const riskText = risk === 'High'
      ? 'Air-quality pressure is expected to stay elevated and may affect outdoor exposure, congestion response, and public health planning.'
      : risk === 'Medium'
        ? 'Air quality is expected to stay under moderate pressure, so preventive controls should remain active.'
        : 'Air quality is expected to stay in a relatively controlled band if current conditions hold.';

    return {
      headline: `AQI is forecast to ${direction} over the next ${future.length} months for ${cityName} - ${areaName}.`,
      summary: `The latest observed AQI is ${lastActual ?? '--'}, the next month's forecast is ${nextForecast ?? '--'}, and the average projected AQI across the monthly forecast window is ${avgForecast ?? '--'}. This indicates a ${magnitude}-point ${delta === 0 ? 'change' : direction} from the latest observed value into the next month.`,
      periods: future.map((point, index) => {
        const previousValue = index === 0 ? lastActual : future[index - 1]?.predicted;
        const periodDelta = previousValue === null || previousValue === undefined
          ? 0
          : point.predicted - previousValue;
        const periodDirection = periodDelta > 0 ? 'rises' : periodDelta < 0 ? 'drops' : 'holds steady';
        const periodChange = periodDelta === 0 ? 'with no change' : `${Math.abs(periodDelta)} points ${periodDelta > 0 ? 'higher' : 'lower'}`;

        return `${point.day}: AQI is projected at ${point.predicted} and ${periodDirection} ${periodChange} than the previous month.`;
      }),
      recommendation: `${riskText} Recommended response: prioritize hotspot monitoring, traffic flow smoothing, and localized emission control in ${areaName}.`,
    };
  }, [areaName, cityName, predictionMeta]);

  const analyticsAlerts = useMemo(() => {
    const forecastAlert = predictionMeta.avgForecast === null
      ? null
      : {
        id: 'forecast-alert',
        type: predictionMeta.risk === 'High' ? 'critical' : predictionMeta.risk === 'Medium' ? 'warning' : 'info',
        title: `Monthly AQI outlook for ${areaName}`,
        message: `Next month's AQI is forecast at ${predictionMeta.nextForecast ?? '--'} with a 5-month average near ${predictionMeta.avgForecast}. Current risk level is ${predictionMeta.risk.toLowerCase()}.`,
        time: 'Forecast update',
        category: 'Environment',
      };

    const insightAlerts = aiInsights
      .filter((insight) => insight.impact === 'High' || insight.impact === 'Medium')
      .sort((left, right) => {
        const impactWeight = { High: 2, Medium: 1, Low: 0 };
        return (impactWeight[right.impact] - impactWeight[left.impact]) || (right.confidence - left.confidence);
      })
      .slice(0, 3)
      .map((insight) => {
        const text = String(insight.description || '');
        const problemStart = text.indexOf('Problem:');
        const solutionStart = text.indexOf('Solution:');
        const problem = problemStart >= 0
          ? text.slice(problemStart + 8, solutionStart >= 0 ? solutionStart : undefined).trim()
          : text;

        return {
          id: `insight-alert-${insight.id}`,
          type: insight.impact === 'High' ? 'critical' : 'warning',
          title: insight.title,
          message: problem,
          time: insight.timestamp,
          category: insight.category,
        };
      });

    const strongestCorrelation = [...correlationMatrix]
      .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))[0];

    const correlationAlert = strongestCorrelation
      ? {
        id: 'correlation-alert',
        type: Math.abs(strongestCorrelation.value) >= 0.75 ? 'warning' : 'info',
        title: `Strong ${strongestCorrelation.value > 0 ? 'positive' : 'negative'} correlation detected`,
        message: `${strongestCorrelation.x} and ${strongestCorrelation.y} are moving with a correlation of ${strongestCorrelation.value.toFixed(2)} in ${cityName} - ${areaName}, indicating a linked operational pattern worth monitoring.`,
        time: 'Correlation scan',
        category: 'Analytics',
      }
      : null;

    const combinedAlerts = [forecastAlert, ...insightAlerts, correlationAlert].filter(Boolean);
    return combinedAlerts.length ? combinedAlerts : alertsData.slice(0, 3);
  }, [aiInsights, alertsData, areaName, cityName, correlationMatrix, predictionMeta]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setDownloadError('');

    try {
      const insights = aiInsights.map((item) => {
        const text = String(item.description || '');
        const problemStart = text.indexOf('Problem:');
        const solutionStart = text.indexOf('Solution:');
        const problem = problemStart >= 0
          ? text.slice(problemStart + 8, solutionStart >= 0 ? solutionStart : undefined).trim()
          : text;
        const solution = solutionStart >= 0
          ? text.slice(solutionStart + 9).trim()
          : 'Operational mitigation and monitoring action recommended.';

        return {
          category: item.category,
          impact: item.impact,
          problem,
          solution,
        };
      });

      const response = await fetch(`${backendBaseUrl}/api/reports/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: {
            city: cityName,
            area: areaName,
            generatedAt: new Date().toISOString(),
            summary: `Automated analysis report for ${cityName} - ${areaName} with prioritized urban problem-solution insights.`,
            insights,
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.pdf?.reportUrl) {
        throw new Error(payload?.error || 'Failed to generate and send report.');
      }

      const pdfResponse = await fetch(payload.pdf.reportUrl);
      if (!pdfResponse.ok) {
        throw new Error('Report generated but download failed.');
      }

      const blob = await pdfResponse.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = payload.pdf.filename || `urban-report-${cityName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setDownloadError(error.message || 'Unable to generate/send report right now.');
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredInsights = filter === 'All'
    ? aiInsights
    : aiInsights.filter(i => i.category === filter);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>🧠 AI-Powered Insights</h1>
            <p>Machine learning models identify people-facing problems in {cityName} — {areaName} and suggest actionable domain-specific solutions.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleDownloadReport} disabled={isDownloading}>
              <Download size={16} />
              {isDownloading ? 'Preparing & Sending...' : 'Download + WhatsApp'}
            </button>
            <button className="btn btn-primary">
              <Sparkles size={16} />
              Run Analysis
            </button>
            <button className="btn btn-secondary">
              <Target size={16} />
              Custom Query
            </button>
          </div>
        </div>
        {downloadError && (
          <div className="city-search-error" style={{ marginTop: '10px' }}>
            {downloadError}
          </div>
        )}
      </div>

      {/* Predictive Model */}
      <ChartCard title="Monthly AQI Prediction Summary" subtitle="Monthly forecast explained in text from past AQI trend and momentum" className="mb-28">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-card-label">Last Actual AQI</div>
            <div className="stat-card-value">{predictionMeta.lastActual ?? '--'}</div>
          </div>
          <div className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-card-label">Next Month Forecast</div>
            <div className="stat-card-value">{predictionMeta.nextForecast ?? '--'}</div>
          </div>
          <div className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-card-label">5-Month Avg Forecast</div>
            <div className="stat-card-value">{predictionMeta.avgForecast ?? '--'}</div>
          </div>
          <div className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-card-label">Forecast Drift</div>
            <div className="stat-card-value" style={{ color: predictionMeta.delta > 0 ? '#f59e0b' : '#10b981' }}>
              {predictionMeta.delta >= 0 ? '+' : ''}{predictionMeta.delta}
            </div>
          </div>
          <div className="stat-card" style={{ padding: '12px 14px' }}>
            <div className="stat-card-label">Risk Level</div>
            <div className="stat-card-value">{predictionMeta.risk}</div>
          </div>
        </div>

        <div className="insight-card" style={{ animation: 'none', marginBottom: '14px' }}>
          <div className="insight-header" style={{ marginBottom: '10px' }}>
            <span className="insight-category" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              Forecast Narrative
            </span>
          </div>
          <div className="insight-title" style={{ marginBottom: '8px' }}>{predictionText.headline}</div>
          <div className="insight-description" style={{ marginBottom: '12px' }}>{predictionText.summary}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            <TrendingUp size={14} />
            Forecast is derived from historical AQI trend + recent momentum. Update city/area to recalculate.
          </div>
        </div>

        <div className="insight-card" style={{ animation: 'none' }}>
          <div className="insight-header" style={{ marginBottom: '10px' }}>
            <span className="insight-category" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
              Month-by-Month Outlook
            </span>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {predictionText.periods.map((period) => (
              <div key={period} className="insight-description">{period}</div>
            ))}
          </div>
          <div className="insight-footer" style={{ marginTop: '14px' }}>
            <span className="insight-impact medium">
              <Target size={12} />
              Recommendation
            </span>
            <span className="insight-time">Forecast window: next {predictionMeta.future.length} months</span>
          </div>
          <div className="insight-description" style={{ marginTop: '10px' }}>{predictionText.recommendation}</div>
        </div>
      </ChartCard>

      <ChartCard title="Analytics Alerts" subtitle={`Priority warnings and signals derived from current analytics for ${cityName} - ${areaName}`} className="mb-28">
        <div style={{ display: 'grid', gap: '14px' }}>
          {analyticsAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </ChartCard>

      {/* Correlation Chart */}
      <ChartCard title="Cross-Domain Correlation Analysis" subtitle="Relationships between urban metrics" className="mb-28">
        <div className="chart-container chart-container-lg">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="x"
                name="Factor X"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="y"
                name="Factor Y"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <ZAxis
                type="number"
                dataKey="value"
                range={[100, 600]}
                name="Correlation"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <div className="label">{d.x} ↔ {d.y}</div>
                      <div className="item">
                        <span>Correlation:</span>
                        <span className="value" style={{ color: d.value > 0 ? '#10b981' : '#f43f5e' }}>
                          {d.value > 0 ? '+' : ''}{d.value.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={correlationMatrix}
                fill="#3b82f6"
                shape={(props) => {
                  const { cx, cy, payload } = props;
                  const color = payload.value > 0 ? '#10b981' : '#f43f5e';
                  const size = Math.abs(payload.value) * 20;
                  return (
                    <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.6} stroke={color} strokeWidth={1} />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* AI Insights List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <Lightbulb size={20} />
          Problem-Solution Intelligence
        </div>
        <div className="filter-tabs">
          {['All', 'Traffic', 'Environment', 'Energy', 'Transport', 'Water', 'Waste'].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredInsights.map(insight => {
          const colors = categoryColors[insight.category] || categoryColors.Traffic;
          return (
            <div key={insight.id} className="insight-card animate-fade-in">
              <div className="insight-header">
                <span className="insight-category" style={{ background: colors.bg, color: colors.text }}>
                  {insight.category}
                </span>
                <div className="insight-confidence">
                  <BrainCircuit size={14} />
                  {insight.confidence}%
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${insight.confidence}%`, background: `linear-gradient(90deg, ${colors.text}, #8b5cf6)` }}></div>
                  </div>
                </div>
              </div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-description">{insight.description}</div>
              {Array.isArray(insight.suggestions) && insight.suggestions.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Suggested Interventions
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {insight.suggestions.map((suggestion) => (
                      <div key={suggestion} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: colors.text, marginTop: '6px', flexShrink: 0 }}></span>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="insight-footer">
                <span className={`insight-impact ${insight.impact.toLowerCase()}`}>
                  <Target size={12} />
                  Impact: {insight.impact}
                </span>
                <span className="insight-time">{insight.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsPage;
