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

  setCanvasSize: (width, height) => set({ canvasSize: { width, height } }),
  
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
