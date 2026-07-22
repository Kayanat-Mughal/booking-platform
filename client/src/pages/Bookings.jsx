import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

const initialForm = {
  clientName: '',
  clientEmail: '',
  service: '',
  startTime: '',
  endTime: '',
  notes: '',
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadBookings = async () => {
    try {
      setError('');
      const response = await api.get('/api/bookings');
      setBookings(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await api.post('/api/bookings', {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
      setForm(initialForm);
      await loadBookings();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create booking');
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to delete booking');
    }
  };

  return (
    <div style={{ color: '#302b55' }}>
      <h1 style={{ marginTop: 0 }}>Bookings</h1>
      <p>Create and manage appointments for your tenant.</p>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        margin: '24px 0',
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(102, 126, 234, 0.12)',
      }}>
        {[
          ['clientName', 'Client name', 'text'],
          ['clientEmail', 'Client email', 'email'],
          ['service', 'Service', 'text'],
          ['startTime', 'Start time', 'datetime-local'],
          ['endTime', 'End time', 'datetime-local'],
        ].map(([name, label, type]) => (
          <label key={name} style={{ display: 'grid', gap: '4px' }}>
            {label}
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required
              style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
            />
          </label>
        ))}
        <label style={{ display: 'grid', gap: '4px' }}>
          Notes
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <button type="submit" disabled={saving} style={{
          alignSelf: 'end',
          padding: '11px 18px',
          border: 0,
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 'bold',
          cursor: saving ? 'wait' : 'pointer',
        }}>
          {saving ? 'Saving...' : 'Add booking'}
        </button>
      </form>

      {loading ? <p>Loading bookings...</p> : bookings.length === 0 ? <p>No bookings yet.</p> : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {bookings.map((booking) => (
            <article key={booking._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #e1dff0',
              borderRadius: '8px',
              background: 'white',
            }}>
              <div>
                <strong>{booking.clientName}</strong> · {booking.service}
                <div>{new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}</div>
                <small>{booking.clientEmail} · {booking.status}</small>
              </div>
              <button type="button" onClick={() => deleteBooking(booking._id)} style={{
                border: '1px solid #d9534f',
                color: '#b42318',
                background: 'white',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}>
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
