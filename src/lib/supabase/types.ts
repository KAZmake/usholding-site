export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string | null;
          card_tagline: string | null;
          card_description: string | null;
          services: string[];
          tags: string[];
          logo_file: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          card_tagline?: string | null;
          card_description?: string | null;
          services?: string[];
          tags?: string[];
          logo_file?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          tagline?: string | null;
          description?: string | null;
          card_tagline?: string | null;
          card_description?: string | null;
          services?: string[];
          tags?: string[];
          logo_file?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tag: string;
          location: string;
          builder: string;
          year: string;
          image_url: string | null;
          image_alt: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tag: string;
          location: string;
          builder: string;
          year: string;
          image_url?: string | null;
          image_alt?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tag?: string;
          location?: string;
          builder?: string;
          year?: string;
          image_url?: string | null;
          image_alt?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: 'new' | 'in_progress' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: 'new' | 'in_progress' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: 'new' | 'in_progress' | 'closed';
          updated_at?: string;
        };
        Relationships: [];
      };
      user_profile_extra: {
        Row: {
          id: string;
          clerk_user_id: string;
          phone: string | null;
          position: string | null;
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          phone?: string | null;
          position?: string | null;
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          phone?: string | null;
          position?: string | null;
          department?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
