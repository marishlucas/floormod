import React from 'react'
import useStore from '../helpers/store'

const WallDimensionsMenu = () => {
  const { wallDimensions, setWallDimensions } = useStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setWallDimensions({ [name]: parseFloat(value) })
  }

  return (
    <div className='fixed right-4 top-20 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Wall Dimensions</h2>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Height:</span>
        </label>
        <input
          type='number'
          name='height'
          value={wallDimensions.height}
          onChange={handleChange}
          step={0.1}
          min={0.1}
          className='input input-bordered input-sm w-full max-w-xs'
        />
      </div>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Width:</span>
        </label>
        <input
          type='number'
          name='width'
          value={wallDimensions.width}
          onChange={handleChange}
          step={0.1}
          min={0.1}
          className='input input-bordered input-sm w-full max-w-xs'
        />
      </div>
    </div>
  )
}

export default WallDimensionsMenu
