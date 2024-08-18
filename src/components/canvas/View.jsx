import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { View as ViewImpl } from '@react-three/drei'
import { Environment, Stars } from '@react-three/drei'

import { Three } from '@/helpers/components/Three'
import useStore from '@/helpers/store'
import Camera from './Camera'

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}

    {/* Enhanced lighting */}
    <ambientLight intensity={0.5} />
    <directionalLight
      position={[10, 10, 5]}
      intensity={1}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
    <pointLight position={[-10, -10, -10]} intensity={0.5} />

    {/* Environment and atmosphere */}
    <Environment preset='sunset' />
    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
  </Suspense>
)

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          <Camera />
          {children}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
