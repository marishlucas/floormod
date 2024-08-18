import React from 'react'

const RoomMenu = ({ onSelectRoomType, onSelectRoomSize }) => {
  return (
    <div className='fixed left-4 top-20 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Room Type</h2>
      <div className='mb-4'>
        <button className='btn btn-primary btn-sm mr-2' onClick={() => onSelectRoomType('square')}>
          Square
        </button>
        <button className='btn btn-secondary btn-sm mr-2' onClick={() => onSelectRoomType('rectangle')}>
          Rectangle
        </button>
        <button className='btn btn-accent btn-sm' onClick={() => onSelectRoomType('L-shape')}>
          L-shape
        </button>
      </div>
      <h2 className='mb-2 text-lg font-bold'>Room Size</h2>
      <div>
        <button className='btn btn-info btn-sm mr-2' onClick={() => onSelectRoomSize('small')}>
          Small
        </button>
        <button className='btn btn-success btn-sm mr-2' onClick={() => onSelectRoomSize('medium')}>
          Medium
        </button>
        <button className='btn btn-warning btn-sm' onClick={() => onSelectRoomSize('large')}>
          Large
        </button>
      </div>
    </div>
  )
}

export default RoomMenu
