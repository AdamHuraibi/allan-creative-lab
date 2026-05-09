import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Path, Group } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import { TextNode } from './TextNode';
import { ImageNode } from './ImageNode';
import { ShapeNode } from './ShapeNode';
import { BrandNode } from './BrandNode';

interface CanvasWorkspaceProps {
  canvasRef?: React.RefObject<any>;
  currentModeData?: any;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({ canvasRef, currentModeData }) => {
  const { objects, selectedIds, selectObject, canvasSize } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Resize canvas responsively based on container size
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Calculate scale to fit the canvasSize within the container
        const scaleX = width / canvasSize.width;
        const scaleY = height / canvasSize.height;
        const minScale = Math.min(scaleX, scaleY) * 0.9; // 90% of available space
        setScale(minScale);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasSize]);

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background-rect';
    if (clickedOnEmpty) {
      selectObject(null);
    }
  };

  // Sync objects with the primary brand style when mode changes
  useEffect(() => {
    if (!currentModeData) return;
    const isDarkMode = ['HARVEST', 'PODCAST', 'DARK', 'NATURE'].includes(currentModeData.id);
    const textFill = isDarkMode ? '#FFFFFF' : '#1E4D2B';
    const secondaryFill = currentModeData.colors?.[1] || (isDarkMode ? '#F8F4EA' : '#D6613F');

    objects.forEach(obj => {
      let updates: any = {};
      if (obj.type === 'text') {
        updates.fontFamily = 'Alexandria';
        // Give the first text primary color, others secondary as a naive heuristic, or just primary textfill
        updates.fill = obj.text?.includes('اقتباس') ? secondaryFill : textFill;
      } else if (obj.type === 'shape') {
        // We shouldn't overwrite the main background placeholder if it was added separately, 
        // but let's safely color all small shapes with secondary color.
        if (obj.width && obj.height && obj.width < canvasSize.width * 0.8) {
          updates.fill = secondaryFill;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        useEditorStore.getState().updateObject(obj.id, updates);
      }
    });
  }, [currentModeData]);

  const isPortrait = canvasSize.height > canvasSize.width;
  const isSquare = canvasSize.width === canvasSize.height;

  const safeMarginX = Math.min(canvasSize.width, canvasSize.height) * 0.06;
  const safeMarginY = isPortrait ? canvasSize.height * 0.08 : safeMarginX;
  
  let allanFontSize = Math.min(canvasSize.width, canvasSize.height) * 0.07;
  let fudoolFontSize = Math.min(canvasSize.width, canvasSize.height) * 0.025;
  let usernameFontSize = Math.min(canvasSize.width, canvasSize.height) * 0.025;

  if (isPortrait) {
    allanFontSize *= 1.2;
  } else if (isSquare) {
    allanFontSize *= 0.8;
    fudoolFontSize *= 0.8;
    usernameFontSize *= 0.8;
  }

  const isDarkMode = ['DARK', 'NATURE', 'EARTH', 'PODCAST'].includes(currentModeData?.id);
  const textFill1 = isDarkMode ? '#FFFFFF' : '#1E4D2B';
  const textFill2 = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30, 77, 43, 0.8)';
  const accentFill = currentModeData?.colors?.[1] || (isDarkMode ? '#BCEE18' : '#1E4D2B');
  
  const usernameFontWeight = ['NATURE', 'EARTH'].includes(currentModeData?.id) ? 'normal' : 'bold';

  const glowEffects = (currentModeData?.id === 'DARK' || currentModeData?.id === 'NATURE') 
    ? { shadowColor: '#BCEE18', shadowBlur: 15, shadowOpacity: 0.6 }
    : {};

  const getBrandColors = () => {
    switch (currentModeData?.id) {
      case 'NATURE': return { dark: '#1E4D2B', med: '#4CAF50', light: '#E4A201', text: '#1E4D2B' };
      case 'EARTH': return { dark: '#5D4037', med: '#8A6E5D', light: '#EADDCB', text: '#5D4037' };
      case 'HARVEST': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'MONO_DARK': return { dark: 'black', med: 'black', light: 'black', text: 'black' };
      case 'MONO_LIGHT': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'DARK': return { dark: '#F8F4EA', med: '#A3C63A', light: '#A3C63A', text: '#F8F4EA' };
      case 'PODCAST': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'CREATIVE': return { dark: '#1E4D2B', med: '#E4A201', light: '#A3C63A', text: '#1E4D2B' };
      default: return { dark: '#1E4D2B', med: '#A3C63A', light: '#A3C63A', text: '#1E4D2B' };
    }
  };

  const getFudoolColors = () => {
    const isDarkBadge = ['DARK', 'PODCAST', 'HARVEST', 'NATURE'].includes(currentModeData?.id || '');
    return {
      bubbleFill: isDarkBadge ? '#FFFFFF' : '#3F4755',
      textArFill: isDarkBadge ? '#E4A201' : '#E4A201',
      textEnFill: isDarkBadge ? '#FFFFFF' : '#3F4755',
      labelFill: isDarkBadge ? 'rgba(255, 255, 255, 0.6)' : 'rgba(63, 71, 85, 0.6)'
    };
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden rounded-3xl" dir="ltr">
      <div 
        style={{ 
          width: canvasSize.width * scale, 
          height: canvasSize.height * scale,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          transition: 'width 0.3s ease-out, height 0.3s ease-out'
        }}
        className="bg-white relative"
      >
        <Stage
          width={canvasSize.width * scale}
          height={canvasSize.height * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={canvasRef}
        >
          <Layer>
            {currentModeData?.id === 'NATURE' ? (
               <Rect 
                 x={0} 
                 y={0} 
                 width={canvasSize.width} 
                 height={canvasSize.height} 
                 fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                 fillLinearGradientEndPoint={{ x: canvasSize.width, y: canvasSize.height }}
                 fillLinearGradientColorStops={[0, '#1E4D2B', 1, '#E4A201']}
                 name="background-rect"
               />
            ) : (
              <Rect 
                x={0} 
                y={0} 
                width={canvasSize.width} 
                height={canvasSize.height} 
                fill={currentModeData?.id === 'PRIMARY' ? '#F8F4EA' 
                    : currentModeData?.id === 'EARTH' ? '#8A6E5D'
                    : currentModeData?.id === 'HARVEST' ? '#E4A201'
                    : currentModeData?.id === 'DARK' ? '#3F4755'
                    : currentModeData?.id === 'PODCAST' ? '#D6613F'
                    : '#F8F4EA' }
                name="background-rect"
              />
            )}
            
            {/* Micro-Identity Elements */}
            <Rect
              x={safeMarginX}
              y={safeMarginY}
              width={2}
              height={canvasSize.height * 0.15}
              fill={accentFill}
              listening={false}
              opacity={0.5}
            />
            {currentModeData?.id === 'NATURE' || currentModeData?.id === 'PRIMARY' ? (
              <Circle
                x={canvasSize.width - safeMarginX - (allanFontSize * 1.5)}
                y={safeMarginY + allanFontSize / 2}
                radius={allanFontSize * 0.15}
                fill={accentFill}
                listening={false}
              />
            ) : null}

            {/* Username @AllanYemen */}
            <Text
              x={canvasSize.width - 500 - safeMarginX}
              y={canvasSize.height - safeMarginY - usernameFontSize}
              width={500}
              text="@AllanYemen"
              fontSize={usernameFontSize}
              fontFamily="Inter"
              fontWeight={usernameFontWeight}
              fill={textFill2}
              align="right"
              listening={false}
              letterSpacing={2}
            />

            {objects.map((obj) => {
              if (obj.type === 'text') {
                return (
                  <TextNode
                    key={obj.id}
                    shapeProps={obj}
                    isSelected={selectedIds.includes(obj.id)}
                    onSelect={() => selectObject(obj.id)}
                  />
                );
              }
              if (obj.type === 'image') {
                const isBg = obj.width === canvasSize.width && obj.height === canvasSize.height && obj.x === 0 && obj.y === 0;
                let overlayColor = 'transparent';
                if (currentModeData?.id === 'EARTH') overlayColor = 'rgba(138, 110, 93, 0.4)'; // #8A6E5D
                else if (currentModeData?.id === 'HARVEST') overlayColor = 'rgba(228, 162, 1, 0.3)'; // #E4A201
                else if (currentModeData?.id === 'NATURE') overlayColor = 'rgba(30, 77, 43, 0.4)'; // #1E4D2B
                else if (currentModeData?.id === 'PODCAST') overlayColor = 'rgba(214, 97, 63, 0.4)'; // #D6613F
                else if (currentModeData?.id === 'DARK') overlayColor = 'rgba(63, 71, 85, 0.6)'; // #3F4755
                else if (currentModeData?.id === 'PRIMARY') overlayColor = 'rgba(30, 77, 43, 0.2)'; 

                return (
                  <React.Fragment key={obj.id}>
                    <ImageNode
                       shapeProps={obj}
                       isSelected={selectedIds.includes(obj.id)}
                       onSelect={() => selectObject(obj.id)}
                    />
                    {isBg && overlayColor !== 'transparent' && (
                      <Rect
                        x={0}
                        y={0}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        fill={overlayColor}
                        listening={false}
                        name="bg-overlay"
                      />
                    )}
                  </React.Fragment>
                );
              }
              if (obj.type === 'shape') {
                return (
                  <ShapeNode
                     key={obj.id}
                     shapeProps={obj}
                     isSelected={selectedIds.includes(obj.id)}
                     onSelect={() => selectObject(obj.id)}
                  />
                );
              }
              if (obj.type === 'brand_allan' || obj.type === 'brand_fadool') {
                return (
                  <BrandNode
                     key={obj.id}
                     shapeProps={obj}
                     isSelected={selectedIds.includes(obj.id)}
                     onSelect={() => selectObject(obj.id)}
                     colors={getBrandColors()}
                     glowEffects={glowEffects}
                     fudoolColors={getFudoolColors()}
                     canvasSize={canvasSize}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
