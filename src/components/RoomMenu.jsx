import React from 'react'

const RoomMenu = ({ roomType, roomSize, onSelectRoomType, onSelectRoomSize }) => {
  return (
    <div className='fixed left-4 top-20 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Room Type</h2>
      <div className='mb-4'>
        <button
          className={`btn btn-primary ${roomType === 'square' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomType('square')}
        >
          Square
        </button>
        <button
          className={`btn btn-primary ${roomType === 'rectangle' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomType('rectangle')}
        >
          Rectangle
        </button>
        <button
          className={`btn btn-primary ${roomType === 'L-shape' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomType('L-shape')}
        >
          L-shape
        </button>
      </div>
      <h2 className='mb-2 text-lg font-bold'>Room Size</h2>
      <div>
        <button
          className={`btn btn-primary ${roomSize === 'small' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomSize('small')}
        >
          2x2 Grid
        </button>
        <button
          className={`btn btn-primary ${roomSize === 'medium' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomSize('medium')}
        >
          3x3 Grid
        </button>
        <button
          className={`btn btn-primary ${roomSize === 'large' ? '' : 'btn-outline'} btn-sm mr-2`}
          onClick={() => onSelectRoomSize('large')}
        >
          4x4 Grid
        </button>
      </div>
    </div>
  )
}

export default RoomMenu
