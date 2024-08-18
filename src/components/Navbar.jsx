export default function Navbar({ viewMode, setViewMode, mode, setMode }) {
  return (
    <div className='absolute inset-x-0 top-0 z-50 bg-base-100 p-4 shadow-md'>
      <div className='flex items-center justify-between'>
        <div>
          <button
            className={`btn btn-primary ${viewMode === '2D' ? '' : 'btn-outline'} btn-sm mr-2`}
            onClick={() => setViewMode('2D')}
          >
            2D View
          </button>
          <button
            className={`btn btn-primary ${viewMode === '3D' ? '' : 'btn-outline'} btn-sm mr-2`}
            onClick={() => setViewMode('3D')}
          >
            3D View
          </button>
        </div>
        <div>
          <button
            className={`btn btn-primary ${mode === 'placement' ? '' : 'btn-outline'} btn-sm mr-2`}
            onClick={() => setMode('placement')}
          >
            Placement Mode
          </button>
          <button
            className={`btn btn-primary ${mode === 'modification' ? '' : 'btn-outline'} btn-sm mr-2`}
            onClick={() => setMode('modification')}
          >
            Modification Mode
          </button>
        </div>
      </div>
    </div>
  )
}
