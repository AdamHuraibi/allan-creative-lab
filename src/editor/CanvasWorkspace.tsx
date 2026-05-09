import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Path, Group } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import { TextNode } from './TextNode';
import { ImageNode } from './ImageNode';
import { ShapeNode } from './ShapeNode';

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
                return (
                  <ImageNode
                     key={obj.id}
                     shapeProps={obj}
                     isSelected={selectedIds.includes(obj.id)}
                     onSelect={() => selectObject(obj.id)}
                  />
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
              return null;
            })}

            {/* Static Branding Overlays - Allan */}
            {(() => {
              const getColors = () => {
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
              const ac = getColors();
              const logoScale = (allanFontSize * 1.5) / 50; 
              // align it to the right
              const totalW = 50 * logoScale + 120 * logoScale; 

              return (
                <Group 
                  x={canvasSize.width - safeMarginX - totalW} 
                  y={safeMarginY}
                  listening={false}
                  {...glowEffects}
                >
                  <Group x={0} y={0} scaleX={logoScale} scaleY={logoScale}>
                    {/* Head */}
                    <Circle x={58} y={18} radius={8} fill={ac.light} />
                    {/* Upper Leaf (Light/Med) */}
                    <Path 
                      data="M58 28C58 28 45 45 45 55C45 65 55 70 70 65C60 65 52 50 78 35C78 35 65 25 58 28Z" 
                      fill={ac.med} 
                    />
                    {/* Lower Leaf (Dark) */}
                    <Path 
                      data="M35 50C35 50 25 75 50 85C75 95 85 70 85 70C85 70 65 80 40 68C30 60 35 50 35 50Z" 
                      fill={ac.dark} 
                    />
                  </Group>
                  <Group x={60 * logoScale} y={2 * logoScale} scaleX={logoScale} scaleY={logoScale}>
                    <Text
                      x={0}
                      y={0}
                      text="علان"
                      fontSize={36}
                      fontFamily="Alexandria"
                      fontWeight="bold"
                      fill={ac.dark}
                      align="right"
                      width={60}
                    />
                    <Text
                      x={0}
                      y={40}
                      text="ALLAN"
                      fontSize={9}
                      fontFamily="Inter"
                      fontWeight="bold"
                      fill={ac.text}
                      align="center"
                      width={60}
                      letterSpacing={4}
                    />
                  </Group>
                </Group>
              );
            })()}
            
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

            {/* Static Branding Overlays - Fadool */}
            {(() => {
              const isDarkBadge = ['DARK', 'PODCAST', 'HARVEST', 'NATURE'].includes(currentModeData?.id || '');
              const bubbleFill = isDarkBadge ? '#FFFFFF' : '#3F4755';
              const textArFill = isDarkBadge ? '#E4A201' : '#E4A201';
              const textEnFill = isDarkBadge ? '#FFFFFF' : '#3F4755';
              const labelFill = isDarkBadge ? 'rgba(255, 255, 255, 0.6)' : 'rgba(63, 71, 85, 0.6)';
              
              const logoScale = (fudoolFontSize * 2) / 100;
              
              return (
                <Group
                  x={safeMarginX}
                  y={canvasSize.height - safeMarginY - (100 * logoScale) - (fudoolFontSize * 1.2)}
                  listening={false}
                >
                  <Group x={0} y={0} scaleX={logoScale} scaleY={logoScale}>
                    <Path
                      data="M10,20 L80,5 L95,65 L78,65 L80,95 L65,65 L10,65 Z"
                      fill={bubbleFill}
                    />
                  </Group>
                  <Group x={105 * logoScale} y={20 * logoScale} scaleX={logoScale} scaleY={logoScale}>
                    <Text
                      x={0}
                      y={0}
                      text="فضول بودكاست"
                      fontSize={32}
                      fontFamily="Alexandria"
                      fontWeight="bold"
                      fill={textArFill}
                    />
                    <Text
                      x={0}
                      y={40}
                      text="FADOOL PODCAST"
                      fontSize={26}
                      fontFamily="Inter"
                      fontWeight="bold"
                      fill={textEnFill}
                    />
                  </Group>
                  
                  <Text
                    x={0}
                    y={110 * logoScale}
                    text="POWERED & PRODUCED BY FADOOL PODCAST"
                    fontSize={fudoolFontSize * 0.45}
                    fontFamily="Inter"
                    fontWeight="bold"
                    fill={labelFill}
                    letterSpacing={fudoolFontSize * 0.1}
                  />
                </Group>
              );
            })()}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
