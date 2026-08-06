import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      console.log('🔵 Loading billing data...');
      
      const [invoicesRes, statusRes] = await Promise.all([
        fetch('http://localhost:5000/api/payment/invoices', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:5000/api/payment/subscription/status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const invoicesData = await invoicesRes.json();
      const statusData = await statusRes.json();

      console.log('🟢 Invoices data:', invoicesData);
      console.log('🟢 Status data:', statusData);

      setInvoices(invoicesData || []);
      setSubscription(statusData || { plan: 'free', status: 'inactive' });
    } catch (error) {
      console.error('🔴 Error loading billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      console.log('🔵 Billing portal response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔴 Billing portal error:', errorData);
        toast.error(errorData.error || 'Failed to open billing portal');
        return;
      }

      const data = await response.json();
      console.log('🔵 Billing portal data:', data);
      
      if (data.url) {
        // Open billing portal in a new tab
        window.open(data.url, '_blank', 'noopener,noreferrer');
        toast.success('Billing portal opened in new tab');
      } else {
        toast.error('No billing portal URL received');
      }
    } catch (error) {
      console.error('🔴 Billing portal error:', error);
      toast.error('Failed to open billing portal');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>💰 Billing & Subscription</h1>
        <button
          onClick={handleManageBilling}
          style={{
            padding: '10px 20px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Manage Billing
        </button>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '30px',
      }}>
        <h3 style={{ marginTop: 0 }}>Current Plan</h3>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {subscription?.plan || 'Free'}
        </p>
        <p style={{ color: '#666' }}>
          Status: <span style={{
            color: subscription?.status === 'active' ? '#2e7d32' : '#666',
            fontWeight: 'bold',
          }}>
            {subscription?.status || 'Inactive'}
          </span>
        </p>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Invoice History</h2>

      {invoices.length === 0 ? (
        <p style={{ color: '#666' }}>No invoices yet</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Invoice</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>#{invoice.number}</td>
                  <td style={{ padding: '12px' }}>${(invoice.amountPaid / 100).toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: invoice.status === 'paid' ? '#e8f5e9' : '#fff3e0',
                      color: invoice.status === 'paid' ? '#2e7d32' : '#e65100',
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(invoice.issuedAt * 1000).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {invoice.pdfUrl && (
                      <a
                        href={invoice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                      >
                        Download PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;