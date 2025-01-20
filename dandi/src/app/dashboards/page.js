'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CreateKeyModal, EditKeyModal } from '@/components/Modals';

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState('1000');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showKey, setShowKey] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyName, setEditKeyName] = useState('');
  const [editKeyLimit, setEditKeyLimit] = useState('');
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newKeyName,
          limit: parseInt(newKeyLimit)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      
      const newKey = await response.json();
      setApiKeys(prevKeys => [...prevKeys, newKey]);
      setNewKeyName('');
      setNewKeyLimit('1000');
      document.getElementById('createKeyModal').close();
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    try {
      await fetch(`/api/keys/${keyId}`, { method: 'DELETE' });
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await createApiKey(e);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateApiKey(e);
    setIsEditModalOpen(false);
  };

  const startEditing = (key) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setEditKeyLimit(key.api_limit.toString());
    setIsEditModalOpen(true);
  };

  const updateApiKey = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/keys/${editingKey.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editKeyName }),
      });
      
      if (response.ok) {
        setApiKeys(apiKeys.map(key => 
          key.id === editingKey.id ? { ...key, name: editKeyName } : key
        ));
        document.getElementById('editKeyModal').close();
        setEditingKey(null);
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Overview</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {}} // Add your plan management logic
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50"
            >
              Manage Plan
            </button>
          </div>
        </div>

        {/* Plan Info Card */}
        <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 rounded-xl p-8 mb-12">
          <div className="text-sm text-gray-600 mb-2">CURRENT PLAN</div>
          <h2 className="text-2xl font-bold mb-4">Researcher</h2>
          <div>
            <div className="text-sm mb-2">API Limit</div>
            <div className="bg-white/30 rounded-full h-2 w-full">
              <div className="bg-white rounded-full h-2" style={{ width: '0%' }}></div>
            </div>
            <div className="text-sm mt-2">0 / 1,000 Credits</div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="text-gray-500 text-sm mt-1">
              The key is used to authenticate your requests to the API. To learn more, see the documentation page.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('createKeyModal').showModal()}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-[#383838] transition-colors"
            title="Create a new API key"
          >
            + Create Key
          </button>
        </div>

        {/* API Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-1/4">NAME</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-1/6">USAGE</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">KEY</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-[160px] text-center">OPTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{key.name}</td>
                  <td className="px-6 py-4">0</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <code className="font-mono text-sm flex-1">
                        {showKey[key.id] ? key.key : '••••••••••••••••••••••••••••••••'}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        title={showKey[key.id] ? "Hide API key" : "Show API key"}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        title="Copy to clipboard"
                      >
                        {copiedId === key.id ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => startEditing(key)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                        title="Edit API key name"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-red-500"
                        title="Delete API key"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apiKeys.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No API keys found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Replace the old modals with the new components */}
      <CreateKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        newKeyLimit={newKeyLimit}
        setNewKeyLimit={setNewKeyLimit}
      />
      
      <EditKeyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editKeyName={editKeyName}
        setEditKeyName={setEditKeyName}
        editKeyLimit={editKeyLimit}
        setEditKeyLimit={setEditKeyLimit}
      />
    </div>
  );
}
