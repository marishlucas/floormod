import create from 'zustand'

const useStore = create((set, get) => ({
  viewMode: '2D',
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

  wallDimensions: {
    height: 2.5,
    width: 0.2,
  },

  setWallDimensions: (dimensions) =>
    set((state) => ({
      wallDimensions: { ...state.wallDimensions, ...dimensions },
    })),

  rooms: [],
  addRoom: (room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),

  removeRoom: (index) =>
    set((state) => ({
      rooms: state.rooms.filter((_, i) => i !== index),
    })),

  updateRoom: (index, newRoom) =>
    set((state) => ({
      rooms: state.rooms.map((room, i) => (i === index ? { ...room, ...newRoom } : room)),
    })),

  snapPoint: (point, snapDistance = 0.1) => {
    const rooms = get().rooms
    for (let room of rooms) {
      for (let wall of room.walls) {
        if (point.distanceTo(wall.start) < snapDistance) return wall.start
        if (point.distanceTo(wall.end) < snapDistance) return wall.end
      }
    }
    return point
  },
}))

export default useStore
