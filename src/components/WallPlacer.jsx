import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import useStore from '../helpers/store'
import * as THREE from 'three'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const WallPlacer = ({ mode }) => {
  const { addWall, removeWall, walls, snapPoint } = useStore()
  const viewMode = useStore((state) => state.viewMode)
  const { raycaster, camera, scene, gl } = useThree()

  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2())
  const [selectedWall, setSelectedWall] = useState(null)

  const cellSize = GRID_SIZE / GRID_DIVISIONS
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  const snapToGrid = useCallback(
    (point) => {
      const x = Math.round(point.x / cellSize) * cellSize
      const z = Math.round(point.y / cellSize) * cellSize
      return new THREE.Vector2(x, z)
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
        const snappedPoint = snapToGrid(new THREE.Vector2(intersectionPoint.x, intersectionPoint.z))
        setMousePosition(snapPoint(snappedPoint))
      }
    },
    [camera, raycaster, groundPlane, snapToGrid, gl, snapPoint],
  )

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [updateMousePosition])

  const handlePlacement = useCallback(
    (event) => {
      if (event.button === 0) {
        if (!startPoint) {
          setStartPoint(mousePosition.clone())
        } else {
          addWall(startPoint, mousePosition)
          setStartPoint(null)
          setEndPoint(null)
        }
      }
    },
    [addWall, mousePosition, startPoint],
  )

  const handleModification = useCallback(
    (event) => {
      if (event.button !== 0) return
      const clickedWall = walls.findIndex((wall) => {
        const line = new THREE.Line3(
          new THREE.Vector3(wall.start.x, 0, wall.start.y),
          new THREE.Vector3(wall.end.x, 0, wall.end.y),
        )
        const closestPoint = new THREE.Vector3()
        line.closestPointToPoint(new THREE.Vector3(mousePosition.x, 0, mousePosition.y), true, closestPoint)
        return closestPoint.distanceTo(new THREE.Vector3(mousePosition.x, 0, mousePosition.y)) < 0.5
      })
      setSelectedWall(clickedWall !== -1 ? clickedWall : null)
    },
    [walls, mousePosition],
  )

  const onPointerDown = useCallback(
    (event) => {
      if (mode === 'placement') {
        handlePlacement(event)
      } else {
        handleModification(event)
      }
    },
    [mode, handlePlacement, handleModification],
  )

  const handleDeleteWall = useCallback(() => {
    if (selectedWall !== null) {
      removeWall(selectedWall)
      setSelectedWall(null)
    }
  }, [removeWall, selectedWall])

  useFrame(() => {
    if (startPoint && mode === 'placement') {
      setEndPoint(mousePosition)
    }
  })

  return (
    <>
      <mesh onPointerDown={onPointerDown} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial color='transparent' visible={false} />
      </mesh>
      {walls.map((wall, index) => (
        <Line
          key={index}
          points={[
            [wall.start.x, 0, wall.start.y],
            [wall.end.x, 0, wall.end.y],
          ]}
          color={viewMode === '3D' ? 'red' : 'blue'}
          lineWidth={5}
        />
      ))}
      {startPoint && endPoint && (
        <Line
          points={[
            [startPoint.x, 0, startPoint.y],
            [endPoint.x, 0, endPoint.y],
          ]}
          color='green'
          lineWidth={5}
        />
      )}
      {selectedWall !== null && mode === 'modification' && (
        <Html position={[walls[selectedWall].start.x, 1, walls[selectedWall].start.y]}>
          <button onClick={handleDeleteWall} className='btn btn-error btn-sm'>
            Delete Wall
          </button>
        </Html>
      )}
    </>
  )
}

export default WallPlacer
