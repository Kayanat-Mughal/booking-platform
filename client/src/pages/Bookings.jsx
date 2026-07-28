import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingApi } from '../api/bookings.js';

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
  const [editingId, setEditingId] = useState(null);

  const shouldRetry = (error) => {
    return !error.response || error.response.status >= 500;
  };

  const retryAsync = async (fn, retries = 2) => {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt === retries || !shouldRetry(error)) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    throw lastError;
  };

  const loadBookings = async () => {
    try {
      setError('');
      const data = await retryAsync(() => bookingApi.getBookings());
      setBookings(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load bookings');
      toast.error('Failed to load bookings');
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

  const validateForm = () => {
    if (!form.clientName.trim()) return 'Client name is required.';
    if (!form.clientEmail.trim()) return 'Client email is required.';
    if (!form.service.trim()) return 'Service is required.';
    if (!form.startTime || !form.endTime) return 'Start time and end time are required.';
    if (new Date(form.endTime) <= new Date(form.startTime)) return 'End time must be after start time.';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);
      setError('');
      await retryAsync(() => bookingApi.createBooking({
        ...form,
        status: 'pending',
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      }));
      setForm(initialForm);
      toast.success('Booking created successfully!');
      await loadBookings();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create booking');
      toast.error(requestError.response?.data?.error || 'Failed to create booking');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);
      await retryAsync(() => bookingApi.updateBooking(editingId, {
        ...form,
        status: 'pending',
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      }));
      setEditingId(null);
      setForm(initialForm);
      toast.success('Booking updated!');
      await loadBookings();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to update booking');
      toast.error(requestError.response?.data?.error || 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await retryAsync(() => bookingApi.deleteBooking(id));
      setBookings(bookings.filter((booking) => booking._id !== id));
      toast.success('Booking deleted!');
    } catch (requestError) {
      toast.error('Unable to delete booking');
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setForm({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      service: booking.service,
      startTime: booking.startTime.slice(0, 16),
      endTime: booking.endTime.slice(0, 16),
      notes: booking.notes || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const groupedBookings = useMemo(() => {
    return bookings.reduce((groups, booking) => {
      const groupKey = new Date(booking.startTime).toLocaleDateString();
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(booking);
      return groups;
    }, {});
  }, [bookings]);

  const isEditing = !!editingId;

  return (
    <div style={{ color: '#302b55' }}>
      <h1 style={{ marginTop: 0 }}>Bookings</h1>
      <p>Create and manage appointments for your tenant.</p>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}

      <form onSubmit={isEditing ? handleUpdate : handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        margin: '24px 0',
        padding: '20px',
        borderRadius: '12px',
        background: isEditing ? 'rgba(255, 215, 0, 0.12)' : 'rgba(102, 126, 234, 0.12)',
      }}>
        <label style={{ display: 'grid', gap: '4px' }}>
          Client name
          <input
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>
          Client email
          <input
            name="clientEmail"
            type="email"
            value={form.clientEmail}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>
          Service
          <input
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>
          Start time
          <input
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>
          End time
          <input
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
            required
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>
          Notes
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{ padding: '10px', border: '1px solid #d7d3e8', borderRadius: '6px' }}
          />
        </label>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'end' }}>
          <button type="submit" disabled={saving} style={{
            padding: '11px 18px',
            border: 0,
            borderRadius: '6px',
            background: isEditing ? '#f5a623' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            fontWeight: 'bold',
            cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? 'Saving...' : isEditing ? 'Update booking' : 'Add booking'}
          </button>
          {isEditing && (
            <button type="button" onClick={cancelEdit} style={{
              padding: '11px 18px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? <p>Loading bookings...</p> : bookings.length === 0 ? <p>No bookings yet.</p> : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {Object.entries(groupedBookings).map(([date, group]) => (
            <section key={date} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
              <h2 style={{ margin: '0 0 12px', color: '#302b55' }}>{date}</h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {group.map((booking) => (
                  <article key={booking._id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    padding: '16px',
                    border: '1px solid #e1dff0',
                    borderRadius: '10px',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{booking.clientName}</div>
                      <div style={{ color: '#5f5f7d', marginBottom: '8px' }}>{booking.service}</div>
                      <div style={{ color: '#6d6d88' }}>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ color: '#8f91a1', marginTop: '8px' }}>{booking.clientEmail} · {booking.status}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Link to={`/dashboard/bookings/${booking._id}`} style={{
                        border: '1px solid #667eea',
                        color: '#667eea',
                        background: 'white',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}>
                        View
                      </Link>
                      <button type="button" onClick={() => startEdit(booking)} style={{
                        border: '1px solid #667eea',
                        color: '#667eea',
                        background: 'white',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}>
                        Edit
                      </button>
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
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;