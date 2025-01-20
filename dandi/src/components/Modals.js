'use client';

import { useEffect } from 'react';

export function CreateKeyModal({ isOpen, onClose, onSubmit, newKeyName, setNewKeyName, newKeyLimit, setNewKeyLimit }) {
  useEffect(() => {
    const dialog = document.getElementById('createKeyModal');
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog id="createKeyModal" className="rounded-lg shadow-lg p-0 w-[440px]" onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Create a new API key</h3>
        <p className="text-gray-500 text-sm mb-6">
          Enter a name and limit for the new API key.
        </p>
        
        <form onSubmit={onSubmit} method="dialog">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Key Name</label>
              <span className="text-sm text-gray-500">— A unique name to identify this key</span>
            </div>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key Name"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Limit monthly usage*</label>
            </div>
            <input
              type="number"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              min="0"
            />
            <p className="text-xs text-gray-500 mt-2">
              * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export function EditKeyModal({ isOpen, onClose, onSubmit, editKeyName, setEditKeyName, editKeyLimit, setEditKeyLimit }) {
  useEffect(() => {
    const dialog = document.getElementById('editKeyModal');
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog id="editKeyModal" className="rounded-lg shadow-lg p-0 w-[440px]" onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Edit API key</h3>
        <p className="text-gray-500 text-sm mb-6">
          Update the name and limit for this API key.
        </p>
        
        <form onSubmit={onSubmit} method="dialog">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Key Name</label>
              <span className="text-sm text-gray-500">— A unique name to identify this key</span>
            </div>
            <input
              type="text"
              value={editKeyName}
              onChange={(e) => setEditKeyName(e.target.value)}
              placeholder="Key Name"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Limit monthly usage*</label>
            </div>
            <input
              type="number"
              value={editKeyLimit}
              onChange={(e) => setEditKeyLimit(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              min="0"
            />
            <p className="text-xs text-gray-500 mt-2">
              * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
} 