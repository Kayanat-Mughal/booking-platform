import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Your company: {user?.tenant?.name}</p>
      <p>Subdomain: {user?.tenant?.subdomain}</p>
      <p>Your role: {user?.role}</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3>📅 Bookings</h3>
          <p>Manage your bookings</p>
          <Link to="/dashboard/bookings">View →</Link>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3>👥 Team</h3>
          <p>Manage team members</p>
          <Link to="/dashboard/team">View →</Link>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3>⚙️ Settings</h3>
          <p>Configure your account</p>
          <Link to="/dashboard/settings">View →</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;