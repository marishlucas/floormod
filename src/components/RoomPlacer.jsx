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

  const getRoomWalls = useCallback(
    (type, size, position, rotation, wallWidth) => {
      const baseSize = { small: 2, medium: 3, large: 4 }
      const width = baseSize[size] * cellSize

      // Snap to grid
      const snapToGrid = (value) => {
        return Math.round(value / cellSize) * cellSize
      }

      const snappedPosition = new THREE.Vector2(snapToGrid(position.x), snapToGrid(position.y))

      // Function to extend wall endpoints
      const extendWall = (start, end) => {
        const direction = end.clone().sub(start).normalize()
        const halfWallWidth = wallWidth / 2
        return {
          start: start.clone().sub(direction.multiplyScalar(halfWallWidth)),
          end: end.clone().add(direction.multiplyScalar(halfWallWidth)),
        }
      }

      let walls = []
      switch (type) {
        case 'square':
          walls = [
            { start: new THREE.Vector2(-width / 2, -width / 2), end: new THREE.Vector2(width / 2, -width / 2) },
            { start: new THREE.Vector2(width / 2, -width / 2), end: new THREE.Vector2(width / 2, width / 2) },
            { start: new THREE.Vector2(width / 2, width / 2), end: new THREE.Vector2(-width / 2, width / 2) },
            { start: new THREE.Vector2(-width / 2, width / 2), end: new THREE.Vector2(-width / 2, -width / 2) },
          ]
          break
        case 'rectangle':
          const rectWidth = width * 1.5
          const rectHeight = width
          walls = [
            {
              start: new THREE.Vector2(-rectWidth / 2, -rectHeight / 2),
              end: new THREE.Vector2(rectWidth / 2, -rectHeight / 2),
            },
            {
              start: new THREE.Vector2(rectWidth / 2, -rectHeight / 2),
              end: new THREE.Vector2(rectWidth / 2, rectHeight / 2),
            },
            {
              start: new THREE.Vector2(rectWidth / 2, rectHeight / 2),
              end: new THREE.Vector2(-rectWidth / 2, rectHeight / 2),
            },
            {
              start: new THREE.Vector2(-rectWidth / 2, rectHeight / 2),
              end: new THREE.Vector2(-rectWidth / 2, -rectHeight / 2),
            },
          ]
          break
        case 'L-shape':
          walls = [
            { start: new THREE.Vector2(-width / 2, -width / 2), end: new THREE.Vector2(width / 2, -width / 2) },
            { start: new THREE.Vector2(width / 2, -width / 2), end: new THREE.Vector2(width / 2, 0) },
            { start: new THREE.Vector2(width / 2, 0), end: new THREE.Vector2(0, 0) },
            { start: new THREE.Vector2(0, 0), end: new THREE.Vector2(0, width / 2) },
            { start: new THREE.Vector2(0, width / 2), end: new THREE.Vector2(-width / 2, width / 2) },
            { start: new THREE.Vector2(-width / 2, width / 2), end: new THREE.Vector2(-width / 2, -width / 2) },
          ]
          break
      }

      // Extend walls
      walls = walls.map((wall) => extendWall(wall.start, wall.end))

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
    [cellSize],
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
        setMousePosition(new THREE.Vector2(intersectionPoint.x, intersectionPoint.z))
      }
    },
    [camera, raycaster, groundPlane, gl],
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

    const walls = getRoomWalls(selectedRoomType, selectedRoomSize, mousePosition, rotation, wallDimensions.width)
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
          walls: getRoomWalls(selectedRoomType, selectedRoomSize, mousePosition, rotation, wallDimensions.width),
        }
        addRoom(newRoom)
      } else if (event.button === 2) {
        setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (2 * Math.PI))
      }
    },
    [addRoom, mousePosition, selectedRoomType, selectedRoomSize, rotation, getRoomWalls, wallDimensions.width],
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
          {room.walls.map((wall, wallIndex) => (
            <Box
              key={`${roomIndex}-${wallIndex}`}
              position={[(wall.start.x + wall.end.x) / 2, wallDimensions.height / 2, (wall.start.y + wall.end.y) / 2]}
              args={[wall.start.distanceTo(wall.end), wallDimensions.height, wallDimensions.width]}
              rotation={[0, Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x), 0]}
              userData={{ isRoom: true, roomIndex }}
            >
              <meshStandardMaterial color={viewMode === '3D' ? 'lightblue' : 'blue'} />
            </Box>
          ))}
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
