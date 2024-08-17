const WallMenu = ({ onSelectWallType, onRotate }) => {
  return (
    <div style={{ position: 'fixed', top: '60px', left: '10px', zIndex: 1000 }}>
      <button onClick={() => onSelectWallType('solid')}>Solid Wall</button>
      <button onClick={() => onSelectWallType('window')}>Wall with Window</button>
      <button onClick={onRotate}>Rotate Wall</button>
    </div>
  )
}

export default WallMenu
