import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    companyName: '',
    subdomain: '',
    plan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/api/tenants/current');
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/api/tenants/current', settings);
      toast.success('Settings saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginTop: 0 }}>⚙️ Settings</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Configure your account and company settings</p>

      <form onSubmit={handleSave} style={{ marginBottom: '40px', textAlign: 'left' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
            Company Name
          </label>
          <input
            value={settings.companyName}
            onChange={(e) => setSettings({...settings, companyName: e.target.value})}
            style={{ 
              width: '100%', 
              maxWidth: '400px',
              padding: '10px 14px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
            Subdomain
          </label>
          <input
            value={settings.subdomain}
            disabled
            style={{ 
              width: '100%', 
              maxWidth: '400px',
              padding: '10px 14px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box',
              background: '#f5f5f5',
              color: '#999'
            }}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
            Subdomain cannot be changed
          </small>
        </div>

        {/* ✅ Updated Plan Section with Change Plan Button */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
            Plan
          </label>
          <div style={{ 
            padding: '10px 14px', 
            background: '#f5f5f5', 
            borderRadius: '6px',
            maxWidth: '400px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {user?.tenant?.plan || 'Free'}
            </span>
            <Link to="/pricing">
              <button style={{
                padding: '6px 16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}>
                Change Plan
              </button>
            </Link>
          </div>
        </div>

        <button type="submit" style={{
          padding: '10px 24px',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'inline-block'
        }}>
          Save Settings
        </button>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '40px 0' }} />

      <div style={{ 
        border: '1px solid #ffcdd2', 
        padding: '24px', 
        borderRadius: '8px', 
        background: '#fff5f5',
        maxWidth: '500px',
        textAlign: 'left'
      }}>
        <h3 style={{ 
          color: '#c62828', 
          marginTop: 0,
          fontSize: '18px',
          textAlign: 'left'
        }}>
          🔴 Danger Zone
        </h3>
        <p style={{ 
          color: '#666', 
          marginBottom: '16px',
          textAlign: 'left'
        }}>
          Deleting your account will remove all data permanently. 
          This action cannot be undone.
        </p>
        <button style={{
          padding: '10px 24px',
          background: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'inline-block'
        }}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;