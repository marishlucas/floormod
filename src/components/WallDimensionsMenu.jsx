import React from 'react'
import { GRID_SIZE, GRID_DIVISIONS } from '@/constants/gridConfig'

const WallDimensionsMenu = ({ dimensions, setDimensions }) => {
  const cellSize = GRID_SIZE / GRID_DIVISIONS

  const roundToGrid = (value) => {
    return Math.round(value / cellSize) * cellSize
  }

  const formatValue = (value) => {
    return Number(value.toFixed(4))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const parsedValue = parseFloat(value)
    if (!isNaN(parsedValue)) {
      const newValue = Math.max(cellSize, roundToGrid(parsedValue))
      setDimensions((prev) => ({ ...prev, [name]: formatValue(newValue) }))
    }
  }

  return (
    <div style={{ position: 'fixed', top: '100px', left: '10px', zIndex: 1000 }}>
      <div>
        <label>Width: </label>
        <input
          type='number'
          name='width'
          value={formatValue(dimensions.width)}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type='number'
          name='height'
          value={formatValue(dimensions.height)}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
        />
      </div>
      <div>
        <label>Thickness: </label>
        <input
          type='number'
          name='thickness'
          value={formatValue(dimensions.thickness)}
          onChange={handleChange}
          step={cellSize}
          min={cellSize}
        />
      </div>
    </div>
  )
}

export default WallDimensionsMenu
