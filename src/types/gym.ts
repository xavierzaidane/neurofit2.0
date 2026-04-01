export interface Gym {
  id: string;
  name: string;

  address: string;
  city: string;
  country: string;

  latitude: number;
  longitude: number;

  rating?: number;
  reviewCount?: number;

  phone?: string;

  images?: string[];

  distance?: number; // in KM
  
  price?: number; // Monthly membership price
  type?: string; // Big Box, CrossFit, Yoga, etc.
  description?: string;
  amenities?: string[];
  hours?: string;
  website?: string;
}