export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  category?: string;
  image?: string;
}

export interface Motorcycle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  customerId: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  motorcycleId: string;
  customerId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface BookingData {
  serviceId: string;
  motorcycleId: string;
  customerId: string;
  date: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}
