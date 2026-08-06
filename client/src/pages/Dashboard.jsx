import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  // 📋 Staff Dashboard - Exactly like second screenshot
  const StaffDashboard = () => (
    <div>
      <h2 style={{ marginTop: 0, fontSize: '22px' }}>Welcome, {user?.firstName}! 👋</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {user?.tenant?.name} · Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#4a6cf7', fontSize: '28px' }}>15</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>My Bookings</p>
        </div>
        <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#22c55e', fontSize: '28px' }}>3</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Today's Appointments</p>
        </div>
        <div style={{ background: '#fef3f2', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#ef4444', fontSize: '28px' }}>10</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Completed</p>
        </div>
      </div>

      <Link to="/dashboard/bookings">
        <button style={{
          padding: '10px 24px',
          background: '#4a6cf7',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          📅 Create Booking
        </button>
      </Link>

      <div style={{ marginTop: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>📅 Today's Schedule</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>10:00 AM - Client Meeting</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>2:00 PM - Consultation</li>
          <li style={{ padding: '8px 0' }}>4:30 PM - Follow-up</li>
        </ul>
      </div>
    </div>
  );

  // 👑 Owner Dashboard
  const OwnerDashboard = () => (
    <div>
      <h2 style={{ marginTop: 0, fontSize: '22px' }}>Welcome, {user?.firstName}! 👋</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {user?.tenant?.name} · Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#4a6cf7', fontSize: '28px' }}>45</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Bookings</p>
        </div>
        <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#22c55e', fontSize: '28px' }}>$1,200</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Revenue</p>
        </div>
        <div style={{ background: '#fef3f2', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#ef4444', fontSize: '28px' }}>5</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pending</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/dashboard/team">
          <button style={{ padding: '10px 24px', background: '#4a6cf7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>👥 Invite Team</button>
        </Link>
        <Link to="/dashboard/settings">
          <button style={{ padding: '10px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>⚙️ Settings</button>
        </Link>
      </div>
    </div>
  );

  // 🛡️ Admin Dashboard
  const AdminDashboard = () => (
    <div>
      <h2 style={{ marginTop: 0, fontSize: '22px' }}>Welcome, {user?.firstName}! 👋</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {user?.tenant?.name} · Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#4a6cf7', fontSize: '28px' }}>30</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Team Bookings</p>
        </div>
        <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#22c55e', fontSize: '28px' }}>5</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Today's Appointments</p>
        </div>
        <div style={{ background: '#fef3f2', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#ef4444', fontSize: '28px' }}>2</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Pending Requests</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/dashboard/bookings">
          <button style={{ padding: '10px 24px', background: '#4a6cf7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>📅 Create Booking</button>
        </Link>
        <Link to="/dashboard/team">
          <button style={{ padding: '10px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>👥 Manage Staff</button>
        </Link>
      </div>
    </div>
  );

  // 👁️ Viewer Dashboard
  const ViewerDashboard = () => (
    <div>
      <h2 style={{ marginTop: 0, fontSize: '22px' }}>Welcome, {user?.firstName}! 👋</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {user?.tenant?.name} · Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#4a6cf7', fontSize: '28px' }}>45</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Bookings</p>
        </div>
        <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#22c55e', fontSize: '28px' }}>12</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Active</p>
        </div>
        <div style={{ background: '#fef3f2', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ margin: 0, color: '#ef4444', fontSize: '28px' }}>5</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Upcoming</p>
        </div>
      </div>

      <button style={{ padding: '10px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        📊 Export Report
      </button>
    </div>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'owner': return <OwnerDashboard />;
      case 'admin': return <AdminDashboard />;
      case 'staff': return <StaffDashboard />;
      case 'viewer': return <ViewerDashboard />;
      default: return <p>Welcome to your dashboard!</p>;
    }
  };

  return renderDashboard();
};

export default Dashboard;