// components/canvas/Grid.jsx
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Grid = ({ size = 10, divisions = 10 }) => {
  const { scene } = useThree();

  const gridHelper = new THREE.GridHelper(
    size,
    divisions,
    '#aaaaaa',
    '#cccccc',
  );
  scene.add(gridHelper);

  return null;
};

export default Grid;
