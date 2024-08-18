'use client'
import { useState } from 'react'

export default function Navbar({ viewMode, setViewMode, mode, setMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className='absolute inset-x-0 top-0 z-50 bg-base-100 p-4 shadow-md'>
      <div className='flex items-center justify-between'>
        <button className='btn btn-ghost lg:hidden' onClick={toggleMenu}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-5 h-5 stroke-current'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
          </svg>
        </button>
        <div className={`flex-col items-start ${isMenuOpen ? 'flex' : 'hidden'} lg:flex lg:flex-row lg:items-center`}>
          <div className='mb-2 lg:mb-0 lg:mr-2'>
            <button
              className={`btn btn-primary ${viewMode === '2D' ? '' : 'btn-outline'} btn-sm mr-2`}
              onClick={() => setViewMode('2D')}
            >
              2D View
            </button>
            <button
              className={`btn btn-primary ${viewMode === '3D' ? '' : 'btn-outline'} btn-sm`}
              onClick={() => setViewMode('3D')}
            >
              3D View
            </button>
          </div>
          <div>
            <button
              className={`btn btn-primary ${mode === 'placement' ? '' : 'btn-outline'} btn-sm mr-2`}
              onClick={() => setMode('placement')}
            >
              Placement
            </button>
            <button
              className={`btn btn-primary ${mode === 'modification' ? '' : 'btn-outline'} btn-sm`}
              onClick={() => setMode('modification')}
            >
              Modification
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
