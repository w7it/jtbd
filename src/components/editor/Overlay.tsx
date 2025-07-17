export function Overlay() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <Instructions />
    </div>
  );
}

function Instructions() {
  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
      <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Double-click to create a sticky note</li>
        <li>• Drag notes to move them</li>
        <li>• Use mouse wheel to zoom</li>
        <li>• Click × to delete a note</li>
        <li>• Use controls in bottom-right corner</li>
      </ul>
    </div>
  );
}
