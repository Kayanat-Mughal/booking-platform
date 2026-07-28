import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi } from '../api/bookings.js';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setError('');
        const data = await bookingApi.getBooking(id);
        setBooking(data);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Unable to load booking');
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await bookingApi.deleteBooking(id);
      toast.success('Booking deleted');
      navigate('/dashboard/bookings');
    } catch {
      toast.error('Unable to delete booking');
    }
  };

  if (loading) {
    return <p>Loading booking...</p>;
  }

  if (error) {
    return <p style={{ color: '#b42318' }}>{error}</p>;
  }

  if (!booking) {
    return <p>No booking found.</p>;
  }

  return (
    <div style={{ color: '#302b55' }}>
      <button
        type="button"
        onClick={() => navigate('/dashboard/bookings')}
        style={{
          marginBottom: '16px',
          padding: '10px 16px',
          border: '1px solid #667eea',
          background: 'white',
          color: '#667eea',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Back to bookings
      </button>

      <div style={{ background: 'white', padding: '24px', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginTop: 0 }}>{booking.clientName}</h1>
        <p style={{ color: '#6d6d88', marginBottom: '24px' }}>{booking.service}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Client Details</h3>
            <p><strong>Email:</strong> {booking.clientEmail}</p>
            <p><strong>Phone:</strong> {booking.clientPhone || 'N/A'}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Booking Status</h3>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Created at:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Schedule</h3>
            <p><strong>Start:</strong> {new Date(booking.startTime).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(booking.endTime).toLocaleString()}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Notes</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{booking.notes || 'No notes provided.'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/bookings`, { state: { editId: id } })}
            style={{
              padding: '11px 18px',
              borderRadius: '8px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '11px 18px',
              borderRadius: '8px',
              background: '#f5f5f5',
              color: '#b42318',
              border: '1px solid #f1c0c4',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
