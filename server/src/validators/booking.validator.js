const { z } = require('zod');

const bookingSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  service: z.string().min(1, 'Service is required').max(100, 'Service too long').optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  startTime: z.string().datetime({ message: 'Invalid start time format' }),
  endTime: z.string().datetime({ message: 'Invalid end time format' }),
  clientPhone: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'scheduled', 'no-show']).default('pending').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

const updateBookingSchema = z.object({
  clientName: z.string().min(1, 'Client name is required').optional(),
  clientEmail: z.string().email('Invalid email address').optional(),
  service: z.string().min(1, 'Service is required').max(100, 'Service too long').optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  startTime: z.string().datetime({ message: 'Invalid start time format' }).optional(),
  endTime: z.string().datetime({ message: 'Invalid end time format' }).optional(),
  clientPhone: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'scheduled', 'no-show']).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

module.exports = {
  bookingSchema,
  updateBookingSchema,
};