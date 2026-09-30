import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SampleOrderStatus } from '../../types';
import { Package, Truck, CheckCircle, Clock, ShieldCheck, Search, Filter } from 'lucide-react';

export const AdminSampleOrders: React.FC = () => {
  const { sampleOrders, updateSampleOrderStatus, addToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const filteredOrders = sampleOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trialType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: SampleOrderStatus) => {
    updateSampleOrderStatus(orderId, newStatus);
    addToast('Order Status Updated', `Set order to ${newStatus}`, 'success');
  };

  const handleSaveNotes = (orderId: string, currentStatus: SampleOrderStatus) => {
    updateSampleOrderStatus(orderId, currentStatus, tempNotes);
    setEditingOrderId(null);
    addToast('Notes Saved', 'Updated order transit dispatch notes', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Clinical Supply Chain
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
            Sample Orders & Clinical Batch Fulfillment
          </h3>
          <p className="font-mono text-xs text-[#29211E]/70 mt-1">
            Dispatch pilot test batches to clinical study participants and community nutritional trial households.
          </p>
        </div>

        <div className="font-mono text-xs text-[#29211E]/80 bg-[#FAF5ED] border border-[#3A2721]/15 px-4 py-2">
          Total Dispatches: <strong className="text-[#3A2721]">{sampleOrders.length}</strong>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3A2721]/40" />
          <input
            type="text"
            placeholder="Search by Order #, recipient name, or trial type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#3A2721]/20 text-xs font-sans"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10.5px] uppercase tracking-editorial font-bold text-[#3A2721]/70">Status:</span>
          {['all', 'Pending Formulation', 'Lab Blended', 'Sensory Checked', 'Dispatched', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-[10px] uppercase tracking-editorial whitespace-nowrap transition-colors border ${
                statusFilter === status
                  ? 'bg-[#3A2721] text-[#FAF5ED] border-[#3A2721] font-bold'
                  : 'bg-white text-[#29211E]/70 border-[#3A2721]/20 hover:border-[#3A2721]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#3A2721]/15 p-12 text-center space-y-2">
            <Package className="w-6 h-6 text-[#A96345]/50 mx-auto" />
            <p className="font-serif text-lg text-[#3A2721]">No orders match the selected filters.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id}
              className="bg-white border border-[#3A2721]/15 p-4 sm:p-6 space-y-4 hover:border-[#3A2721]/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3A2721]/10 pb-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#3A2721]">{order.orderNumber}</span>
                    <span className="font-mono text-[10.5px] text-[#29211E]/50">• Date: {order.date}</span>
                    <span className="font-mono text-[10px] uppercase tracking-editorial px-2.5 py-0.5 bg-[#FAF5ED] border border-[#3A2721]/15 text-[#3A2721] font-bold">
                      {order.trialType}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#29211E]/80 break-words">
                    Recipient: <strong className="text-[#3A2721]">{order.recipientName}</strong> &lt;{order.email}&gt; • {order.address}
                  </p>
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#3A2721]">Status:</span>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value as SampleOrderStatus)}
                    className="px-3 py-1.5 bg-[#FAF5ED] border border-[#3A2721]/20 font-mono text-xs text-[#3A2721] font-bold"
                  >
                    <option value="Pending Formulation">Pending Formulation</option>
                    <option value="Lab Blended">Lab Blended</option>
                    <option value="Sensory Checked">Sensory Checked</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3.5 bg-[#FAF5ED]/50 border border-[#3A2721]/10 space-y-2">
                  <span className="text-[10px] uppercase tracking-editorial font-bold text-[#3A2721] block">
                    Enclosed Formulation Units:
                  </span>
                  <ul className="space-y-1">
                    {order.items.map((it, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                        <span className="text-[#29211E]/80">{it.quantity}x {it.productName}</span>
                        <span className="font-bold text-[#657258] text-[11px]">Batch: {it.batchCode}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-[#FAF5ED]/50 border border-[#3A2721]/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-editorial font-bold text-[#A96345]">
                      Tracking & Dispatch Notes:
                    </span>
                    {editingOrderId !== order.id && (
                      <button
                        onClick={() => {
                          setEditingOrderId(order.id);
                          setTempNotes(order.trackingNotes || '');
                        }}
                        className="text-[10px] uppercase tracking-editorial text-[#3A2721] hover:underline"
                      >
                        Edit Notes
                      </button>
                    )}
                  </div>

                  {editingOrderId === order.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={tempNotes}
                        onChange={e => setTempNotes(e.target.value)}
                        className="w-full p-2 bg-white border border-[#3A2721]/20 text-xs font-sans"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="px-2.5 py-1 border border-[#3A2721]/20 text-[10px] uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(order.id, order.status)}
                          className="px-3 py-1 bg-[#3A2721] text-[#FAF5ED] text-[10px] uppercase font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#29211E]/80 text-[11px] leading-relaxed">
                      {order.trackingNotes || 'No tracking notes recorded.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
