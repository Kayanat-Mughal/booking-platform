import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingLogo from '../../assets/icons8-calender-100.png';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { text: 'Bookings', path: '/dashboard/bookings', icon: '📅' },
    { text: 'Team', path: '/dashboard/team', icon: '👥' },
    { text: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '70px',
        background: 'rgba(26, 26, 46, 0.78)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 100
      }}>
        {/* Logo Section */}
        <div style={{ 
          padding: '20px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '70px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={bookingLogo}
              alt="Booking Platform logo"
              style={{ 
                height: sidebarOpen ? '48px' : '34px',
                transition: 'height 0.3s',
                animation: 'bounce 2s ease-in-out infinite'
              }} 
            />
            {sidebarOpen && (
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>
                Booking Platform
              </span>
            )}
          </div>
          
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: '4px',
              padding: '4px 8px',
              transition: 'all 0.3s ease'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={{ marginTop: '10px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: 'white',
                textDecoration: 'none',
                gap: '12px',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px', minWidth: '30px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.text}</span>}
            </Link>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0' }} />

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              color: 'white',
              background: 'transparent',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              gap: '12px',
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '20px', minWidth: '30px' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div style={{
        marginLeft: sidebarOpen ? '250px' : '70px',
        flex: 1,
        padding: '20px',
        transition: 'margin-left 0.3s',
        background: 'transparent',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.94)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 40px)'
        }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;