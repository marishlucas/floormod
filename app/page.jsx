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
import Navbar from '@/components/Navbar'

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

      <Navbar viewMode={viewMode} setViewMode={setViewMode} mode={mode} setMode={setMode} />
      {/* Side menu */}
      <RoomMenu
        roomType={selectedRoomType}
        roomSize={selectedRoomSize}
        onSelectRoomType={setSelectedRoomType}
        onSelectRoomSize={setSelectedRoomSize}
      />
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
