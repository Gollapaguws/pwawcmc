import type { Service, Motorcycle, Booking, BookingData } from '../types/api-types';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://app.wescoastmotorcycles.co.za/functions/mobileAPI'
  : 'http://localhost:3000/functions/mobileAPI';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class ApiService {
  private static async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // Service methods - customize based on your API
  static async getServices(): Promise<ApiResponse<Service[]>> {
    return this.fetchApi('/services');
  }

  static async getMotorcycles(): Promise<ApiResponse<Motorcycle[]>> {
    return this.fetchApi('/motorcycles');
  }

  static async getBookings(): Promise<ApiResponse<Booking[]>> {
    return this.fetchApi('/bookings');
  }

  static async createBooking(data: BookingData): Promise<ApiResponse<Booking>> {
    return this.fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
