import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'staff',
    firstName: '',
    lastName: '',
  });

  const loadMembers = async () => {
    try {
      // ✅ FIXED: Use /api/users
      const response = await api.get('/api/users');
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIXED: Use /api/users
      await api.post('/api/users', inviteData);
      toast.success('Team member added!');
      setShowInvite(false);
      loadMembers();
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Remove this team member?')) return;
    try {
      // ✅ FIXED: Use /api/users/:id
      await api.delete(`/api/users/${userId}`);
      toast.success('Member removed');
      loadMembers();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const roleColors = {
    owner: { bg: '#e8f5e9', color: '#2e7d32', label: '👑 Owner' },
    admin: { bg: '#e3f2fd', color: '#1565c0', label: '🛡️ Admin' },
    staff: { bg: '#fff3e0', color: '#e65100', label: '📋 Staff' },
    viewer: { bg: '#f5f5f5', color: '#616161', label: '👁️ Viewer' },
  };

  return (
    <div>
      <h1>👥 Team</h1>
      <p>Manage your team members and their roles</p>

      <button
        onClick={() => setShowInvite(true)}
        style={{
          padding: '10px 20px',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '20px 0',
        }}
      >
        + Invite Team Member
      </button>

      {showInvite && (
        <form onSubmit={handleInvite} style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px',
          background: '#f9f9f9',
        }}>
          <h3>Invite Team Member</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input
              placeholder="First Name"
              value={inviteData.firstName}
              onChange={(e) => setInviteData({...inviteData, firstName: e.target.value})}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="Last Name"
              value={inviteData.lastName}
              onChange={(e) => setInviteData({...inviteData, lastName: e.target.value})}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={inviteData.email}
              onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={inviteData.role}
              onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
            <div>
              <button type="submit" style={{ padding: '10px 20px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Add Member
              </button>
              <button type="button" onClick={() => setShowInvite(false)} style={{ padding: '10px 20px', marginLeft: '10px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : members.length === 0 ? (
        <p>No team members yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {members.map((member) => {
            const roleStyle = roleColors[member.role] || roleColors.viewer;
            return (
              <div key={member._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #e1dff0',
                borderRadius: '8px',
                background: 'white',
              }}>
                <div>
                  <strong>{member.firstName} {member.lastName}</strong>
                  <div>{member.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: roleStyle.bg,
                    color: roleStyle.color,
                  }}>
                    {roleStyle.label}
                  </span>
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(member._id)}
                      style={{
                        color: '#d32f2f',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Team;