import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Plus, Sprout } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface ScheduleEvent {
  id: string;
  plot_id: string;
  plant_id: string;
  planted_date: string;
  expected_harvest_date: string;
  status: 'planted' | 'growing' | 'harvested';
  garden_plots: {
    location: string;
  };
  plants: {
    name: string;
  };
}

const Schedule: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events for selected date
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => {
      const plantedDate = event.planted_date.split('T')[0];
      const harvestDate = event.expected_harvest_date.split('T')[0];
      return plantedDate === dateStr || harvestDate === dateStr;
    });
    setSelectedEvents(dayEvents);
  }, [date, events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('plot_plants')
        .select(`
          *,
          garden_plots (location),
          plants (name)
        `)
        .order('planted_date');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => {
        const plantedDate = event.planted_date.split('T')[0];
        const harvestDate = event.expected_harvest_date.split('T')[0];
        return plantedDate === dateStr || harvestDate === dateStr;
      });

      if (dayEvents.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Planting Schedule</h1>
        <p className="text-gray-600 mt-2">Track planting and harvesting dates across all plots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Garden Calendar</span>
              </h2>
              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
            </div>
            
            <div className="calendar-container">
              <Calendar
                onChange={setDate as any}
                value={date}
                tileContent={tileContent}
                className="w-full border-none"
              />
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
          </div>
          
          <div className="p-6">
            {selectedEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Sprout className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.plants.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Plot: {event.garden_plots.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Status: {event.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event) => (
              <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{event.plants.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'planted' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'growing' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">Plot: {event.garden_plots.location}</p>
                <p className="text-xs text-gray-500">
                  Harvest: {new Date(event.expected_harvest_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;