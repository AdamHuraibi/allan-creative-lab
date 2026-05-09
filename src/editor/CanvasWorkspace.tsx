import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import { TextNode } from './TextNode';
import { ImageNode } from './ImageNode';
import { ShapeNode } from './ShapeNode';

interface CanvasWorkspaceProps {
  canvasRef?: React.RefObject<any>;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({ canvasRef }) => {
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

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden rounded-3xl" dir="ltr">
      <div 
        style={{ 
          width: canvasSize.width * scale, 
          height: canvasSize.height * scale,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
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
            <Rect 
              x={0} 
              y={0} 
              width={canvasSize.width} 
              height={canvasSize.height} 
              fill="#ffffff" 
              name="background-rect"
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
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
