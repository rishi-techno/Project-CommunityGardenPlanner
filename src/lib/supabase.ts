import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'gardener';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'gardener';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'gardener';
          created_at?: string;
          updated_at?: string;
        };
      };
      garden_plots: {
        Row: {
          id: string;
          location: string;
          size: string;
          assigned_user_id: string | null;
          status: 'available' | 'assigned' | 'planted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location: string;
          size: string;
          assigned_user_id?: string | null;
          status?: 'available' | 'assigned' | 'planted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location?: string;
          size?: string;
          assigned_user_id?: string | null;
          status?: 'available' | 'assigned' | 'planted';
          created_at?: string;
          updated_at?: string;
        };
      };
      plants: {
        Row: {
          id: string;
          name: string;
          scientific_name: string;
          planting_season: string;
          harvest_time: number;
          description: string;
          care_instructions: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          scientific_name?: string;
          planting_season: string;
          harvest_time: number;
          description?: string;
          care_instructions?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          scientific_name?: string;
          planting_season?: string;
          harvest_time?: number;
          description?: string;
          care_instructions?: string;
          created_at?: string;
        };
      };
      plot_plants: {
        Row: {
          id: string;
          plot_id: string;
          plant_id: string;
          quantity: number;
          planted_date: string;
          expected_harvest_date: string;
          status: 'planted' | 'growing' | 'harvested';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plot_id: string;
          plant_id: string;
          quantity: number;
          planted_date: string;
          expected_harvest_date: string;
          status?: 'planted' | 'growing' | 'harvested';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plot_id?: string;
          plant_id?: string;
          quantity?: number;
          planted_date?: string;
          expected_harvest_date?: string;
          status?: 'planted' | 'growing' | 'harvested';
          notes?: string | null;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          due_date: string;
          priority: 'low' | 'medium' | 'high';
          status: 'pending' | 'in_progress' | 'completed';
          assigned_user_id: string;
          plot_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          due_date: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed';
          assigned_user_id: string;
          plot_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'in_progress' | 'completed';
          assigned_user_id?: string;
          plot_id?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};