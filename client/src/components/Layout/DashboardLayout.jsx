import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { text: 'Bookings', path: '/dashboard/bookings', icon: '📅' },
    ];

    if (user?.role === 'owner' || user?.role === 'admin') {
      baseItems.push({ text: 'Team', path: '/dashboard/team', icon: '👥' });
    }

    if (user?.role === 'owner') {
      baseItems.push({ text: 'Billing', path: '/dashboard/billing', icon: '💰' });
      baseItems.push({ text: 'Settings', path: '/dashboard/settings', icon: '⚙️' });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '240px' : '60px',
        background: '#1a1a2e',
        color: 'white',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflow: 'hidden',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: '70px',
        }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: sidebarOpen ? '40px' : '32px',
              height: sidebarOpen ? '40px' : '32px',
              transition: 'all 0.3s ease',
              borderRadius: '10px',
              animation: 'bounce 2s ease-in-out infinite',
            }}
          />
          {sidebarOpen && (
            <span style={{
              fontWeight: 'bold',
              fontSize: '18px',
              letterSpacing: '0.5px',
            }}>
              Booking Platform
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && user && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.5,
              textTransform: 'capitalize',
            }}>
              {user.role} · {user.tenant?.name}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 12px', overflow: 'hidden' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: sidebarOpen ? '12px 16px' : '12px',
                  marginBottom: '2px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                  background: isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
              >
                <span style={{ fontSize: '20px', minWidth: '28px', textAlign: 'center' }}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span style={{ fontSize: '14px', fontWeight: isActive ? '500' : '400', whiteSpace: 'nowrap' }}>
                    {item.text}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: sidebarOpen ? '12px 16px' : '12px',
              width: '100%',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            <span style={{ fontSize: '20px', minWidth: '28px', textAlign: 'center' }}>🚪</span>
            {sidebarOpen && <span style={{ fontSize: '14px' }}>Logout</span>}
          </button>
        </div>
      </div>

      {/* ✅ Main Content - Gap Khatam! */}
      <div style={{
        marginLeft: 0,                               // ✅ Zero margin
        paddingLeft: sidebarOpen ? '240px' : '60px', // ✅ Sidebar width ke hisaab se padding
        flex: 1,
        padding: '24px',
        paddingLeft: sidebarOpen ? '240px' : '60px', // ✅ Padding left sidebar ke width ke hisaab se
        transition: 'padding-left 0.3s ease',
        background: '#f0f2f5',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          minHeight: 'calc(100vh - 48px)',
        }}>
          <Outlet />
        </div>
      </div>

      {/* Bounce Animation CSS */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;