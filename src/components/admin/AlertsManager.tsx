import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClinicalAlert } from '../../types';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  X, 
  Save,
  AlertCircle
} from 'lucide-react';
import { formatToTitleCase, validateRequiredText } from '../../utils/validation';

export const AlertsManager: React.FC = () => {
  const { alerts, addAlert, updateAlert, deleteAlert, products, addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [relatedProductId, setRelatedProductId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setType('info');
    setRelatedProductId('');
    setEditingAlertId(null);
    setIsEditing(false);
    setErrors({});
  };

  const handleStartEdit = (alert: ClinicalAlert) => {
    setEditingAlertId(alert.id);
    setTitle(alert.title);
    setMessage(alert.message);
    setType(alert.type);
    setRelatedProductId(alert.relatedProductId || '');
    setIsEditing(true);
    setErrors({});
  };

  const handleTitleBlur = () => {
    if (title.trim()) {
      const formatted = formatToTitleCase(title);
      setTitle(formatted);
      const res = validateRequiredText(formatted, 'Announcement title', 3, 100);
      setErrors(prev => ({ ...prev, title: res.isValid ? '' : res.message! }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleCheck = validateRequiredText(title, 'Announcement title', 3, 100);
    if (!titleCheck.isValid) {
      newErrors.title = titleCheck.message!;
    }

    const msgCheck = validateRequiredText(message, 'Announcement body', 5, 2000);
    if (!msgCheck.isValid) {
      newErrors.message = msgCheck.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please provide an announcement title and message.', 'warning');
      return;
    }

    const cleanTitle = formatToTitleCase(title);

    if (editingAlertId) {
      updateAlert(editingAlertId, {
        title: cleanTitle,
        message: message.trim(),
        type,
        relatedProductId: relatedProductId || undefined
      });
      addToast('Alert Updated', 'Public notification updated.', 'success');
    } else {
      addAlert({
        title: cleanTitle,
        message: message.trim(),
        type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        relatedProductId: relatedProductId || undefined,
        isRead: false
      });
      addToast('Alert Published', 'New announcement published live.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string, alertTitle: string) => {
    if (window.confirm(`Delete announcement "${alertTitle}"?`)) {
      deleteAlert(id);
      addToast('Alert Deleted', 'Notification removed.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            System Communications
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">
            Public Alerts & Clinical Announcements
          </h2>
          <p className="text-xs text-[#2A1F1B]/75 mt-1 font-sans">
            Manage real-time notifications, research updates, and safety bulletins shown across customer portals.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="px-5 py-2.5 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-xs transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {isEditing && (
        <form 
          onSubmit={handleSubmit}
          className="card-soft bg-white p-6 rounded-3xl border border-[#E8DDCF] shadow-[0_8px_30px_rgba(61,38,30,0.03)] space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-3">
            <h3 className="font-serif text-lg text-[#3D261E] font-normal">
              {editingAlertId ? 'Edit Announcement' : 'Compose New Public Announcement'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 hover:text-[#C97D36] text-[#3D261E]/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="sm:col-span-2">
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Announcement Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                onBlur={handleTitleBlur}
                placeholder="e.g. New Harvest Banana Flour Batch NB-2026-882"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-sans ${
                  errors.title ? 'border-red-500' : 'border-[#3A2721]/20'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Notification Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
              >
                <option value="info">Informational Note</option>
                <option value="warning">Formulation Notice / Caution</option>
                <option value="success">Sensory Trial Milestone</option>
              </select>
            </div>
          </div>

          <div className="font-mono text-xs">
            <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
              Announcement Body *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
              }}
              placeholder="Full detailed message shown to panelists and customers..."
              className={`w-full px-3 py-2 bg-white border rounded-xl font-sans text-xs ${
                errors.message ? 'border-red-500' : 'border-[#3A2721]/20'
              }`}
            />
            {errors.message && (
              <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Related Product (Optional)
              </label>
              <select
                value={relatedProductId}
                onChange={e => setRelatedProductId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
              >
                <option value="">None (General Laboratory Alert)</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.batchCode || 'No Batch'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8DDCF]">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-[#3A2721]/20 rounded-full text-xs font-semibold hover:bg-[#FAF0E4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingAlertId ? 'Update Alert' : 'Publish Alert'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ALERTS LIST */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8DDCF] p-8 text-[#2A1F1B]/60 font-sans text-xs">
            No active announcements. Click "New Announcement" above to publish your first notification.
          </div>
        ) : (
          alerts.map(alert => {
            const product = products.find(p => p.id === alert.relatedProductId);
            return (
              <div 
                key={alert.id}
                className="card-soft bg-white p-5 rounded-2xl border border-[#E8DDCF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-[#C97D36]/40 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    alert.type === 'warning' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : alert.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {alert.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {alert.type === 'info' && <Info className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif text-base font-medium text-[#3D261E]">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#E8DDCF] bg-[#FAF7F2] text-[#3D261E]/70">
                        {alert.date}
                      </span>
                      {product && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF0E4] text-[#C97D36] border border-[#EAD2B9]">
                          Related: {product.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#2A1F1B]/80 font-sans leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleStartEdit(alert)}
                    className="p-2 text-[#3D261E]/70 hover:text-[#C97D36] hover:bg-[#FAF0E4] rounded-lg transition-colors"
                    title="Edit announcement"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id, alert.title)}
                    className="p-2 text-[#C86B52] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
