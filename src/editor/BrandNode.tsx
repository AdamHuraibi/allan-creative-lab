import React, { useRef, useEffect } from 'react';
import { Group, Path, Text, Circle, Transformer } from 'react-konva';
import { CanvasObject, useEditorStore } from '../store/useEditorStore';

interface BrandNodeProps {
  shapeProps: CanvasObject;
  isSelected: boolean;
  onSelect: () => void;
  colors: any;
  glowEffects: any;
  fudoolColors: any;
  canvasSize: { width: number; height: number };
}

export const BrandNode: React.FC<BrandNodeProps> = ({ shapeProps, isSelected, onSelect, colors, glowEffects, fudoolColors, canvasSize }) => {
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const updateObject = useEditorStore(state => state.updateObject);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      // we need to attach transformer to group
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragMove = (e: any) => {
    const node = e.target;
    // basic snapping to canvas edges
    const x = node.x();
    const y = node.y();
    const snapMargin = 40;
    
    // For snapping to work best, we usually take bounding box. But approximate with coordinates is fine.
    let newX = x;
    let newY = y;
    
    if (Math.abs(x) < snapMargin) newX = 0;
    else if (Math.abs(x + 100 - canvasSize.width) < snapMargin) newX = canvasSize.width - 100;

    if (Math.abs(y) < snapMargin) newY = 0;
    else if (Math.abs(y + 100 - canvasSize.height) < snapMargin) newY = canvasSize.height - 100;
    
    node.x(newX);
    node.y(newY);
  };

  const handleDragEnd = (e: any) => {
    updateObject(shapeProps.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = groupRef.current;
    
    // For groups, we use scaleX/scaleY to size them since their children have fixed relative coordinates.
    // However, it's conventional in react-konva to set width/height for resizing.
    // Let's just store scaleX and scaleY for brand logos.
    updateObject(shapeProps.id, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  };

  return (
    <React.Fragment>
      <Group
        ref={groupRef}
        x={shapeProps.x}
        y={shapeProps.y}
        scaleX={shapeProps.scaleX || 1}
        scaleY={shapeProps.scaleY || 1}
        rotation={shapeProps.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        {...(shapeProps.type === 'brand_allan' ? glowEffects : {})}
      >
        {shapeProps.type === 'brand_allan' && (
          <>
            <Group x={0} y={0} scaleX={1} scaleY={1}>
              {/* Head */}
              <Circle x={58} y={18} radius={8} fill={colors.light} />
              {/* Upper Leaf (Light/Med) */}
              <Path 
                data="M58 28C58 28 45 45 45 55C45 65 55 70 70 65C60 65 52 50 78 35C78 35 65 25 58 28Z" 
                fill={colors.med} 
              />
              {/* Lower Leaf (Dark) */}
              <Path 
                data="M35 50C35 50 25 75 50 85C75 95 85 70 85 70C85 70 65 80 40 68C30 60 35 50 35 50Z" 
                fill={colors.dark} 
              />
            </Group>
            <Group x={60} y={2} scaleX={1} scaleY={1}>
              <Text
                x={0}
                y={0}
                text="علان"
                fontSize={36}
                fontFamily="Alexandria"
                fontWeight="bold"
                fill={colors.dark}
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
                fill={colors.text}
                align="center"
                width={60}
                letterSpacing={4}
              />
            </Group>
          </>
        )}

        {shapeProps.type === 'brand_fadool' && (
          <>
            <Group x={0} y={0}>
              <Path
                data="M10,20 L80,5 L95,65 L78,65 L80,95 L65,65 L10,65 Z"
                fill={fudoolColors.bubbleFill}
              />
            </Group>
            <Group x={105} y={20}>
              <Text
                x={0}
                y={0}
                text="فضول بودكاست"
                fontSize={32}
                fontFamily="Alexandria"
                fontWeight="bold"
                fill={fudoolColors.textArFill}
              />
              <Text
                x={0}
                y={40}
                text="FADOOL PODCAST"
                fontSize={26}
                fontFamily="Inter"
                fontWeight="bold"
                fill={fudoolColors.textEnFill}
              />
            </Group>
            <Text
              x={0}
              y={110}
              text="POWERED & PRODUCED BY FADOOL PODCAST"
              fontSize={14}
              fontFamily="Inter"
              fontWeight="bold"
              fill={fudoolColors.labelFill}
              letterSpacing={1.4}
            />
          </>
        )}
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            return newBox;
          }}
          keepRatio={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </React.Fragment>
  );
};
