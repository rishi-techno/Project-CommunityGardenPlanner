import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { MapPin, User, Plus, Edit, Trash2 } from 'lucide-react';
import PlotModal from '../components/plots/PlotModal';

interface Plot {
  id: string;
  location: string;
  size: string;
  assigned_user_id: string | null;
  status: 'available' | 'assigned' | 'planted';
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const Plots: React.FC = () => {
  const { profile } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const { data, error } = await supabase
        .from('garden_plots')
        .select(`
          *,
          profiles:assigned_user_id (
            full_name,
            email
          )
        `)
        .order('location');

      if (error) throw error;
      setPlots(data || []);
    } catch (error) {
      console.error('Error fetching plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlot = () => {
    setSelectedPlot(null);
    setIsModalOpen(true);
  };

  const handleEditPlot = (plot: Plot) => {
    setSelectedPlot(plot);
    setIsModalOpen(true);
  };

  const handleDeletePlot = async (plotId: string) => {
    if (!confirm('Are you sure you want to delete this plot?')) return;

    try {
      const { error } = await supabase
        .from('garden_plots')
        .delete()
        .eq('id', plotId);

      if (error) throw error;
      await fetchPlots();
    } catch (error) {
      console.error('Error deleting plot:', error);
      alert('Failed to delete plot');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Garden Plots</h1>
          <p className="text-gray-600 mt-2">Manage community garden plots and assignments</p>
        </div>
        {profile?.role === 'admin' && (
          <button
            onClick={handleCreatePlot}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Plot</span>
          </button>
        )}
      </div>

      {/* Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plots.map((plot) => (
          <div key={plot.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{plot.location}</h3>
                </div>
                {profile?.role === 'admin' && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditPlot(plot)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlot(plot.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(plot.status)}`}>
                {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
              </span>

              {/* Details */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm font-medium text-gray-900">{plot.size}</span>
                </div>

                {plot.profiles && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{plot.profiles.full_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {plot.status === 'available' && profile?.role === 'admin' && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <button className="w-full text-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  Assign Plot
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Plot Modal */}
      <PlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plot={selectedPlot}
        onSuccess={() => {
          fetchPlots();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Plots;