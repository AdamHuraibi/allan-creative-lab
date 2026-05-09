import React, { useRef, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { motion } from 'motion/react';

interface ExportableAssetsHubProps {
  MODE_DATA: any[];
  AllanLogo: React.FC<any>;
  FadoolLogo: React.FC<any>;
}

const ExportableItem = ({ title, children, showHex, hexCode }: { title: string, children: React.ReactNode, showHex?: boolean, hexCode?: string }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleExportPng = async () => {
    if (!nodeRef.current) return;
    setDownloadingPng(true);
    try {
      const dataUrl = await toPng(nodeRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: 'transparent' });
      const link = document.createElement('a');
      link.download = `${title.replace(/ /g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG:', err);
    }
    setDownloadingPng(false);
  };

  const handleExportSvg = async () => {
    if (!nodeRef.current) return;
    setDownloadingSvg(true);
    try {
      const dataUrl = await toSvg(nodeRef.current, { cacheBust: true, backgroundColor: 'transparent' });
      const link = document.createElement('a');
      link.download = `${title.replace(/ /g, '_')}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting SVG:', err);
    }
    setDownloadingSvg(false);
  };

  return (
    <div 
      className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center justify-between min-h-[250px] relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-brand-gray-navy/30 tracking-widest bg-gray-50 px-2 py-1 rounded-md">
        {title}
      </div>

      <div 
        className="flex-1 flex flex-col items-center justify-center w-full mt-4 p-8 relative rounded-2xl"
        style={{
          backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <div ref={nodeRef} className="flex items-center justify-center transition-transform group-hover:scale-105 duration-500 p-4">
          {children}
        </div>
      </div>

      {showHex && hexCode && (
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 z-20 ${hovered ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'}`}>
           <span className="text-white font-mono font-bold tracking-widest text-lg">{hexCode}</span>
        </div>
      )}

      <div className="flex gap-2 w-full mt-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleExportPng}
          disabled={downloadingPng}
          className="flex-1 py-3 bg-brand-gray-navy text-white rounded-xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-brand-green-deep transition-all flex items-center justify-center gap-1"
        >
          {downloadingPng ? <CheckCircle2 className="w-4 h-4 text-brand-green-accent" /> : <><Download className="w-4 h-4" /> تصدير PNG</>}
        </button>
        <button 
          onClick={handleExportSvg}
          disabled={downloadingSvg}
          className="flex-1 py-3 bg-brand-green-accent text-brand-gray-navy rounded-xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-brand-gold-harvest transition-all flex items-center justify-center gap-1"
        >
          {downloadingSvg ? <CheckCircle2 className="w-4 h-4 text-brand-green-deep" /> : <><Download className="w-4 h-4" /> تصدير SVG</>}
        </button>
      </div>
    </div>
  );
};

const PaletteCard = ({ mode }: { mode: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: '#FFFFFF' });
      const link = document.createElement('a');
      link.download = `allan-palette-${mode.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting Palette PNG:', err);
    }
    setDownloading(false);
  };

  const handleExportJson = () => {
    const data = {
      id: mode.id,
      name: mode.name,
      sub: mode.sub,
      colors: mode.colors,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `allan-palette-${mode.id}.json`;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4 group">
      {/* The Printable/Exportable Card */}
      <div 
        ref={cardRef} 
        className="bg-[#F8F4EA] rounded-[2rem] p-8 border border-black/5 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
             <h3 className="text-2xl font-black text-brand-green-deep tracking-tight mb-1">{mode.name}</h3>
             <p className="text-xs font-bold text-brand-gray-navy/50 tracking-widest uppercase">{mode.id} - {mode.sub}</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] uppercase tracking-widest font-black text-brand-gray-navy/30">Allan Brand System</span>
          </div>
        </div>

        <div className="flex gap-2 h-32 relative z-10">
          {mode.colors.map((color: string, i: number) => {
             const names = ['الرئيسي', 'الثانوي', 'النص', 'التمييز'];
             const label = names[i] || `اللون ${i+1}`;
             return (
               <div key={i} className="flex-1 flex flex-col gap-2">
                 <div 
                   className="w-full flex-1 rounded-2xl shadow-inner border border-black/5"
                   style={{ backgroundColor: color }}
                 />
                 <div className="text-center">
                   <div className="text-[10px] font-bold text-brand-gray-navy/60 mb-0.5">{label}</div>
                   <div className="text-[9px] font-mono text-brand-gray-navy font-bold uppercase">{color}</div>
                 </div>
               </div>
             )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleExportPng}
          disabled={downloading}
          className="flex-1 py-3 bg-brand-green-deep text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 hover:bg-brand-gray-navy"
        >
          {downloading ? <CheckCircle2 className="w-4 h-4 text-brand-green-accent" /> : <><Download className="w-4 h-4" /> تحميل لوحة النمط</>}
        </button>
        <button 
          onClick={handleExportJson}
          className="px-4 py-3 bg-gray-100 text-brand-gray-navy hover:bg-gray-200 rounded-xl text-xs font-black transition-all flex items-center justify-center"
          title="تحميل كملف JSON للمبرمجين"
        >
          <span className="font-mono mt-0.5">JSON</span>
        </button>
      </div>
    </div>
  );
};

export const ExportableAssetsHub: React.FC<ExportableAssetsHubProps> = ({ MODE_DATA, AllanLogo, FadoolLogo }) => {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 animate-in fade-in duration-700 font-sans" dir="rtl">
      <header className="mb-16">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-6xl font-black tracking-tighter text-brand-green-deep uppercase">Assets Hub.</h1>
          <button 
            onClick={() => {
              const cssVars = MODE_DATA.map(mode => `/* ${mode.name} */\n${mode.colors.map((c: string, i: number) => `--color-${mode.id.toLowerCase()}-${i+1}: ${c};`).join('\n')}`).join('\n\n');
              const blob = new Blob([cssVars], { type: 'text/css' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'allan-colors.css';
              link.click();
            }}
            className="flex items-center gap-2 bg-brand-green-deep text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-gray-navy transition-all"
          >
            <Download className="w-4 h-4" />
            تصدير ألوان CSS (للمطورين)
          </button>
        </div>
        <p className="text-2xl text-brand-gray-navy/60 max-w-3xl leading-relaxed">
          مكتبة الأصول المتكاملة. هنا يمكنك معاينة وتصدير عناصر الهوية بكل الأنماط والألوان بخلفيات شفافة جاهزة للاستخدام.
        </p>
      </header>

      <div className="space-y-16">
        {/* Section 0: Brand Palettes */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-gray-navy">بطاقات الأنماط (Brand Styles)</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-brand-gray-navy/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODE_DATA.map((mode) => {
              return (
                <PaletteCard key={`palette-${mode.id}`} mode={mode} />
              )
            })}
          </div>
        </section>

        {/* Section 1: Logos */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-gray-navy">الشعارات (Logos)</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-brand-gray-navy/10 to-transparent" />
          </div>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">شعار علّان</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MODE_DATA.map((mode) => (
                  <ExportableItem key={`allan-${mode.id}`} title={`Allan - ${mode.sub}`} showHex hexCode={mode.colors[0]}>
                     <AllanLogo mode={mode.id} className="scale-125" />
                  </ExportableItem>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">شعار فضول بودكاست</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MODE_DATA.map((mode) => (
                  <ExportableItem key={`fadool-${mode.id}`} title={`Fadool - ${mode.sub}`} showHex hexCode={mode.colors[0] || '#3F4755'}>
                     <FadoolLogo mode={mode.id} className="scale-[1.5]" showLabel />
                  </ExportableItem>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-gray-navy">التيبوغرافيا (Typography)</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-brand-gray-navy/10 to-transparent" />
          </div>
          
          <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">يوزر نيم (Social Handle)</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MODE_DATA.map((mode) => {
                  const isDark = ['HARVEST', 'PODCAST', 'DARK', 'NATURE'].includes(mode.id);
                  const colorMatch = mode.colors[0] || '#1E4D2B';
                  return (
                    <ExportableItem key={`username-${mode.id}`} title={`@AllanYemen - ${mode.id}`} showHex hexCode={colorMatch}>
                      <span 
                        className="text-3xl font-black tracking-widest flex items-center justify-center p-4 rounded-xl font-sans" 
                        style={{ color: colorMatch }}
                        dir="ltr"
                      >
                        @AllanYemen
                      </span>
                    </ExportableItem>
                  );
                })}
             </div>
          </div>
        </section>

        {/* Section 3: Decorative Elements */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-gray-navy">العناصر الزخرفية (Decorative)</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-brand-gray-navy/10 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {MODE_DATA.map((mode) => {
               const color1 = mode.colors[0] || '#1E4D2B';
               const color2 = mode.colors[1] || '#A3C63A';
               return (
                  <ExportableItem key={`deco-dots-${mode.id}`} title={`Green Dots - ${mode.id}`} showHex hexCode={color1}>
                     <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color1 }} />
                        <div className="w-5 h-5 rounded-full opacity-60" style={{ backgroundColor: color2 }} />
                        <div className="w-5 h-5 rounded-full opacity-30" style={{ backgroundColor: color1 }} />
                     </div>
                  </ExportableItem>
               );
             })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
             {MODE_DATA.map((mode) => {
               const isDark = ['HARVEST', 'PODCAST', 'DARK', 'NATURE'].includes(mode.id);
               const color1 = mode.colors[0] || '#1E4D2B';
               return (
                  <ExportableItem key={`deco-lines-${mode.id}`} title={`Divider - ${mode.id}`} showHex hexCode={color1}>
                     <div className="flex flex-col gap-1 w-32">
                        <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: color1 }} />
                        <div className="h-0.5 w-2/3 rounded-full opacity-50" style={{ backgroundColor: color1 }} />
                        <div className="h-0.5 w-1/3 rounded-full opacity-30" style={{ backgroundColor: color1 }} />
                     </div>
                  </ExportableItem>
               );
             })}
          </div>
        </section>
      </div>

    </main>
  );
};

