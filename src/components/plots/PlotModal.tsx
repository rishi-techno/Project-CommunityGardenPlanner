import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface Plot {
  id: string;
  location: string;
  size: string;
  assigned_user_id: string | null;
  status: 'available' | 'assigned' | 'planted';
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface PlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot?: Plot | null;
  onSuccess: () => void;
}

const PlotModal: React.FC<PlotModalProps> = ({ isOpen, onClose, plot, onSuccess }) => {
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<string>('');
  const [status, setStatus] = useState<'available' | 'assigned' | 'planted'>('available');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (plot) {
        setLocation(plot.location);
        setSize(plot.size);
        setAssignedUserId(plot.assigned_user_id || '');
        setStatus(plot.status);
      } else {
        resetForm();
      }
    }
  }, [isOpen, plot]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'gardener');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const resetForm = () => {
    setLocation('');
    setSize('');
    setAssignedUserId('');
    setStatus('available');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const plotData = {
        location,
        size,
        assigned_user_id: assignedUserId || null,
        status: assignedUserId ? 'assigned' : 'available',
        updated_at: new Date().toISOString()
      };

      if (plot) {
        // Update existing plot
        const { error } = await supabase
          .from('garden_plots')
          .update(plotData)
          .eq('id', plot.id);

        if (error) throw error;
      } else {
        // Create new plot
        const { error } = await supabase
          .from('garden_plots')
          .insert({
            ...plotData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving plot:', error);
      alert('Failed to save plot');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {plot ? 'Edit Plot' : 'Add New Plot'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., A-1, Section B, Plot 12"
              required
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <input
              id="size"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 4x8 feet, 10x10 meters"
              required
            />
          </div>

          <div>
            <label htmlFor="assignedUser" className="block text-sm font-medium text-gray-700 mb-2">
              Assign to User
            </label>
            <select
              id="assignedUser"
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">No assignment</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (plot ? 'Update Plot' : 'Create Plot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlotModal;