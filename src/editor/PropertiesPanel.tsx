import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

const FONTS = ['Alexandria', 'Inter', 'Arial', 'Times New Roman'];
const COLORS = ['#1E4D2B', '#4CAF50', '#A3C63A', '#8A6E5D', '#E4A201', '#D6613F', '#F8F4EA', '#3F4755', '#000000', '#FFFFFF'];

export const PropertiesPanel: React.FC = () => {
  const { objects, selectedIds, updateObject } = useEditorStore();
  
  const selectedObj = objects.find(o => o.id === selectedIds[0]);

  if (!selectedObj) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 mt-4" dir="rtl">
      <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40 mb-4">خصائص العنصر</h4>
      
      {selectedObj.type === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-gray-navy mb-2">النص</label>
            <textarea 
              value={selectedObj.text}
              onChange={(e) => updateObject(selectedObj.id, { text: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-sm font-sans focus:outline-none focus:border-brand-green-accent"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-brand-gray-navy mb-2">الخط</label>
              <select 
                value={selectedObj.fontFamily} 
                onChange={(e) => updateObject(selectedObj.id, { fontFamily: e.target.value })}
                className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-sm"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-gray-navy mb-2">الحجم</label>
              <input 
                type="number"
                value={Math.round(selectedObj.fontSize || 20)}
                onChange={(e) => updateObject(selectedObj.id, { fontSize: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shared Properties */}
      <div className="mt-4">
        <label className="block text-xs font-bold text-brand-gray-navy mb-2">اللون</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${selectedObj.fill === color ? 'border-black' : 'border-black/5'} shadow-sm`}
              style={{ backgroundColor: color }}
              onClick={() => updateObject(selectedObj.id, { fill: color })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
