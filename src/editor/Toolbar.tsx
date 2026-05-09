import React, { useRef, useState } from 'react';
import { Type, Image as ImageIcon, Download, Trash2, Layout, Square, Smartphone, Monitor, AppWindow, Sparkles, Image as CropIcon, Frame, Mic, ArrowUp, ArrowDown } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

interface ToolbarProps {
  onExport: () => void;
  onExportRawBg?: () => void;
  onExportBrandedBg?: () => void;
  currentModeData?: any;
  modes?: any[];
  onModeChange?: (modeId: string) => void;
  currentCategory?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExport, onExportRawBg, onExportBrandedBg, currentModeData, modes, onModeChange, currentCategory }) => {
  const { addObject, selectedIds, deleteObject, setCanvasSize, reorderObject } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddText = () => {
    addObject({
      type: 'text',
      x: 100,
      y: 100,
      text: 'اكتب نصاً هنا',
      fontSize: 60,
      fontFamily: 'Alexandria',
      fill: currentModeData?.colors?.[0] || '#1E4D2B',
      align: 'right',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
           addObject({
             type: 'image',
             x: 50,
             y: 50,
             src: reader.result as string,
             width: img.width > 500 ? 500 : img.width,
             height: img.width > 500 ? (img.height * 500) / img.width : img.height,
           });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      selectedIds.forEach(id => deleteObject(id));
    }
  };

  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [bgPrompt, setBgPrompt] = useState('');
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const canvasSize = useEditorStore(state => state.canvasSize);

  const handleAiBgGeneration = async () => {
    if (!bgPrompt) return;
    setIsGeneratingBg(true);
    let aspectRatio = '1:1';
    if (canvasSize.width === 1080 && canvasSize.height === 1350) aspectRatio = '4:5';
    if (canvasSize.width === 1080 && canvasSize.height === 1920) aspectRatio = '9:16';
    if (canvasSize.width === 1920 && canvasSize.height === 1080) aspectRatio = '16:9';

    try {
      const resp = await fetch('/api/generate-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: bgPrompt, aspectRatio })
      });
      const data = await resp.json();
      if (data.image) {
        // Find existing background image or add a new one
        const bgId = useEditorStore.getState().objects.find(o => o.type === 'image' && o.width === canvasSize.width && o.height === canvasSize.height)?.id;
        if (bgId) {
           useEditorStore.getState().deleteObject(bgId);
        }
        
        addObject({
          type: 'image',
          x: 0,
          y: 0,
          src: data.image,
          width: canvasSize.width,
          height: canvasSize.height,
        });
        
        // Push background to back
        const latestObjects = useEditorStore.getState().objects;
        const newBg = latestObjects[latestObjects.length - 1];
        if (newBg) {
           reorderObject(newBg.id, 'back');
        }
      } else {
        alert(data.error || 'حدث خطأ أثناء توليد الخلفية');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التوليد');
    } finally {
      setIsGeneratingBg(false);
    }
  };

  const handleAiGeneration = async () => {
    if (!aiTopic) return;
    setIsGeneratingAi(true);
    try {
      const resp = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: aiTopic,
          modeContext: currentModeData ? {
            name: currentModeData.name,
            direction: currentModeData.direction,
            colors: currentModeData.colors
          } : null
        })
      });
      const data = await resp.json();
      
      useEditorStore.getState().clearCanvas();
      setCanvasSize(1080, 1080);

      if (data.texts && Array.isArray(data.texts)) {
        data.texts.forEach((t: any) => {
          addObject({
             type: 'text',
             x: 100, // Fixed x with right align based on width
             y: t.y || 100,
             text: t.text,
             fontSize: t.fontSize || 40,
             fontFamily: 'Alexandria',
             fill: t.fill || '#1E4D2B',
             align: 'right',
             width: 880
          });
        });
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التوليد');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-3xl p-6 shadow-xl border border-black/5" dir="rtl">
      
      <div className="space-y-3 mb-6 border-b border-black/5 pb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">نمط الهوية (الوضع)</h4>
        <select 
          value={currentModeData?.id || ''} 
          onChange={(e) => onModeChange && onModeChange(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-sm font-bold text-brand-gray-navy focus:outline-none focus:border-brand-green-accent cursor-pointer"
        >
          {modes?.map(mode => (
            <option key={mode.id} value={mode.id}>{mode.name}</option>
          ))}
        </select>
      </div>



      <div className="space-y-3 mb-6 border-b border-black/5 pb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-green-accent">توليد النصوص والمهام (AI)</h4>
        <div className="flex flex-col gap-2">
          <input 
            type="text"
            placeholder="موضوع التصميم... (مثال: المدرجات الزراعية)"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-xs focus:outline-none focus:border-brand-green-accent"
          />
          <button 
            onClick={handleAiGeneration}
            disabled={isGeneratingAi || !aiTopic}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-[#3F4755] text-white hover:bg-[#1E4D2B] transition-all gap-2 text-xs font-bold disabled:opacity-50"
          >
            {isGeneratingAi ? 'جاري التصميم...' : 'توليد نصوص وتخطيط'}
            {!isGeneratingAi && <Sparkles className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6 border-b border-black/5 pb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-green-accent">مولّد الخلفيات الذكي (AI Visuals)</h4>
        <div className="flex flex-col gap-2">
          <input 
            type="text"
            placeholder="وصف المشهد... (مثال: جبال اليمن وقت الغروب)"
            value={bgPrompt}
            onChange={(e) => setBgPrompt(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-xs focus:outline-none focus:border-brand-green-accent"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => document.getElementById('ref-image-upload')?.click()}
              className="flex items-center justify-center p-3 rounded-xl bg-gray-50 border border-black/5 text-gray-400 hover:text-brand-green-deep hover:border-brand-green-accent transition-all shrink-0"
              title="تضمين صورة مرجعية (Image-to-Image)"
            >
              <ImageIcon className="h-4 w-4" />
              <input 
                id="ref-image-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files?.[0]) alert('تم تحديد الصورة المرجعية. (في النسخة المتقدمة سيتم إرسالها لـ Stability/DALL-E)');
                }} 
              />
            </button>
            <button 
              onClick={handleAiBgGeneration}
              disabled={isGeneratingBg || !bgPrompt}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-brand-green-deep to-brand-green-accent text-white hover:opacity-90 transition-all gap-2 text-xs font-bold disabled:opacity-50"
            >
              {isGeneratingBg ? 'جاري التوليد...' : 'توليد خلفية ذكية'}
              {!isGeneratingBg && <Sparkles className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 border-b border-black/5 pb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">الأدوات الأساسية</h4>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleAddText}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-brand-green-accent/20 hover:text-brand-green-deep transition-all gap-2 text-brand-gray-navy/70 border border-transparent hover:border-brand-green-accent/50"
          >
            <Type className="h-6 w-6" />
            <span className="text-xs font-bold">نص</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-brand-green-accent/20 hover:text-brand-green-deep transition-all gap-2 text-brand-gray-navy/70 border border-transparent hover:border-brand-green-accent/50"
          >
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs font-bold">صورة</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </button>

          <button 
            onClick={() => addObject({
              type: 'brand_allan',
              x: 100,
              y: 100,
              scaleX: 1,
              scaleY: 1
            })}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-brand-green-accent/20 hover:text-brand-green-deep transition-all gap-2 text-brand-gray-navy/70 border border-transparent hover:border-brand-green-accent/50 col-span-1"
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-xs font-bold">شعار علّان</span>
          </button>

          <button 
            onClick={() => addObject({
              type: 'brand_fadool',
              x: 100,
              y: 200,
              scaleX: 1,
              scaleY: 1
            })}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-brand-green-accent/20 hover:text-brand-green-deep transition-all gap-2 text-brand-gray-navy/70 border border-transparent hover:border-brand-green-accent/50 col-span-1"
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-xs font-bold">شعار فضول</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">أبعاد اللوحة (سوشيال ميديا)</h4>
        <select 
          onChange={(e) => {
            const [w, h] = e.target.value.split(',').map(Number);
            setCanvasSize(w, h);
          }}
          className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 text-sm font-bold text-brand-gray-navy focus:outline-none focus:border-brand-green-accent cursor-pointer"
        >
          <option value="1080,1080">منشور مربع (1:1) - 1080x1080</option>
          <option value="1080,1350">بورتريه (4:5) - 1080x1350</option>
          <option value="1080,1920">ستوري / ريلز (9:16) - 1080x1920</option>
          <option value="1920,1080">غلاف يوتيوب (16:9) - 1920x1080</option>
        </select>
      </div>

      <div className="mt-auto space-y-2">
         {selectedIds.length > 0 && (
            <div className="space-y-2 bg-gray-50 p-4 rounded-3xl border border-black/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40 mb-3 text-center">التحكم بالعنصر</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => selectedIds.forEach(id => reorderObject(id, 'front'))}
                  className="flex items-center justify-center p-3 sm:py-2 sm:px-1 bg-white text-brand-gray-navy hover:bg-brand-green-accent hover:text-brand-green-deep rounded-xl font-bold text-xs transition-all gap-1 shadow-sm border border-black/5 hover:border-transparent"
                >
                  <ArrowUp className="h-4 w-4" />
                  أمام
                </button>
                <button 
                  onClick={() => selectedIds.forEach(id => reorderObject(id, 'back'))}
                  className="flex items-center justify-center p-3 sm:py-2 sm:px-1 bg-white text-brand-gray-navy hover:bg-brand-green-accent hover:text-brand-green-deep rounded-xl font-bold text-xs transition-all gap-1 shadow-sm border border-black/5 hover:border-transparent"
                >
                  <ArrowDown className="h-4 w-4" />
                  خلف
                </button>
              </div>
              <button 
                onClick={handleDelete}
                className="w-full flex items-center justify-center py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl font-black text-xs transition-all gap-2 mt-2"
              >
                <Trash2 className="h-4 w-4" />
                حذف العنصر المختار
              </button>
            </div>
         )}

        <div className="flex flex-col gap-2 mt-2">
          <button 
            onClick={onExport}
            className="w-full flex items-center justify-center py-4 bg-brand-green-deep text-white hover:bg-brand-gray-navy rounded-2xl font-black text-sm uppercase tracking-widest transition-all gap-2 shadow-xl"
          >
            <Download className="h-4 w-4" />
            تصدير التصميم (PNG)
          </button>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button 
              onClick={onExportBrandedBg}
              className="w-full flex items-center justify-center py-3 bg-brand-gray-navy text-white hover:bg-brand-green-accent hover:text-brand-gray-navy rounded-xl font-bold text-xs transition-all gap-1 shadow-sm border border-black/5"
            >
              <Download className="h-3 w-3" />
              تصدير كخلفية (هوية)
            </button>
            <button 
              onClick={onExportRawBg}
              className="w-full flex items-center justify-center py-3 bg-white text-brand-gray-navy hover:bg-gray-100 rounded-xl font-bold text-xs transition-all gap-1 shadow-sm border border-black/5"
            >
              <Download className="h-3 w-3" />
              الخلفية (خام)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

