export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category_id?: string;
  categories?: Category;
  short_description?: string;
  full_description?: string;
  main_image: string;
  additional_images?: string[];
  material?: string;
  color?: string;
  available_colors?: string[];
  dimensions?: string;
  compartments?: string;
  occasion?: string;
  stock_status: 'available' | 'out_of_stock';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at?: string;
}

export interface BusinessSettings {
  id: number;
  business_name: string;
  business_logo?: string;
  whatsapp_number: string;
  email_address: string;
  business_description: string;
  tagline: string;
  instagram_link?: string;
  tiktok_link?: string;
  facebook_link?: string;
  threads_link?: string;
  business_location?: string;
  business_hours?: string;
  currency: string;
  hero_heading?: string;
  hero_description?: string;
  hero_image?: string;
}

export interface AppearanceSettings {
  id: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  favicon_url?: string;
}
