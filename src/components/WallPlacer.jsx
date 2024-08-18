import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Box, Html, Line, Text } from '@react-three/drei'
import useStore from '../helpers/store'
import * as THREE from 'three'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const WallPlacer = ({ selectedWallType, dimensions, mode }) => {
  const { addWall, removeWall, walls } = useStore()
  const viewMode = useStore((state) => state.viewMode)
  const { raycaster, camera, scene, gl } = useThree()

  const [previewWall, setPreviewWall] = useState(null)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())
  const [rotation, setRotation] = useState(0)
  const [selectedWall, setSelectedWall] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const cellSize = GRID_SIZE / GRID_DIVISIONS
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  const snapToCell = useCallback(
    (x, z) => {
      const cellX = Math.floor(x / cellSize)
      const cellZ = Math.floor(z / cellSize)
      const centerX = (cellX + 0.5) * cellSize
      const centerZ = (cellZ + 0.5) * cellSize
      return new THREE.Vector3(centerX, dimensions.height / 2, centerZ)
    },
    [cellSize, dimensions.height],
  )

  const updateMousePosition = useCallback(
    (event) => {
      if (viewMode !== '2D') return

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
        setMousePosition(snapToCell(intersectionPoint.x, intersectionPoint.z))
      }
    },
    [camera, raycaster, groundPlane, snapToCell, viewMode, gl],
  )

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [updateMousePosition])

  useEffect(() => {
    if (previewWall) {
      previewWall.visible = false
    }
  }, [mode, previewWall])

  useFrame(() => {
    if (!previewWall) return
    if (mode === 'placement' && viewMode === '2D') {
      previewWall.position.copy(mousePosition)
      previewWall.rotation.y = rotation
      previewWall.scale.set(dimensions.width, dimensions.height, dimensions.thickness)
      previewWall.visible = true
    } else {
      previewWall.visible = false
    }
  })

  const handlePlacement = useCallback(
    (event) => {
      if (event.button === 0) {
        const newWall = {
          x: mousePosition.x,
          y: mousePosition.y,
          z: mousePosition.z,
          type: selectedWallType,
          rotation,
          dimensions,
        }
        const collision = walls.some(
          (wall) => Math.abs(wall.x - newWall.x) < cellSize && Math.abs(wall.z - newWall.z) < cellSize,
        )
        if (!collision) addWall(newWall)
      } else if (event.button === 2) {
        setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (2 * Math.PI))
      }
    },
    [addWall, mousePosition, selectedWallType, rotation, walls, cellSize, dimensions],
  )

  const handleModification = useCallback(
    (event) => {
      if (event.button !== 0) return
      const intersects = raycaster.intersectObjects(scene.children, true)
      const clickedWall = intersects.find((intersect) => intersect.object.userData.isWall)
      setSelectedWall(clickedWall ? clickedWall.object.userData.wallIndex : null)
    },
    [raycaster, scene.children],
  )

  const onPointerDown = useCallback(
    (event) => {
      if (viewMode !== '2D') return
      setIsDragging(false)
      setDragStart({ x: event.clientX, y: event.clientY })
    },
    [viewMode],
  )

  const onPointerUp = useCallback(
    (event) => {
      if (viewMode !== '2D') return
      if (!isDragging) {
        if (mode === 'placement') {
          handlePlacement(event)
        } else {
          handleModification(event)
        }
      }
      setIsDragging(false)
    },
    [viewMode, mode, isDragging, handlePlacement, handleModification],
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

  useEffect(() => {
    const preview = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true }),
    )
    setPreviewWall(preview)
    scene.add(preview)
    return () => scene.remove(preview)
  }, [scene])

  const handleDeleteWall = useCallback(() => {
    if (selectedWall !== null) {
      removeWall(selectedWall)
      setSelectedWall(null)
    }
  }, [removeWall, selectedWall])

  const Wall = useCallback(
    ({ wall, index }) => {
      return (
        <group key={index}>
          <Box
            position={[wall.x, wall.y, wall.z]}
            rotation={[0, wall.rotation, 0]}
            args={[wall.dimensions.width, wall.dimensions.height, wall.dimensions.thickness]}
            userData={{ isWall: true, wallIndex: index }}
          >
            <meshStandardMaterial
              color={viewMode === '3D' ? 'red' : 'blue'}
              opacity={wall.type === 'window' ? 0.5 : 1}
              transparent={wall.type === 'window'}
            />
          </Box>
          {mode === 'modification' && selectedWall === index && (
            <Html position={[wall.x, wall.y + wall.dimensions.height / 2, wall.z]}>
              <button onClick={handleDeleteWall} className='btn btn-error btn-sm'>
                Delete
              </button>
            </Html>
          )}
        </group>
      )
    },
    [viewMode, mode, selectedWall, handleDeleteWall],
  )

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
      {walls.map((wall, index) => (
        <Wall key={index} wall={wall} index={index} />
      ))}
    </>
  )
}

export default WallPlacer
