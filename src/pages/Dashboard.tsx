import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { MapPin, CheckSquare, Sprout, Users } from 'lucide-react';

interface DashboardStats {
  totalPlots: number;
  assignedPlots: number;
  activeTasks: number;
  totalPlants: number;
}

interface RecentActivity {
  id: string;
  type: 'plot_assigned' | 'task_completed' | 'plant_added';
  description: string;
  timestamp: string;
  user_name: string;
}

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlots: 0,
    assignedPlots: 0,
    activeTasks: 0,
    totalPlants: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch plots
      const { data: plots } = await supabase
        .from('garden_plots')
        .select('*');

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .neq('status', 'completed');

      // Fetch plants
      const { data: plotPlants } = await supabase
        .from('plot_plants')
        .select('*');

      setStats({
        totalPlots: plots?.length || 0,
        assignedPlots: plots?.filter(p => p.assigned_user_id !== null).length || 0,
        activeTasks: tasks?.length || 0,
        totalPlants: plotPlants?.length || 0
      });

      // Mock recent activity for demo
      setRecentActivity([
        {
          id: '1',
          type: 'plot_assigned',
          description: 'Plot A-1 assigned to new member',
          timestamp: new Date().toISOString(),
          user_name: 'John Doe'
        },
        {
          id: '2',
          type: 'task_completed',
          description: 'Watering task completed for Plot B-3',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user_name: 'Jane Smith'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Plots',
      value: stats.totalPlots,
      icon: MapPin,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Assigned Plots',
      value: stats.assignedPlots,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Tasks',
      value: stats.activeTasks,
      icon: CheckSquare,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Plants Growing',
      value: stats.totalPlants,
      icon: Sprout,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your community garden.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {activity.user_name} • {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <MapPin className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Plots</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <CheckSquare className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Task</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Sprout className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Plant</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <Calendar className="h-6 w-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;