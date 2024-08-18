'use client'
import { useState } from 'react'
import WallPlacer from '@/components/WallPlacer'
import WallMenu from '@/components/WallMenu'
import WallDimensionsMenu from '@/components/WallDimensionsMenu'
import Scene2D from '@/components/canvas/Scene2D'
import Scene3D from '@/components/canvas/Scene3D'
import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  ),
})

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { setViewMode } = useStore()
  const viewMode = useStore((state) => state.viewMode)
  const [selectedWallType, setSelectedWallType] = useState('solid')
  const [dimensions, setDimensions] = useState({ width: 1, height: 2, thickness: 0.2 })
  const [mode, setMode] = useState('placement')

  return (
    <div className='relative h-screen w-full overflow-hidden bg-base-200'>
      {/* Top navigation bar */}
      <div className='absolute inset-x-0 top-0 z-50 bg-base-100 p-4 shadow-md'>
        <div className='flex items-center justify-between'>
          <div>
            <button className='btn btn-primary btn-sm mr-2' onClick={() => setViewMode('2D')}>
              2D View
            </button>
            <button className='btn btn-secondary btn-sm' onClick={() => setViewMode('3D')}>
              3D View
            </button>
          </div>
          <div>
            <button className='btn btn-accent btn-sm mr-2' onClick={() => setMode('placement')}>
              Placement Mode
            </button>
            <button className='btn btn-info btn-sm' onClick={() => setMode('modification')}>
              Modification Mode
            </button>
          </div>
        </div>
      </div>

      {/* Side menus */}
      <WallMenu onSelectWallType={setSelectedWallType} />
      <WallDimensionsMenu dimensions={dimensions} setDimensions={setDimensions} />

      {/* Canvas */}
      <View orbit className='size-full'>
        {viewMode === '2D' ? <Scene2D /> : <Scene3D />}
        <WallPlacer selectedWallType={selectedWallType} dimensions={dimensions} mode={mode} />
        <Suspense fallback={null}>
          <Common />
        </Suspense>
      </View>
    </div>
  )
}
