import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    subdomain: '',
  });

  // Password validation state
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-convert subdomain to lowercase and remove invalid characters
    if (name === 'subdomain') {
      const filtered = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData({ ...formData, [name]: filtered });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Check password validations in real-time
    if (name === 'password') {
      setPasswordValidations({
        minLength: value.length >= 6,
        hasNumber: /\d/.test(value),
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ First Name validation
    if (formData.firstName.length < 2) {
      setError('First name must be at least 2 characters');
      return;
    }
    if (formData.firstName.length > 50) {
      setError('First name cannot exceed 50 characters');
      return;
    }

    // ✅ Last Name validation
    if (formData.lastName.length < 2) {
      setError('Last name must be at least 2 characters');
      return;
    }
    if (formData.lastName.length > 50) {
      setError('Last name cannot exceed 50 characters');
      return;
    }

    // ✅ Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // ✅ Company Name validation
    if (formData.companyName.length < 2) {
      setError('Company name must be at least 2 characters');
      return;
    }
    if (formData.companyName.length > 100) {
      setError('Company name cannot exceed 100 characters');
      return;
    }

    // ✅ Subdomain validation
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(formData.subdomain)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
      return;
    }
    if (formData.subdomain.length < 3) {
      setError('Subdomain must be at least 3 characters');
      return;
    }
    if (formData.subdomain.length > 50) {
      setError('Subdomain cannot exceed 50 characters');
      return;
    }
    if (formData.subdomain.startsWith('-') || formData.subdomain.endsWith('-')) {
      setError('Subdomain cannot start or end with a hyphen');
      return;
    }

    // ✅ Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // ✅ Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.companyName.trim(),
        subdomain: formData.subdomain,
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '550px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Start your free trial
        </p>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            borderLeft: '4px solid #c62828'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="e.g., John"
              minLength="2"
              maxLength="50"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Letters only, 2-50 characters
            </small>
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="e.g., Doe"
              minLength="2"
              maxLength="50"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Letters only, 2-50 characters
            </small>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g., john@company.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Must be a valid email address (e.g., name@domain.com)
            </small>
          </div>

          {/* Company Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g., Acme Corporation"
              minLength="2"
              maxLength="100"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Letters, numbers, and spaces, 2-100 characters
            </small>
          </div>

          {/* Subdomain */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Subdomain *
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                required
                placeholder="mycompany"
                minLength="3"
                maxLength="50"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px 0 0 4px',
                  fontSize: '16px'
                }}
              />
              <span style={{
                padding: '10px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderLeft: 'none',
                borderRadius: '0 4px 4px 0',
                fontSize: '14px',
                color: '#666',
                whiteSpace: 'nowrap'
              }}>
                .yourapp.com
              </span>
            </div>
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              <strong>⚠️ Requirements:</strong> Lowercase letters, numbers, and hyphens only.<br />
              3-50 characters, cannot start or end with a hyphen.
            </small>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Password *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
                minLength="6"
                style={{
                  width: '100%',
                  padding: '10px',
                  paddingRight: '40px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {/* Password validation checklist */}
            {formData.password && (
              <div style={{ marginTop: '8px', fontSize: '14px' }}>
                <div style={{ color: passwordValidations.minLength ? '#2e7d32' : '#c62828' }}>
                  {passwordValidations.minLength ? '✅' : '❌'} At least 6 characters
                </div>
                <div style={{ color: passwordValidations.hasNumber ? '#2e7d32' : '#c62828' }}>
                  {passwordValidations.hasNumber ? '✅' : '❌'} Contains a number
                </div>
                <div style={{ color: passwordValidations.hasUpperCase ? '#2e7d32' : '#c62828' }}>
                  {passwordValidations.hasUpperCase ? '✅' : '❌'} Contains uppercase letter
                </div>
                <div style={{ color: passwordValidations.hasLowerCase ? '#2e7d32' : '#c62828' }}>
                  {passwordValidations.hasLowerCase ? '✅' : '❌'} Contains lowercase letter
                </div>
                <div style={{ color: passwordValidations.hasSpecialChar ? '#2e7d32' : '#c62828' }}>
                  {passwordValidations.hasSpecialChar ? '✅' : '❌'} Contains special character (!@#$%^&*)
                </div>
              </div>
            )}
            
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              <strong>✅ Minimum 6 characters</strong> with at least one number, uppercase, lowercase, and special character
            </small>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Confirm Password *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                style={{
                  width: '100%',
                  padding: '10px',
                  paddingRight: '40px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div style={{ color: '#c62828', marginTop: '4px', fontSize: '14px' }}>
                ❌ Passwords do not match
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div style={{ color: '#2e7d32', marginTop: '4px', fontSize: '14px' }}>
                ✅ Passwords match
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Start Free Trial'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;