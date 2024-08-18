import React, { useState } from 'react'

const RoomMenu = ({ roomType, roomSize, onSelectRoomType, onSelectRoomSize }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='fixed left-4 bottom-4 z-40 lg:top-20 lg:bottom-auto'>
      <button className='btn btn-primary mb-2 lg:hidden' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className={`rounded-lg bg-base-100 p-4 shadow-lg ${isOpen ? 'block' : 'hidden'} lg:block`}>
        <h2 className='mb-2 text-lg font-bold'>Room Type</h2>
        <div className='mb-4 flex flex-wrap gap-2'>
          <button
            className={`btn btn-sm ${roomType === 'square' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomType('square')}
          >
            Square
          </button>
          <button
            className={`btn btn-sm ${roomType === 'rectangle' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomType('rectangle')}
          >
            Rectangle
          </button>
          <button
            className={`btn btn-sm ${roomType === 'L-shape' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomType('L-shape')}
          >
            L-shape
          </button>
        </div>
        <h2 className='mb-2 text-lg font-bold'>Room Size</h2>
        <div className='flex flex-wrap gap-2'>
          <button
            className={`btn btn-sm ${roomSize === 'small' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomSize('small')}
          >
            2x2 Grid
          </button>
          <button
            className={`btn btn-sm ${roomSize === 'medium' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomSize('medium')}
          >
            3x3 Grid
          </button>
          <button
            className={`btn btn-sm ${roomSize === 'large' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectRoomSize('large')}
          >
            4x4 Grid
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomMenu
