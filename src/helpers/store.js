import create from 'zustand'

const useStore = create((set, get) => ({
  viewMode: '2D', // Default to 3D view
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

  walls: [],
  addWall: (wall) =>
    set((state) => ({
      walls: [...state.walls, { ...wall, type: wall.type || 'solid' }],
    })),

  removeWall: (index) =>
    set((state) => ({
      walls: state.walls.filter((_, i) => i !== index),
    })),

  updateWallType: (index, newType) =>
    set((state) => ({
      walls: state.walls.map((wall, i) => (i === index ? { ...wall, type: newType } : wall)),
    })),
}))

export default useStore
