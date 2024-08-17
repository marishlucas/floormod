import create from 'zustand'

const useStore = create((set, get) => ({
  viewMode: '3D', // Default to 3D view
  cameraSettings: {
    '3D': { position: [0, 5, 10], fov: 50 },
    '2D': { position: [0, 100, 0], zoom: 100 },
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  setCameraSettings: (mode, settings) =>
    set((state) => ({
      cameraSettings: {
        ...state.cameraSettings,
        [mode]: { ...state.cameraSettings[mode], ...settings },
      },
    })),

  walls: [], // Array to store walls in the scene

  addWall: (wall) => set((state) => ({ walls: [...state.walls, wall] })),
  removeWall: (index) =>
    set((state) => ({
      walls: state.walls.filter((_, i) => i !== index),
    })),
}))

export default useStore
