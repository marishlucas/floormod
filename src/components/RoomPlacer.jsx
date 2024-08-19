import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Box, Html } from '@react-three/drei'
import useStore from '../helpers/store'
import * as THREE from 'three'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const RoomPlacer = ({ selectedRoomType, selectedRoomSize, mode }) => {
  const { addRoom, removeRoom, rooms, wallDimensions } = useStore()
  const viewMode = useStore((state) => state.viewMode)
  const { raycaster, camera, scene, gl } = useThree()

  const [previewRoom, setPreviewRoom] = useState(null)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2())
  const [rotation, setRotation] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const cellSize = GRID_SIZE / GRID_DIVISIONS
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  const snapToGrid = useCallback(
    (value) => {
      return Math.round(value / cellSize) * cellSize
    },
    [cellSize],
  )

  const getRoomWalls = useCallback(
    (type, size, position, rotation) => {
      const baseSize = { small: 4, medium: 6, large: 10 }
      const width = baseSize[size]

      const snappedPosition = new THREE.Vector2(snapToGrid(position.x), snapToGrid(position.y))

      // Calculate the offset to center the room
      const offsetX = (-width * cellSize) / 2
      const offsetY = (-width * cellSize) / 2

      const padding = wallDimensions.width / 2

      let walls = []
      switch (type) {
        case 'square':
          walls = [
            {
              start: new THREE.Vector2(offsetX - padding, offsetY),
              end: new THREE.Vector2(offsetX + width * cellSize + padding, offsetY),
            },
            {
              start: new THREE.Vector2(offsetX + width * cellSize, offsetY - padding),
              end: new THREE.Vector2(offsetX + width * cellSize, offsetY + width * cellSize + padding),
            },
            {
              start: new THREE.Vector2(offsetX + width * cellSize + padding, offsetY + width * cellSize),
              end: new THREE.Vector2(offsetX - padding, offsetY + width * cellSize),
            },
            {
              start: new THREE.Vector2(offsetX, offsetY + width * cellSize + padding),
              end: new THREE.Vector2(offsetX, offsetY - padding),
            },
          ]
          break
        case 'rectangle':
          walls = [
            {
              start: new THREE.Vector2(offsetX - padding, offsetY),
              end: new THREE.Vector2(offsetX + width * 1.5 * cellSize + padding, offsetY),
            },
            {
              start: new THREE.Vector2(offsetX + width * 1.5 * cellSize, offsetY - padding),
              end: new THREE.Vector2(offsetX + width * 1.5 * cellSize, offsetY + width * cellSize + padding),
            },
            {
              start: new THREE.Vector2(offsetX + width * 1.5 * cellSize + padding, offsetY + width * cellSize),
              end: new THREE.Vector2(offsetX - padding, offsetY + width * cellSize),
            },
            {
              start: new THREE.Vector2(offsetX, offsetY + width * cellSize + padding),
              end: new THREE.Vector2(offsetX, offsetY - padding),
            },
          ]
          break
        case 'L-shape':
          walls = [
            {
              start: new THREE.Vector2(offsetX - padding, offsetY),
              end: new THREE.Vector2(offsetX + width * cellSize + padding, offsetY),
            },
            {
              start: new THREE.Vector2(offsetX + width * cellSize, offsetY - padding),
              end: new THREE.Vector2(offsetX + width * cellSize, offsetY + (width * cellSize) / 2 + padding),
            },
            {
              start: new THREE.Vector2(offsetX + width * cellSize + padding, offsetY + (width * cellSize) / 2),
              end: new THREE.Vector2(offsetX + (width * cellSize) / 2 - padding, offsetY + (width * cellSize) / 2),
            },
            {
              start: new THREE.Vector2(offsetX + (width * cellSize) / 2, offsetY + (width * cellSize) / 2 - padding),
              end: new THREE.Vector2(offsetX + (width * cellSize) / 2, offsetY + width * cellSize + padding),
            },
            {
              start: new THREE.Vector2(offsetX + (width * cellSize) / 2 + padding, offsetY + width * cellSize),
              end: new THREE.Vector2(offsetX - padding, offsetY + width * cellSize),
            },
            {
              start: new THREE.Vector2(offsetX, offsetY + width * cellSize + padding),
              end: new THREE.Vector2(offsetX, offsetY - padding),
            },
          ]
          break
      }

      // Apply rotation and position
      const rotatePoint = (point) => {
        const x = point.x * Math.cos(rotation) - point.y * Math.sin(rotation)
        const y = point.x * Math.sin(rotation) + point.y * Math.cos(rotation)
        return new THREE.Vector2(x, y).add(snappedPosition)
      }

      walls = walls.map((wall) => ({
        start: rotatePoint(wall.start),
        end: rotatePoint(wall.end),
      }))

      return walls
    },
    [cellSize, snapToGrid, wallDimensions.width],
  )

  const updateMousePosition = useCallback(
    (event) => {
      const canvas = gl.domElement
      const rect = canvas.getBoundingClientRect()

      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )

      raycaster.setFromCamera(mouse, camera)
      const intersectionPoint = new THREE.Vector3()
      const intersect = raycaster.ray.intersectPlane(groundPlane, intersectionPoint)

      if (intersect) {
        setMousePosition(new THREE.Vector2(snapToGrid(intersectionPoint.x), snapToGrid(intersectionPoint.z)))
      }
    },
    [camera, raycaster, groundPlane, gl, snapToGrid],
  )

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [updateMousePosition])

  useEffect(() => {
    if (previewRoom) {
      scene.remove(previewRoom)
    }
    const newPreview = new THREE.Group()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true })

    const walls = getRoomWalls(selectedRoomType, selectedRoomSize, mousePosition, rotation)
    walls.forEach((wall) => {
      const wallMesh = new THREE.Mesh(
        new THREE.BoxGeometry(wall.start.distanceTo(wall.end), wallDimensions.height, wallDimensions.width),
        material,
      )
      wallMesh.position.set((wall.start.x + wall.end.x) / 2, wallDimensions.height / 2, (wall.start.y + wall.end.y) / 2)
      wallMesh.rotation.y = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x)
      newPreview.add(wallMesh)
    })

    setPreviewRoom(newPreview)
    scene.add(newPreview)

    return () => {
      scene.remove(newPreview)
    }
  }, [scene, selectedRoomType, selectedRoomSize, mousePosition, rotation, getRoomWalls, wallDimensions])

  useFrame(() => {
    if (!previewRoom) return
    if (mode === 'placement') {
      previewRoom.visible = true
    } else {
      previewRoom.visible = false
    }
  })

  const handlePlacement = useCallback(
    (event) => {
      if (event.button === 0) {
        const newRoom = {
          type: selectedRoomType,
          size: selectedRoomSize,
          position: mousePosition,
          rotation,
          walls: getRoomWalls(selectedRoomType, selectedRoomSize, mousePosition, rotation),
        }
        addRoom(newRoom)
      } else if (event.button === 2) {
        setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (2 * Math.PI))
      }
    },
    [addRoom, mousePosition, selectedRoomType, selectedRoomSize, rotation, getRoomWalls],
  )

  const handleModification = useCallback(
    (event) => {
      if (event.button !== 0) return
      const intersects = raycaster.intersectObjects(scene.children, true)
      const clickedRoom = intersects.find((intersect) => intersect.object.userData.isRoom)
      setSelectedRoom(clickedRoom ? clickedRoom.object.userData.roomIndex : null)
    },
    [raycaster, scene.children],
  )

  const onPointerDown = useCallback((event) => {
    setIsDragging(false)
    setDragStart({ x: event.clientX, y: event.clientY })
  }, [])

  const onPointerUp = useCallback(
    (event) => {
      if (!isDragging) {
        if (mode === 'placement') {
          handlePlacement(event)
        } else {
          handleModification(event)
        }
      }
      setIsDragging(false)
    },
    [mode, isDragging, handlePlacement, handleModification],
  )

  const onPointerMove = useCallback(
    (event) => {
      if (event.buttons !== 0) {
        const dx = event.clientX - dragStart.x
        const dy = event.clientY - dragStart.y
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          setIsDragging(true)
        }
      }
    },
    [dragStart],
  )

  const handleDeleteRoom = useCallback(() => {
    if (selectedRoom !== null) {
      removeRoom(selectedRoom)
      setSelectedRoom(null)
    }
  }, [removeRoom, selectedRoom])

  return (
    <>
      <mesh
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial color='transparent' visible={false} />
      </mesh>
      {rooms.map((room, roomIndex) => (
        <group key={roomIndex}>
          {room.walls.map((wall, wallIndex) => {
            const isSelected = mode === 'modification' && selectedRoom === roomIndex
            const heightAdjustment = isSelected ? 0.01 : 0 // Raise selected room slightly
            const sizeMultiplier = isSelected ? 1.01 : 1 // Increase size of selected room slightly

            return (
              <Box
                key={`${roomIndex}-${wallIndex}`}
                position={[
                  (wall.start.x + wall.end.x) / 2,
                  wallDimensions.height / 2 + heightAdjustment,
                  (wall.start.y + wall.end.y) / 2,
                ]}
                args={[
                  wall.start.distanceTo(wall.end) * sizeMultiplier,
                  wallDimensions.height * sizeMultiplier,
                  wallDimensions.width * sizeMultiplier,
                ]}
                rotation={[0, Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x), 0]}
                userData={{ isRoom: true, roomIndex }}
              >
                <meshStandardMaterial
                  color={isSelected ? 'green' : viewMode === '3D' ? 'lightblue' : 'blue'}
                  transparent={isSelected}
                  opacity={isSelected ? 0.7 : 1}
                />
              </Box>
            )
          })}
        </group>
      ))}
      {selectedRoom !== null && mode === 'modification' && (
        <Html position={[rooms[selectedRoom].position.x, wallDimensions.height, rooms[selectedRoom].position.y]}>
          <button onClick={handleDeleteRoom} className='btn btn-error btn-sm'>
            Delete Room
          </button>
        </Html>
      )}
    </>
  )
}

export default RoomPlacer
