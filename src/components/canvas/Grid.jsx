// components/canvas/Grid.jsx
import { GRID_DIVISIONS, GRID_SIZE } from '@/constants/gridConfig'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const Grid = () => {
  const { scene } = useThree()

  const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, '#aaaaaa', '#cccccc')
  scene.add(gridHelper)

  return null
}

export default Grid
