import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import { CanvasObject, useEditorStore } from '../store/useEditorStore';

interface TextNodeProps {
  shapeProps: CanvasObject;
  isSelected: boolean;
  onSelect: () => void;
}

export const TextNode: React.FC<TextNodeProps> = ({ shapeProps, isSelected, onSelect }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const updateObject = useEditorStore(state => state.updateObject);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          updateObject(shapeProps.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale to 1 and update width/height and font size (for text)
          node.scaleX(1);
          node.scaleY(1);
          
          updateObject(shapeProps.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            scaleX: 1,
            scaleY: 1,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
        />
      )}
    </React.Fragment>
  );
};
