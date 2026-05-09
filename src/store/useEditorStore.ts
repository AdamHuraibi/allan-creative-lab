import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ObjectType = 'text' | 'image' | 'shape';

export interface CanvasObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  fill?: string;
  
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  align?: 'left' | 'center' | 'right';
  
  // Image specific
  src?: string;
}

interface EditorState {
  objects: CanvasObject[];
  selectedIds: string[];
  canvasSize: { width: number; height: number };
  
  // Actions
  setCanvasSize: (width: number, height: number) => void;
  addObject: (obj: Omit<CanvasObject, 'id'>) => void;
  updateObject: (id: string, attrs: Partial<CanvasObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null, multi?: boolean) => void;
  clearSelection: () => void;
  clearCanvas: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  objects: [],
  selectedIds: [],
  canvasSize: { width: 1080, height: 1080 }, // Default square for instagram etc.

  setCanvasSize: (width, height) => set((state) => {
    const scaleX = width / state.canvasSize.width;
    const scaleY = height / state.canvasSize.height;
    
    const scaledObjects = state.objects.map(obj => {
      // For text, we might want to scale it proportionally by minimum scale so it doesn't squish
      const minScale = Math.min(scaleX, scaleY);
      
      let scaledObj = { ...obj };
      
      // Scale position relative to center or just multiplier? Let's use simple multiplier
      scaledObj.x = obj.x * scaleX;
      scaledObj.y = obj.y * scaleY;
      
      if (obj.type === 'shape' || obj.type === 'image') {
        scaledObj.width = (obj.width || 0) * scaleX;
        scaledObj.height = (obj.height || 0) * scaleY;
      }
      
      if (obj.type === 'text') {
         // Keep text proportion
         scaledObj.fontSize = (obj.fontSize || 20) * minScale;
         // Text bounding box might need width scaled
         if (obj.width) scaledObj.width = obj.width * scaleX;
      }

      return scaledObj;
    });

    return { 
      canvasSize: { width, height },
      objects: scaledObjects
    };
  }),
  
  addObject: (obj) => set((state) => ({
    objects: [...state.objects, { ...obj, id: uuidv4() }]
  })),

  updateObject: (id, attrs) => set((state) => ({
    objects: state.objects.map((obj) => 
      obj.id === id ? { ...obj, ...attrs } : obj
    )
  })),

  deleteObject: (id) => set((state) => ({
    objects: state.objects.filter((obj) => obj.id !== id),
    selectedIds: state.selectedIds.filter((selId) => selId !== id)
  })),

  selectObject: (id, multi = false) => set((state) => {
    if (!id) return { selectedIds: [] };
    if (multi) {
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter(selId => selId !== id) };
      }
      return { selectedIds: [...state.selectedIds, id] };
    }
    return { selectedIds: [id] };
  }),

  clearSelection: () => set({ selectedIds: [] }),

  clearCanvas: () => set({ objects: [], selectedIds: [] })
}));
