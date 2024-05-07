// src/components/canvas/Scene3D.jsx
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Grid from './Grid';

const Scene3D = () => {
  return (
    <>
      <OrbitControls />
      <Grid
        size={10}
        divisions={50}
      />
    </>
  );
};

export default Scene3D;
