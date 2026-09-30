import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Truck, CheckCircle2, Clock, Plus, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { SampleOrderStatus } from '../../types';
import { validateRequiredText } from '../../utils/validation';

export const SampleOrdersManager: React.FC = () => {
  const { sampleOrders, createSampleOrder, products, user, addToast } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // New Request Form State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([products[0]?.id || '']);
  const [trialType, setTrialType] = useState<'Clinical Study' | 'Family Nutrition' | 'Consumer Tasting'>('Family Nutrition');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('Faculty Colony, University of Sindh, Jamshoro');
  const [notes, setNotes] = useState('Please prioritize high fiber batches with peanut allergen safety clearance.');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (selectedProductIds.length === 0) {
      errs.products = 'Please select at least one formulation to sample.';
    }

    const nameCheck = validateRequiredText(recipientName, 'Recipient name', 2, 70);
    if (!nameCheck.isValid) {
      errs.recipientName = nameCheck.message!;
    }

    const addrCheck = validateRequiredText(address, 'Delivery address', 5, 200);
    if (!addrCheck.isValid) {
      errs.address = addrCheck.message!;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please provide recipient name and delivery address.', 'warning');
      return;
    }

    const items = selectedProductIds.map(id => {
      const p = products.find(prod => prod.id === id);
      return {
        productId: id,
        productName: p?.name || 'Bakery Sample',
        quantity: 2,
        batchCode: p?.batchCode || 'NB-2026-EXP'
      };
    });

    createSampleOrder({
      items,
      recipientName: recipientName.trim(),
      email: email || 'participant@example.com',
      address: address.trim(),
      status: 'Pending Formulation',
      trialType,
      trackingNotes: notes.trim() || 'New sample request placed via user portal.'
    });

    addToast('Sample Box Requested', 'Order queued for laboratory blending.', 'success');
    setIsRequestModalOpen(false);
  };

  const getStatusBadge = (status: SampleOrderStatus) => {
    switch (status) {
      case 'Pending Formulation':
        return (
          <span className="font-mono text-[9.5px] uppercase tracking-editorial px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-800 font-bold flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Formulation Pending
          </span>
        );
      case 'Lab Blended':
        return (
          <span className="font-mono text-[9.5px] uppercase tracking-editorial px-2.5 py-1 bg-blue-50 border border-blue-300 text-blue-800 font-bold flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Lab Blending
          </span>
        );
      case 'Sensory Checked':
        return (
          <span className="font-mono text-[9.5px] uppercase tracking-editorial px-2.5 py-1 bg-purple-50 border border-purple-300 text-purple-800 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Sensory Verified
          </span>
        );
      case 'Dispatched':
        return (
          <span className="font-mono text-[9.5px] uppercase tracking-editorial px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1.5">
            <Truck className="w-3 h-3" /> Dispatched in Chilled Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="font-mono text-[9.5px] uppercase tracking-editorial px-2.5 py-1 bg-[#FAF5ED] border border-[#657258] text-[#657258] font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> Delivered & Verified
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Laboratory Batch Logistics
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
            Sample Orders & Research Dispatches
          </h3>
          <p className="font-mono text-xs text-[#29211E]/70 mt-1">
            Request fresh pilot test boxes produced directly at University of Sindh functional bakery lab.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-5 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request Sample Box</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sampleOrders.length === 0 ? (
          <div className="bg-white border border-[#3A2721]/15 p-12 text-center space-y-3">
            <Package className="w-6 h-6 text-[#A96345]/50 mx-auto" />
            <p className="font-serif text-lg text-[#3A2721]">No trial dispatches on record.</p>
            <p className="text-xs text-[#29211E]/70 max-w-sm mx-auto">
              Request a free trial formulation parcel to test our resistant starch baked goods at home.
            </p>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="mt-2 px-5 py-2.5 bg-[#3A2721] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold"
            >
              Request First Sample Box
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sampleOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-[#3A2721]/15 p-5 sm:p-6 space-y-4 hover:border-[#3A2721]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A2721]/10 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#3A2721]">{order.orderNumber}</span>
                      <span className="font-mono text-[10px] uppercase tracking-editorial text-[#29211E]/60">• {order.date}</span>
                      <span className="font-mono text-[10px] uppercase tracking-editorial px-2 py-0.5 bg-[#FAF5ED] border border-[#3A2721]/10 text-[#3A2721]">
                        {order.trialType}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#29211E]/75">Recipient: {order.recipientName} ({order.email})</p>
                  </div>

                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items in the box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-[#FAF5ED]/50 border border-[#3A2721]/10 space-y-2">
                    <span className="text-[10px] uppercase tracking-editorial font-bold text-[#3A2721] block">
                      Enclosed Formulations ({order.items.reduce((a, b) => a + b.quantity, 0)} portions):
                    </span>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-[#29211E]/80">
                          <span>{item.quantity}x {item.productName}</span>
                          <span className="text-[#657258] font-bold">[{item.batchCode || 'LAB-BATCH'}]</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-[#FAF5ED]/50 border border-[#3A2721]/10 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-editorial font-bold text-[#A96345] block">
                      Laboratory Transit & Delivery Notes:
                    </span>
                    <p className="text-[#29211E]/80 text-[11px] leading-relaxed">
                      {order.trackingNotes || 'Specimen packaged in nitrogen flushed food-grade barrier pouches.'}
                    </p>
                    <p className="text-[10.5px] text-[#29211E]/60">
                      Destination: {order.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsRequestModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#FAF5ED] border border-[#3A2721] p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3A2721]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                  Clinical Trial Request
                </span>
                <h4 className="font-serif text-2xl text-[#3A2721] font-normal">Request Sample Formulation Box</h4>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="font-mono text-xs uppercase hover:text-[#A96345]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs font-mono" noValidate>
              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Select Formulations to Sample *
                </label>
                <div className={`space-y-2 max-h-40 overflow-y-auto p-3 bg-white border ${errors.products ? 'border-red-500' : 'border-[#3A2721]/20'}`}>
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds([...selectedProductIds, p.id]);
                            if (errors.products) setErrors(prev => ({ ...prev, products: '' }));
                          } else {
                            setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                          }
                        }}
                        className="rounded border-[#3A2721]/30 text-[#3A2721] focus:ring-0"
                      />
                      <span className="font-sans text-[#3A2721] font-medium">{p.name}</span>
                      <span className="text-[10px] text-[#657258] font-bold">({p.nutrition.dietaryFiberGrams}g fiber)</span>
                    </label>
                  ))}
                </div>
                {errors.products && (
                  <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.products}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Study / Trial Type
                  </label>
                  <select
                    value={trialType}
                    onChange={e => setTrialType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 text-xs font-sans"
                  >
                    <option value="Family Nutrition">Family Nutrition</option>
                    <option value="Clinical Study">Clinical Study</option>
                    <option value="Consumer Tasting">Consumer Tasting</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => {
                      setRecipientName(e.target.value);
                      if (errors.recipientName) setErrors(prev => ({ ...prev, recipientName: '' }));
                    }}
                    placeholder="Full name"
                    className={`w-full px-3 py-2 bg-white border text-xs font-sans ${errors.recipientName ? 'border-red-500' : 'border-[#3A2721]/20'}`}
                  />
                  {errors.recipientName && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.recipientName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Delivery Address in Sindh / Pakistan *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  placeholder="Street address, city, district"
                  className={`w-full px-3 py-2 bg-white border text-xs font-sans ${errors.address ? 'border-red-500' : 'border-[#3A2721]/20'}`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Allergen / Special Formulation Notes <span className="font-normal text-[#29211E]/50 lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any dietary restrictions, child-safe batch requests, or delivery instructions..."
                  className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 text-xs font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3A2721]/10">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-5 py-2.5 border border-[#3A2721]/25 text-[#3A2721] uppercase tracking-editorial font-semibold text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedProductIds.length === 0}
                  className="px-6 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] uppercase tracking-editorial font-semibold text-[11px] disabled:opacity-50"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
