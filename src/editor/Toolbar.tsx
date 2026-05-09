import React, { useRef, useState } from 'react';
import { Type, Image as ImageIcon, Download, Trash2, Layout, Square, Smartphone, Monitor, AppWindow, Sparkles } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

interface ToolbarProps {
  onExport: () => void;
  currentModeData?: any;
  modes?: any[];
  onModeChange?: (modeId: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExport, currentModeData, modes, onModeChange }) => {
  const { addObject, selectedIds, deleteObject, setCanvasSize } = useEditorStore();
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

      // Add a background color rectangle or just use the objects
      // Actually, we can add a huge rect for background color
      addObject({
        type: 'shape',
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        fill: data.themeColor || '#F8F4EA' // the brand ivory
      });

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

  const handleTemplate1 = () => {
    useEditorStore.getState().clearCanvas();
    setCanvasSize(1080, 1080);
    
    addObject({
      type: 'text',
      x: 100,
      y: 80,
      text: 'حكاية البن',
      fontSize: 120,
      fontFamily: 'Alexandria',
      fontWeight: 'bold',
      fill: '#1E4D2B',
      align: 'right',
    });
    
    addObject({
      type: 'text',
      x: 100,
      y: 240,
      text: 'من أعالي الجبال اليمنية',
      fontSize: 40,
      fontFamily: 'Alexandria',
      fill: '#D6613F',
      align: 'right',
    });

    addObject({
      type: 'text',
      x: 100,
      y: 900,
      text: 'مشروع علّان - الموسم الأول',
      fontSize: 30,
      fontFamily: 'Inter',
      fill: '#3F4755',
      align: 'right',
    });
  };

  const handleTemplate2 = () => {
    useEditorStore.getState().clearCanvas();
    setCanvasSize(1080, 1920);
    
    addObject({
      type: 'shape',
      x: 0,
      y: 0,
      width: 1080,
      height: 1920,
      fill: currentModeData?.colors?.[0] || '#1E4D2B'
    });

    addObject({
      type: 'text',
      x: 90,
      y: 300,
      text: 'أصوات من الطين',
      fontSize: 100,
      fontFamily: 'Alexandria',
      fontWeight: 'bold',
      fill: currentModeData?.colors?.[1] || '#F8F4EA',
      align: 'right',
      width: 900
    });

    addObject({
      type: 'text',
      x: 90,
      y: 450,
      text: 'حكايات العمارة الطينية في اليمن',
      fontSize: 40,
      fontFamily: 'Alexandria',
      fill: currentModeData?.colors?.[1] || '#F8F4EA',
      align: 'right',
      width: 900
    });
  };

  const handleTemplate3 = () => {
    useEditorStore.getState().clearCanvas();
    setCanvasSize(1080, 1080);
    
    addObject({
      type: 'shape',
      x: 0,
      y: 0,
      width: 1080,
      height: 1080,
      fill: '#F8F4EA' 
    });

    addObject({
      type: 'text',
      x: 100,
      y: 100,
      text: 'اقتباس اليوم',
      fontSize: 30,
      fontFamily: 'Inter',
      fill: '#3F4755',
      align: 'right',
      width: 880
    });

    addObject({
      type: 'text',
      x: 100,
      y: 300,
      text: '"الأرض التي لا نزرعها، لا تزرع فينا الانتماء."',
      fontSize: 80,
      fontFamily: 'Alexandria',
      fontWeight: 'bold',
      fill: currentModeData?.colors?.[0] || '#1E4D2B',
      align: 'center',
      width: 880
    });
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
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">القوالب الجاهزة</h4>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleTemplate1}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-brand-green-deep text-white hover:bg-brand-green-nature transition-all gap-2 text-xs font-bold shadow-md"
          >
            <AppWindow className="h-4 w-4" />
            بودكاست تراثي
          </button>
          <button 
            onClick={handleTemplate2}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-brand-gray-navy text-white hover:bg-[#1E4D2B] transition-all gap-2 text-xs font-bold shadow-md"
          >
            <AppWindow className="h-4 w-4" />
            غلاف كتاب / ستوري
          </button>
          <button 
            onClick={handleTemplate3}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-white border border-brand-gray-navy/20 text-brand-gray-navy hover:bg-gray-50 transition-all gap-2 text-xs font-bold shadow-sm"
          >
            <AppWindow className="h-4 w-4" />
            اقتباس سوشيال
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6 border-b border-black/5 pb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-green-accent">المصمم الذكي (AI)</h4>
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
            {isGeneratingAi ? 'جاري التصميم...' : 'توليد تصميم أساسي'}
            {!isGeneratingAi && <Sparkles className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
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
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">أبعاد اللوحة</h4>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setCanvasSize(1080, 1080)} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all gap-2 text-brand-gray-navy border border-black/5">
             <Square className="h-5 w-5 opacity-60" />
             <span className="text-[10px] font-bold">مربع</span>
          </button>
          <button onClick={() => setCanvasSize(1080, 1920)} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all gap-2 text-brand-gray-navy border border-black/5">
             <Smartphone className="h-5 w-5 opacity-60" />
             <span className="text-[10px] font-bold">ستوري</span>
          </button>
          <button onClick={() => setCanvasSize(1920, 1080)} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all gap-2 text-brand-gray-navy border border-black/5">
             <Monitor className="h-5 w-5 opacity-60" />
             <span className="text-[10px] font-bold">يوتيوب</span>
          </button>
        </div>
      </div>

      <div className="mt-auto space-y-2">
         {selectedIds.length > 0 && (
            <button 
              onClick={handleDelete}
              className="w-full flex items-center justify-center py-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl font-black text-sm transition-all gap-2"
            >
              <Trash2 className="h-4 w-4" />
              حذف العنصر المختار
            </button>
         )}

        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center py-4 bg-brand-green-deep text-white hover:bg-brand-gray-navy rounded-2xl font-black text-sm uppercase tracking-widest transition-all gap-2 shadow-xl"
        >
          <Download className="h-4 w-4" />
          تصدير التصميم
        </button>
      </div>

    </div>
  );
};
