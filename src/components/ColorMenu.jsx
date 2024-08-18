import React from 'react'
import useStore from '../helpers/store'
import { Html } from '@react-three/drei'

const ColorMenu = ({ selectedRoom }) => {
  const { updateRoomColor } = useStore()

  const colors = ['lightblue', 'lightgreen', 'lightpink', 'lightyellow', 'lightgray']

  const handleColorChange = (color) => {
    if (selectedRoom !== null) {
      updateRoomColor(selectedRoom, color)
    }
  }

  return (
    <div className='fixed right-4 bottom-4 z-40 rounded-lg bg-base-100 p-4 shadow-lg'>
      <h2 className='mb-2 text-lg font-bold'>Wall Color</h2>
      <div className='flex space-x-2'>
        {colors.map((color) => (
          <Html>
            <button
              key={color}
              className='h-8 w-8 rounded-full'
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          </Html>
        ))}
      </div>
    </div>
  )
}

export default ColorMenu
