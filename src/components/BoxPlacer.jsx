import React, { useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useStore from '../helpers/store';
import * as THREE from 'three';

const BoxPlacer = () => {
  const addBox = useStore((state) => state.addBox);
  const boxes = useStore((state) => state.boxes);
  const viewMode = useStore((state) => state.viewMode);
  const { raycaster, camera } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((event) => {
    setIsDragging(false); // Reset dragging state on mouse down
    setDragStart({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const onMouseMove = useCallback(
    (event) => {
      // Determine if the mouse has moved significantly
      if (
        Math.abs(dragStart.x - event.clientX) > 5 ||
        Math.abs(dragStart.y - event.clientY) > 5
      ) {
        setIsDragging(true);
      }
    },
    [dragStart],
  );

  const onMouseUp = useCallback(
    (event) => {
      if (!isDragging) {
        const pointer = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        raycaster.setFromCamera(pointer, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersect = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, intersect)) {
          addBox({
            x: Math.round(intersect.x),
            y: 0.5,
            z: Math.round(intersect.z),
          });
        }
      }
      setIsDragging(false); // Reset dragging state after mouse up
    },
    [isDragging, addBox, raycaster, camera],
  );

  return (
    <>
      <mesh
        onPointerDown={onMouseDown}
        onPointerMove={onMouseMove}
        onPointerUp={onMouseUp}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          attach='geometry'
          args={[120, 120]}
        />
        <meshBasicMaterial
          attach='material'
          color='transparent'
          visible={false}
        />
      </mesh>
      {boxes.map((box, index) => (
        <Box
          key={index}
          position={[box.x, box.y, box.z]}
        >
          <meshStandardMaterial
            attach='material'
            color={viewMode == '3D' ? 'white' : 'blue'}
          />
        </Box>
      ))}
    </>
  );
};

export default BoxPlacer;
