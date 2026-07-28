import api from '../utils/api';

// Generate idempotency key
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const bookingApi = {
  // Get all bookings
  getBookings: async (params = {}) => {
    const response = await api.get('/api/bookings', { params });
    return response.data;
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  // Create booking (with idempotency)
  createBooking: async (data) => {
    const idempotencyKey = generateIdempotencyKey();
    const response = await api.post('/api/bookings', data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return response.data;
  },

  // Update booking
  updateBooking: async (id, data) => {
    const response = await api.patch(`/api/bookings/${id}`, data, {
      headers: { 'Idempotency-Key': generateIdempotencyKey() },
    });
    return response.data;
  },

  // Delete booking
  deleteBooking: async (id) => {
    const response = await api.delete(`/api/bookings/${id}`);
    return response.data;
  },
};