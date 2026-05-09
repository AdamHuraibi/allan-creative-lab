import React, { useRef } from 'react';
import { CanvasWorkspace } from './CanvasWorkspace';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';

interface DesignStudioProps {
  currentModeData?: any;
  modes?: any[];
  onModeChange?: (modeId: string) => void;
  currentCategory?: any;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({ currentModeData, modes, onModeChange, currentCategory }) => {
  const canvasRef = useRef<any>(null);

  const handleExport = () => {
    if (canvasRef.current) {
      exportWithLayers('allan-design.png', () => {});
    }
  };

  const exportWithLayers = (filename: string, modifyFn: () => void) => {
    if (!canvasRef.current) return;
    
    const stage = canvasRef.current;
    
    // Save original state of all children 
    const originalStates = new Map();
    const children = stage.getLayers()[0].getChildren();
    children.forEach((child: any) => {
      originalStates.set(child, {
         visible: child.visible(),
         opacity: child.opacity()
      });
    });

    // Apply modifications
    modifyFn();

    // Export
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restore original state
    children.forEach((child: any) => {
      const state = originalStates.get(child);
      if (state) {
        child.visible(state.visible);
        child.opacity(state.opacity);
      }
    });
  };

  const handleExportRawBg = () => {
    exportWithLayers('allan-raw-bg.png', () => {
        const children = canvasRef.current.getLayers()[0].getChildren();
        children.forEach((child: any) => {
           const isBackgroundRect = child.name() === 'background-rect';
           const isBgImage = child.className === 'Image' && child.x() === 0 && child.y() === 0 && child.width() >= stageWidth(child) * 0.9; 
           
           if (!isBackgroundRect && !isBgImage) {
               child.visible(false);
           }
           if (child.name() === 'bg-overlay') child.visible(false);
        });
    });
  };

  const handleExportBrandedBg = () => {
    exportWithLayers('allan-branded-bg.png', () => {
        const children = canvasRef.current.getLayers()[0].getChildren();
        children.forEach((child: any) => {
           const isBackgroundRect = child.name() === 'background-rect';
           const isBgImage = child.className === 'Image' && child.x() === 0 && child.y() === 0 && child.width() >= stageWidth(child) * 0.9;
           const isOverlay = child.name() === 'bg-overlay';
           
           if (!isBackgroundRect && !isBgImage && !isOverlay) {
               child.visible(false);
           }
        });
    });
  };

  const stageWidth = (node: any) => node.getStage()?.width() || 1080;
  const stageHeight = (node: any) => node.getStage()?.height() || 1080;

  return (
    <div className="flex h-[800px] bg-[#F8F4EA] gap-6 rounded-3xl overflow-hidden p-6 shadow-sm border border-black/5" dir="rtl">
      
      {/* Sidebar Tools */}
      <div className="w-80 flex flex-col shrink-0 overflow-y-auto">
        <Toolbar 
          onExport={handleExport} 
          onExportRawBg={handleExportRawBg}
          onExportBrandedBg={handleExportBrandedBg}
          currentModeData={currentModeData} 
          modes={modes} 
          onModeChange={onModeChange} 
          currentCategory={currentCategory} 
        />
        <PropertiesPanel />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-white/50 rounded-3xl p-6 border border-black/5 shadow-inner">
        <CanvasWorkspace canvasRef={canvasRef} currentModeData={currentModeData} />
      </div>

    </div>
  );
};
