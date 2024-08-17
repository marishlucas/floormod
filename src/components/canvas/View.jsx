'use client';

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react';
import { View as ViewImpl } from '@react-three/drei';

import { Three } from '@/helpers/components/Three';
import useStore from '@/helpers/store';
import Camera from './Camera';

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    {color && (
      <color
        attach='background'
        args={[color]}
      />
    )}
    <ambientLight />
    <pointLight
      position={[20, 30, 10]}
      intensity={20}
      decay={0.1}
    />
    <pointLight
      position={[-10, -10, -10]}
      color='red'
      decay={0.5}
    />
  </Suspense>
);

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null);
  useImperativeHandle(ref, () => localRef.current);

  return (
    <>
      <div
        ref={localRef}
        {...props}
      />
      <Three>
        <ViewImpl track={localRef}>
          <Camera />
          {children}
        </ViewImpl>
      </Three>
    </>
  );
});
View.displayName = 'View';

export { View };
