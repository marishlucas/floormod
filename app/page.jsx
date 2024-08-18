'use client'
import { useState } from 'react'
import RoomPlacer from '@/components/RoomPlacer'
import RoomMenu from '@/components/RoomMenu'
import Scene2D from '@/components/canvas/Scene2D'
import Scene3D from '@/components/canvas/Scene3D'
import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import WallDimensionsMenu from '@/components/WallDimensionsMenu'

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
  const [selectedRoomType, setSelectedRoomType] = useState('square')
  const [selectedRoomSize, setSelectedRoomSize] = useState('medium')
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

      {/* Side menu */}
      <RoomMenu onSelectRoomType={setSelectedRoomType} onSelectRoomSize={setSelectedRoomSize} />
      <WallDimensionsMenu />

      {/* Canvas */}
      <View orbit className='size-full'>
        {viewMode === '2D' ? <Scene2D /> : <Scene3D />}
        <RoomPlacer selectedRoomType={selectedRoomType} selectedRoomSize={selectedRoomSize} mode={mode} />
        <Suspense fallback={null}>
          <Common />
        </Suspense>
      </View>
    </div>
  )
}
