import React from 'react'

const WallMenu = ({ onSelectWallType }) => {
  return (
    <div className='fixed left-4 top-20 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Wall Type</h2>
      <button className='btn btn-primary btn-sm mr-2' onClick={() => onSelectWallType('solid')}>
        Solid Wall
      </button>
      <button className='btn btn-secondary btn-sm' onClick={() => onSelectWallType('window')}>
        Wall with Window
      </button>
    </div>
  )
}

export default WallMenu
