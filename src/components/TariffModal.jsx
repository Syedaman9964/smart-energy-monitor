import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

/**
 * TariffModal - Dialog to adjust electricity rate calculation
 * 
 * @param {boolean} isOpen - Modal visibility state
 * @param {Function} onClose - Close handler
 * @param {number} currentRate - Current rate per kWh
 * @param {Function} onSave - Save handler callback(newRate)
 */
export default function TariffModal({ isOpen, onClose, currentRate, onSave }) {
  const [rateInput, setRateInput] = useState(currentRate?.toString() || '0.15');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(rateInput);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} style={{ color: '#10b981' }} />
            <h3 className="modal-title">Electricity Tariff Settings</h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Enter your local utility provider rate per kilowatt-hour (kWh) to calculate real-time electricity bills.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="tariff-rate">
              Rate per Unit (per kWh)
            </label>
            <input
              id="tariff-rate"
              type="number"
              step="0.01"
              min="0.01"
              max="10"
              className="form-input font-mono"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
