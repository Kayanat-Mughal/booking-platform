import React from 'react';
import { Link } from 'react-router-dom';
import bookingLogo from '../assets/logo.png';

const Landing = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated floating circles */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        top: '-100px',
        right: '-100px',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        bottom: '-50px',
        left: '-50px',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />
      
      {/* Main content */}
      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
        color: 'white',
        zIndex: 1
      }}>
        <img
          src={bookingLogo}
          alt="Booking Logo"
          style={{
            height: '90px',
            marginBottom: '20px',
            display: 'inline-block',
            animation: 'bounce 2s ease-in-out infinite'
          }}
        />
        
        <h1 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Booking Platform
        </h1>
        
        <p style={{
          fontSize: '22px',
          marginBottom: '40px',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Manage your appointments, team, and clients —<br />
          <strong>all in one place.</strong>
        </p>
        
        {/* Feature boxes */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {[
            { icon: '📊', title: 'Dashboard', desc: 'View all your bookings at a glance' },
            { icon: '👥', title: 'Team', desc: 'Manage your team members easily' },
            { icon: '⚡', title: 'Real-time', desc: 'Updates happen instantly' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '12px',
              minWidth: '150px',
              flex: 1,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'transform 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>{feature.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{feature.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{
              padding: '16px 48px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}>
              🚀 Start Free Trial
            </button>
          </Link>
          
          <Link to="/login">
            <button style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}>
              Sign In
            </button>
          </Link>
        </div>
        
        {/* Footer */}
        <p style={{ marginTop: '50px', fontSize: '14px', opacity: 0.6 }}>
          Free trial. No credit card required.
        </p>
      </div>
      
      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;