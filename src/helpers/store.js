// src/helpers/store.js
import create from 'zustand';

const useStore = create((set) => ({
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
}));

export default useStore;
