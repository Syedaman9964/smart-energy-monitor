import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Eye,
  CheckCircle,
  Sparkles,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import { useToast } from '../context/ToastContext';
import { exportToCSV } from '../services/exportService';
import Modal from '../components/common/Modal';

export default function ReportsPage() {
  const { reports } = useEnergy();
  const { addToast } = useToast();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (rep) => {
    setSelectedReport(rep);
    setIsPreviewOpen(true);
  };

  const handleDownload = (rep) => {
    const exportData = [
      {
        ReportTitle: rep.title,
        Period: rep.period,
        GeneratedAt: rep.generatedAt,
        TotalConsumption: rep.totalConsumption,
        EstimatedCost: rep.estimatedCost,
        PeakDemand: rep.peakDemand,
        CarbonEmissions: rep.carbonEmissions,
        EfficiencyScore: rep.efficiencyScore,
        ExecutiveSummary: rep.summary
      }
    ];

    exportToCSV(exportData, `${rep.id}_${rep.title.toLowerCase().replace(/\s+/g, '_')}.csv`);
    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: `Downloaded ${rep.title} in CSV format.`
    });
  };

  const handleGenerateNew = () => {
    addToast({
      type: 'success',
      title: 'Real-time Audit Generated',
      message: 'New on-demand energy audit compiled from current telemetry buffer.'
    });
  };

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Automated Energy Reports</h1>
          </div>
          <p className="page-subtitle">
            Certified electrical audit reports, utility billing forecasts, and ESG compliance summaries.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-primary" onClick={handleGenerateNew}>
            <Sparkles size={16} />
            <span>Generate New Audit</span>
          </button>
        </div>
      </section>

      {/* Reports Catalog Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {reports.map((rep) => (
          <div key={rep.id} className="dashboard-card" style={{ padding: '1.5rem', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="card-title">{rep.title}</h3>
                  <span className="metric-subtext">Period: {rep.period}</span>
                </div>
              </div>
              <span className="metric-range-badge font-mono">{rep.generatedAt}</span>
            </div>

            <p className="metric-subtext" style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              {rep.summary}
            </p>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'var(--bg-surface-secondary)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span className="metric-label">Total Units</span>
                <div className="metric-value-row" style={{ marginTop: '2px' }}>
                  <span className="font-mono text-gold" style={{ fontWeight: 700, fontSize: '0.98rem' }}>{rep.totalConsumption}</span>
                </div>
              </div>
              <div>
                <span className="metric-label">Estimated Bill</span>
                <div className="metric-value-row" style={{ marginTop: '2px' }}>
                  <span className="font-mono text-gold" style={{ fontWeight: 700, fontSize: '0.98rem' }}>{rep.estimatedCost}</span>
                </div>
              </div>
              <div>
                <span className="metric-label">Peak Demand</span>
                <div className="metric-value-row" style={{ marginTop: '2px' }}>
                  <span className="font-mono" style={{ fontWeight: 600, fontSize: '0.98rem' }}>{rep.peakDemand}</span>
                </div>
              </div>
              <div>
                <span className="metric-label">Efficiency Score</span>
                <div className="metric-value-row" style={{ marginTop: '2px' }}>
                  <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.98rem' }}>{rep.efficiencyScore}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '4px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                onClick={() => handlePreview(rep)}
              >
                <Eye size={15} />
                <span>View Preview</span>
              </button>

              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                onClick={() => handleDownload(rep)}
              >
                <Download size={15} style={{ color: 'var(--color-gold)' }} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Report Preview Modal */}
      {selectedReport && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={selectedReport.title}
          subtitle={`Report generated for ${selectedReport.period}`}
          icon={FileText}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Executive Summary
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {selectedReport.summary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="telemetry-item">
                <span className="telemetry-label">Total Electrical Consumption</span>
                <span className="telemetry-value font-mono" style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>
                  {selectedReport.totalConsumption}
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Estimated Utility Billed Amount</span>
                <span className="telemetry-value font-mono" style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>
                  {selectedReport.estimatedCost}
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Max Recorded Peak Demand</span>
                <span className="telemetry-value font-mono">{selectedReport.peakDemand}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Carbon Footprint Equivalent</span>
                <span className="telemetry-value font-mono" style={{ color: 'var(--color-success)' }}>
                  {selectedReport.carbonEmissions}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsPreviewOpen(false)}>
                Close Preview
              </button>
              <button className="btn-secondary" onClick={() => window.print()} title="Print or Save PDF Report">
                <Printer size={15} />
                <span>Print / PDF</span>
              </button>
              <button className="btn-primary" onClick={() => {
                handleDownload(selectedReport);
                setIsPreviewOpen(false);
              }}>
                <Download size={15} />
                <span>Download Report CSV</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
