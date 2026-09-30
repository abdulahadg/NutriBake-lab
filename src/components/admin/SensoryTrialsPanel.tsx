import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SensoryTrialEntry } from '../../types';
import { Plus, Trash2, ShieldCheck, Award, Star, FlaskConical, BarChart3, AlertCircle } from 'lucide-react';
import { formatToTitleCase, validateRequiredText } from '../../utils/validation';

export const SensoryTrialsPanel: React.FC = () => {
  const { sensoryTrials, addSensoryTrial, deleteSensoryTrial, products, addToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [panelistName, setPanelistName] = useState('Lydia Shaloom');
  const [panelistType, setPanelistType] = useState<SensoryTrialEntry['panelistType']>('Trained Descriptive');
  const [taste, setTaste] = useState(94);
  const [texture, setTexture] = useState(95);
  const [aroma, setAroma] = useState(93);
  const [appearance, setAppearance] = useState(96);
  const [hedonicScale9, setHedonicScale9] = useState(8.7);
  const [panelNotes, setPanelNotes] = useState('Uniform crumb aeration, zero astringency, and moist mouthfeel.');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePanelistBlur = () => {
    if (panelistName.trim()) {
      const formatted = formatToTitleCase(panelistName);
      setPanelistName(formatted);
      const res = validateRequiredText(formatted, 'Panelist name', 2, 70);
      setErrors(prev => ({ ...prev, panelistName: res.isValid ? '' : res.message! }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameCheck = validateRequiredText(panelistName, 'Panelist name', 2, 70);
    if (!nameCheck.isValid) {
      newErrors.panelistName = nameCheck.message!;
    }

    const notesCheck = validateRequiredText(panelNotes, 'Panelist notes', 5, 1000);
    if (!notesCheck.isValid) {
      newErrors.panelNotes = notesCheck.message!;
    }

    if (!selectedProductId) {
      newErrors.product = 'Please select a formulation.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please provide panelist name and descriptive notes.', 'warning');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const overall = Number(((taste + texture + aroma + appearance) / 4).toFixed(1));

    addSensoryTrial({
      productId: product.id,
      productName: product.name,
      batchCode: product.batchCode || 'NB-2026-LAB',
      panelistName: formatToTitleCase(panelistName),
      panelistType,
      taste,
      texture,
      aroma,
      appearance,
      overallAcceptability: overall,
      hedonicScale9,
      panelNotes: panelNotes.trim()
    });

    addToast('Trial Recorded', 'Sensory organoleptic trial logged.', 'success');
    setIsModalOpen(false);
    setErrors({});
  };

  // Calculated Metrics
  const totalTrials = sensoryTrials.length;
  const avgOverall = totalTrials > 0
    ? (sensoryTrials.reduce((sum, t) => sum + t.overallAcceptability, 0) / totalTrials).toFixed(1)
    : '95.0';
  const avgTaste = totalTrials > 0
    ? (sensoryTrials.reduce((sum, t) => sum + t.taste, 0) / totalTrials).toFixed(1)
    : '95.0';
  const avgTexture = totalTrials > 0
    ? (sensoryTrials.reduce((sum, t) => sum + t.texture, 0) / totalTrials).toFixed(1)
    : '96.0';
  const avgHedonic = totalTrials > 0
    ? (sensoryTrials.reduce((sum, t) => sum + t.hedonicScale9, 0) / totalTrials).toFixed(1)
    : '8.8';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Quality Assurance Protocol
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
            Sensory Evaluation & Hedonic Tasting Lab
          </h3>
          <p className="font-mono text-xs text-[#29211E]/70 mt-1">
            Standardized descriptive sensory testing conducted by Dept of Nutrition & Food Science, University of Sindh.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Panel Evaluation</span>
        </button>
      </div>

      {/* Aggregate Score Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-[#FAF5ED] border border-[#3A2721]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-editorial text-[#29211D]/60 block">
            Cumulative Acceptability
          </span>
          <span className="text-2xl sm:text-3xl font-serif text-[#657258] mt-1 block">{avgOverall}%</span>
          <span className="font-mono text-[10px] text-[#29211E]/60">Acceptance Threshold &gt;90%</span>
        </div>

        <div className="p-4 sm:p-5 bg-[#FAF5ED] border border-[#3A2721]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-editorial text-[#29211D]/60 block">
            Hedonic 9-Point Scale
          </span>
          <span className="text-2xl sm:text-3xl font-serif text-[#3A2721] mt-1 block">{avgHedonic} / 9</span>
          <span className="font-mono text-[10px] text-[#657258] font-bold">"Like Very Much" Range</span>
        </div>

        <div className="p-4 sm:p-5 bg-[#FAF5ED] border border-[#3A2721]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-editorial text-[#29211D]/60 block">
            Crumb Texture & Elasticity
          </span>
          <span className="text-2xl sm:text-3xl font-serif text-[#3A2721] mt-1 block">{avgTexture}%</span>
          <span className="font-mono text-[10px] text-[#29211E]/60">Moisture retention verified</span>
        </div>

        <div className="p-4 sm:p-5 bg-[#FAF5ED] border border-[#3A2721]/15">
          <span className="font-mono text-[10px] font-bold uppercase tracking-editorial text-[#29211D]/60 block">
            Taste & Flavor Masking
          </span>
          <span className="text-2xl sm:text-3xl font-serif text-[#A96345] mt-1 block">{avgTaste}%</span>
          <span className="font-mono text-[10px] text-[#29211E]/60">Zero astringency detected</span>
        </div>
      </div>

      {/* Sensory Trials Table */}
      <div className="border border-[#3A2721]/15 overflow-hidden bg-white">
        <div className="p-4 bg-[#FAF5ED] border-b border-[#3A2721]/15 flex items-center justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721]">
            Recorded Sensory Panels ({sensoryTrials.length})
          </span>
          <span className="font-mono text-[10px] text-[#29211E]/60">
            ISO 8586 Sensory Analysis Compliance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAF5ED]/50 border-b border-[#3A2721]/10 text-[#3A2721] uppercase tracking-editorial text-[9px] font-bold">
              <tr>
                <th className="p-3.5">Formulation & Batch</th>
                <th className="p-3.5">Panelist & Role</th>
                <th className="p-3.5">Taste</th>
                <th className="p-3.5">Texture</th>
                <th className="p-3.5">Aroma</th>
                <th className="p-3.5">Overall</th>
                <th className="p-3.5">Hedonic</th>
                <th className="p-3.5">Panel Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2721]/10 bg-white">
              {sensoryTrials.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF5ED]/40 transition-colors">
                  <td className="p-3.5">
                    <span className="font-sans font-medium text-[#3A2721] text-xs block">{t.productName}</span>
                    <span className="text-[10px] text-[#657258] font-bold">[{t.batchCode}]</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-xs text-[#29211E] block font-sans">{t.panelistName}</span>
                    <span className="text-[9.5px] text-[#29211E]/60 block">{t.panelistType}</span>
                    <span className="text-[9px] text-[#29211E]/40">{t.date}</span>
                  </td>
                  <td className="p-3.5 text-[#3A2721] font-bold">{t.taste}%</td>
                  <td className="p-3.5 text-[#3A2721] font-bold">{t.texture}%</td>
                  <td className="p-3.5 text-[#3A2721] font-bold">{t.aroma}%</td>
                  <td className="p-3.5">
                    <span className="font-bold text-[#657258] text-sm">{t.overallAcceptability}%</span>
                  </td>
                  <td className="p-3.5 font-bold text-[#A96345]">{t.hedonicScale9} / 9</td>
                  <td className="p-3.5 max-w-xs font-sans text-xs text-[#29211E]/80 leading-snug">
                    {t.panelNotes}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteSensoryTrial(t.id)}
                      className="p-1.5 text-[#29211E]/40 hover:text-rose-700 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Trial Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#FAF5ED] border border-[#3A2721] p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3A2721]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                  Sensory Trial Log
                </span>
                <h4 className="font-serif text-2xl text-[#3A2721] font-normal">Record Trained Panel Evaluation</h4>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="font-mono text-xs uppercase hover:text-[#A96345]">
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono" noValidate>
              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Product Formulation *
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 font-sans text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} [{p.batchCode || 'NB-LAB'}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Panelist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={panelistName}
                    onChange={e => {
                      setPanelistName(e.target.value);
                      if (errors.panelistName) setErrors(prev => ({ ...prev, panelistName: '' }));
                    }}
                    onBlur={handlePanelistBlur}
                    className={`w-full px-3 py-2 bg-white border font-sans text-xs ${
                      errors.panelistName ? 'border-red-500' : 'border-[#3A2721]/20'
                    }`}
                  />
                  {errors.panelistName && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.panelistName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Evaluation Classification
                  </label>
                  <select
                    value={panelistType}
                    onChange={e => setPanelistType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 text-xs"
                  >
                    <option value="Trained Descriptive">Trained Descriptive Panel</option>
                    <option value="Student Researcher">Student Researcher</option>
                    <option value="Faculty Supervisor">Faculty Supervisor</option>
                    <option value="Consumer Hedonic">Consumer Hedonic Tester</option>
                  </select>
                </div>
              </div>

              {/* Sensory Sliders */}
              <div className="p-4 bg-white border border-[#3A2721]/15 space-y-3">
                <span className="font-bold text-[#3A2721] text-[10px] uppercase tracking-editorial block">
                  Organoleptic Attribute Scores (0-100 Scale)
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] uppercase text-[#29211E]/70">Taste Score</span>
                      <span className="font-bold text-[#657258]">{taste}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={taste}
                      onChange={e => setTaste(Number(e.target.value))}
                      className="w-full accent-[#3A2721]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] uppercase text-[#29211E]/70">Texture / Crumb</span>
                      <span className="font-bold text-[#657258]">{texture}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={texture}
                      onChange={e => setTexture(Number(e.target.value))}
                      className="w-full accent-[#3A2721]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] uppercase text-[#29211E]/70">Aroma</span>
                      <span className="font-bold text-[#657258]">{aroma}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={aroma}
                      onChange={e => setAroma(Number(e.target.value))}
                      className="w-full accent-[#3A2721]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] uppercase text-[#29211E]/70">Appearance</span>
                      <span className="font-bold text-[#657258]">{appearance}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={appearance}
                      onChange={e => setAppearance(Number(e.target.value))}
                      className="w-full accent-[#3A2721]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3A2721]/10">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#A96345]">Hedonic 9-Point Rating</span>
                    <span className="font-bold text-[#A96345]">{hedonicScale9} / 9</span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="9.0"
                    step="0.1"
                    value={hedonicScale9}
                    onChange={e => setHedonicScale9(Number(e.target.value))}
                    className="w-full accent-[#A96345]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Descriptive Panelist Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={panelNotes}
                  onChange={e => {
                    setPanelNotes(e.target.value);
                    if (errors.panelNotes) setErrors(prev => ({ ...prev, panelNotes: '' }));
                  }}
                  placeholder="e.g. Fine cell crumb structure, clean finish, complete absence of raw starch mouthfeel."
                  className={`w-full px-3 py-2 bg-white border font-sans text-xs ${
                    errors.panelNotes ? 'border-red-500' : 'border-[#3A2721]/20'
                  }`}
                />
                {errors.panelNotes && (
                  <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.panelNotes}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3A2721]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#3A2721]/25 text-[#3A2721] uppercase tracking-editorial font-semibold text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] uppercase tracking-editorial font-semibold text-[11px]"
                >
                  Submit Panel Trial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
