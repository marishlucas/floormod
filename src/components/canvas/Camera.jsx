import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import useStore from '@/helpers/store';

export default function CameraComponent() {
  const perspectiveCam = useRef(null);
  const orthoCam = useRef(null);
  const { set } = useThree();
  const { viewMode, cameraSettings, setCameraSettings } = useStore();

  useEffect(() => {
    const currentCamera =
      viewMode === '2D' ? orthoCam.current : perspectiveCam.current;

    const updateSettings = () => {
      const { position, rotation } = currentCamera;
      setCameraSettings(viewMode, {
        position: position.toArray(),
        rotation: rotation.toArray(),
      });
    };

    // Register and unregister update settings on camera movement or other changes
    currentCamera.addEventListener('change', updateSettings);
    set({ camera: currentCamera });

    return () => {
      currentCamera.removeEventListener('change', updateSettings);
    };
  }, [viewMode, set, setCameraSettings]);

  return (
    <>
      <PerspectiveCamera
        ref={perspectiveCam}
        makeDefault={viewMode === '3D'}
        position={cameraSettings['3D'].position}
        fov={cameraSettings['3D'].fov}
      />
      <OrthographicCamera
        ref={orthoCam}
        makeDefault={viewMode === '2D'}
        position={cameraSettings['2D'].position}
        zoom={cameraSettings['2D'].zoom}
        left={window.innerWidth / -2}
        right={window.innerWidth / 2}
        top={window.innerHeight / 2}
        bottom={window.innerHeight / -2}
        onUpdate={(s) => s.updateProjectionMatrix()}
      />
    </>
  );
}
