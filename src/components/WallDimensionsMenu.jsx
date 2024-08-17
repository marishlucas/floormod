import React from 'react'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const WallDimensionsMenu = ({ dimensions, setDimensions }) => {
  const cellSize = GRID_SIZE / GRID_DIVISIONS

  const handleChange = (e) => {
    const { name, value } = e.target
    const newValue = Math.max(cellSize, Math.round(parseFloat(value) / cellSize) * cellSize)
    setDimensions((prev) => ({ ...prev, [name]: newValue }))
  }

  return (
    <div className='fixed right-4 top-20 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Wall Dimensions</h2>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Width:</span>
        </label>
        <input
          type='number'
          name='width'
          value={dimensions.width}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
          className='input input-sm input-bordered w-full max-w-xs'
        />
      </div>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Height:</span>
        </label>
        <input
          type='number'
          name='height'
          value={dimensions.height}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
          className='input input-sm input-bordered w-full max-w-xs'
        />
      </div>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Thickness:</span>
        </label>
        <input
          type='number'
          name='thickness'
          value={dimensions.thickness}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
          className='input input-sm input-bordered w-full max-w-xs'
        />
      </div>
    </div>
  )
}

export default WallDimensionsMenu
