import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    if (user?.tenant?.plan) {
      setCurrentPlan(user.tenant.plan);
    }
  }, [user]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Up to 50 bookings/month',
        '1 team member',
        'Basic support',
        'Calendar integration',
      ],
      priceId: null,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      description: 'For growing businesses',
      features: [
        'Unlimited bookings',
        '5 team members',
        'Email support',
        'Advanced analytics',
        'Custom branding',
      ],
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29.99',
      description: 'For large teams',
      features: [
        'Unlimited bookings',
        'Unlimited team members',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'SMS notifications',
      ],
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    },
  ];

  const handleSubscribe = async (priceId, planId) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    // ✅ If user is already on this plan
    if (currentPlan === planId) {
      toast.info(`You are already on the ${planId} plan`);
      return;
    }

    if (planId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '10px' }}>
        Simple, Transparent Pricing
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        Choose the plan that works best for your business
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        alignItems: 'stretch',
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: plan.highlighted ? '2px solid #667eea' : '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '30px',
              background: plan.highlighted ? '#f8f7ff' : 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {plan.badge && (
              <span style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: '#667eea',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {plan.badge}
              </span>
            )}

            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{plan.name}</h2>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
              {plan.price}
              {plan.id !== 'free' && <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}>/month</span>}
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>{plan.description}</p>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '30px',
              flex: 1,
            }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{
                  padding: '8px 0',
                  borderBottom: index < plan.features.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}>
                  ✅ {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.priceId, plan.id)}
              disabled={loading || currentPlan === plan.id}
              style={{
                padding: '12px 24px',
                background: currentPlan === plan.id ? '#666' : (plan.highlighted ? '#667eea' : '#e0e0e0'),
                color: currentPlan === plan.id ? 'white' : (plan.highlighted ? 'white' : '#333'),
                border: 'none',
                borderRadius: '8px',
                cursor: currentPlan === plan.id ? 'default' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {currentPlan === plan.id 
                ? '✅ Current Plan' 
                : currentPlan === 'free' 
                  ? `⬆ Upgrade to ${plan.name}` 
                  : `🔄 Switch to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;