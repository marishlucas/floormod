import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import useStore from '../helpers/store'
import * as THREE from 'three'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const WallPlacer = ({ selectedWallType, dimensions }) => {
  const addWall = useStore((state) => state.addWall)
  const walls = useStore((state) => state.walls)
  const viewMode = useStore((state) => state.viewMode)
  const { raycaster, camera, scene } = useThree()

  const [previewWall, setPreviewWall] = useState(null)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())
  const [rotation, setRotation] = useState(0)

  const cellSize = GRID_SIZE / GRID_DIVISIONS

  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  const snapToCell = useCallback(
    (x, z) => {
      // Calculate the cell indices
      const cellX = Math.floor(x / cellSize)
      const cellZ = Math.floor(z / cellSize)

      // Calculate the center of the cell
      const centerX = (cellX + 0.5) * cellSize
      const centerZ = (cellZ + 0.5) * cellSize

      return new THREE.Vector3(centerX, dimensions.height / 2, centerZ)
    },
    [cellSize, dimensions.height],
  )

  const updateMousePosition = useCallback(
    (event) => {
      if (viewMode === '2D') {
        const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        )

        raycaster.setFromCamera(mouse, camera)
        const intersectionPoint = new THREE.Vector3()
        raycaster.ray.intersectPlane(groundPlane, intersectionPoint)

        setMousePosition(snapToCell(intersectionPoint.x, intersectionPoint.z))
      }
    },
    [camera, raycaster, groundPlane, snapToCell, viewMode],
  )

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [updateMousePosition])

  useFrame(() => {
    if (previewWall) {
      if (viewMode === '2D') {
        previewWall.position.copy(mousePosition)
        previewWall.rotation.y = rotation
        previewWall.scale.set(dimensions.width, dimensions.height, dimensions.thickness)
        previewWall.visible = true
      } else {
        previewWall.visible = false
      }
    }
  })

  const onPointerDown = useCallback(
    (event) => {
      if (viewMode === '2D') {
        if (event.button === 0) {
          // Left mouse button
          const newWall = {
            x: mousePosition.x,
            y: mousePosition.y,
            z: mousePosition.z,
            type: selectedWallType,
            rotation: rotation,
            dimensions: dimensions,
          }

          // Check for collisions
          const collision = walls.some(
            (wall) => Math.abs(wall.x - newWall.x) < cellSize && Math.abs(wall.z - newWall.z) < cellSize,
          )

          if (!collision) {
            addWall(newWall)
          }
        } else if (event.button === 2) {
          // Right mouse button
          setRotation((prevRotation) => (prevRotation + Math.PI / 2) % (2 * Math.PI))
        }
      }
    },
    [addWall, mousePosition, selectedWallType, rotation, walls, cellSize, dimensions, viewMode],
  )

  useEffect(() => {
    const preview = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true }),
    )
    setPreviewWall(preview)
    scene.add(preview)

    return () => {
      scene.remove(preview)
    }
  }, [scene])

  return (
    <>
      <mesh onPointerDown={onPointerDown} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial color='transparent' visible={false} />
      </mesh>
      {walls.map((wall, index) => (
        <Box
          key={index}
          position={[wall.x, wall.y, wall.z]}
          rotation={[0, wall.rotation, 0]}
          args={[wall.dimensions.width, wall.dimensions.height, wall.dimensions.thickness]}
        >
          <meshStandardMaterial
            color={viewMode === '3D' ? 'white' : 'blue'}
            opacity={wall.type === 'window' ? 0.5 : 1}
            transparent={wall.type === 'window'}
          />
        </Box>
      ))}
    </>
  )
}

export default WallPlacer
