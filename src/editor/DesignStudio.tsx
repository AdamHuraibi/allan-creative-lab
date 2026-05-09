import React, { useRef } from 'react';
import { CanvasWorkspace } from './CanvasWorkspace';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';

interface DesignStudioProps {
  currentModeData?: any;
  modes?: any[];
  onModeChange?: (modeId: string) => void;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({ currentModeData, modes, onModeChange }) => {
  const canvasRef = useRef<any>(null);

  const handleExport = () => {
    if (canvasRef.current) {
      const uri = canvasRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'allan-design.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex h-[800px] bg-[#F8F4EA] gap-6 rounded-3xl overflow-hidden p-6 shadow-sm border border-black/5" dir="rtl">
      
      {/* Sidebar Tools */}
      <div className="w-80 flex flex-col shrink-0 overflow-y-auto">
        <Toolbar onExport={handleExport} currentModeData={currentModeData} modes={modes} onModeChange={onModeChange} />
        <PropertiesPanel />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-white/50 rounded-3xl p-6 border border-black/5 shadow-inner">
        <CanvasWorkspace canvasRef={canvasRef} />
      </div>

    </div>
  );
};
