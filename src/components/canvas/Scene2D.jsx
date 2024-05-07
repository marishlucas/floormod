// src/components/canvas/Scene2D.jsx
import { MapControls, OrthographicCamera } from '@react-three/drei';
import Grid from './Grid';

const Scene2D = () => {
  return (
    <>
      <MapControls />
      <Grid
        size={10}
        divisions={50}
      />
    </>
  );
};

export default Scene2D;
