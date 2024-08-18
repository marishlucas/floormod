import React, { useState } from 'react'
import useStore from '../helpers/store'

const WallDimensionsMenu = () => {
  const { wallDimensions, setWallDimensions } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setWallDimensions({ [name]: parseFloat(value) })
  }

  return (
    <div className='fixed right-4 bottom-4 z-40 lg:top-20 lg:bottom-auto'>
      <button className='btn btn-primary mb-2 lg:hidden' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Dimensions' : 'Wall Dimensions'}
      </button>
      <div className={`rounded-lg bg-base-100 p-4 shadow-lg ${isOpen ? 'block' : 'hidden'} lg:block`}>
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
    </div>
  )
}

export default WallDimensionsMenu
