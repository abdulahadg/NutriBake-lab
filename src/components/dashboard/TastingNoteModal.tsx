import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Star, X, Save, AlertCircle } from 'lucide-react';
import { validateRequiredText } from '../../utils/validation';

interface TastingNoteModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const TastingNoteModal: React.FC<TastingNoteModalProps> = ({ product, isOpen, onClose }) => {
  const { productTastingNotes, saveProductTastingNote, addToast } = useApp();

  const existingNote = productTastingNotes[product.id];
  const [rating, setRating] = useState<number>(existingNote?.rating || 5);
  const [notes, setNotes] = useState<string>(existingNote?.notes || '');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateRequiredText(notes, 'Sensory notes', 3, 1500);
    if (!check.isValid) {
      setError(check.message!);
      return;
    }
    saveProductTastingNote(product.id, rating, notes.trim());
    addToast('Sensory Note Saved', 'Your organoleptic assessment has been logged.', 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FAF5ED] border border-[#3A2721] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#3A2721]/10 pb-4">
          <div className="min-w-0 pr-2">
            <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
              Personal Sensory Journal
            </span>
            <h4 className="font-serif text-xl sm:text-2xl text-[#3A2721] font-normal break-words">{product.name}</h4>
          </div>
          <button onClick={onClose} className="p-1.5 hover:text-[#A96345] shrink-0" aria-label="Close">
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-2">
              Hedonic Rating (1-5 Stars)
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 sm:p-2 text-[#3A2721] hover:scale-110 active:scale-95 transition-transform"
                  aria-label={`${star} star`}
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-[#A96345] text-[#A96345]' : 'text-[#3A2721]/30'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-1 sm:ml-2 font-bold text-xs sm:text-sm text-[#A96345]">{rating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
              Sensory Experience & Digestion Notes *
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={e => {
                setNotes(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Delicious light crumb, zero banana bitterness. Kept me comfortably full through the morning without bloating."
              className={`w-full px-3 py-2 bg-white border font-sans text-xs leading-relaxed focus:outline-none focus:border-[#3A2721] ${
                error ? 'border-red-500' : 'border-[#3A2721]/20'
              }`}
            />
            {error ? (
              <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </p>
            ) : (
              <span className="text-[10px] text-[#29211E]/60 block mt-1">
                Your feedback is privately associated with your clinical trial profile.
              </span>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#3A2721]/10">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[40px] border border-[#3A2721]/25 text-[#3A2721] uppercase tracking-editorial font-semibold text-[11px] text-center flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 min-h-[40px] bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] uppercase tracking-editorial font-semibold text-[11px] flex items-center justify-center gap-2 text-center"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Sensory Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
