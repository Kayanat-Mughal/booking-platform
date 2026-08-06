const express = require('express');
const router = express.Router();

// ✅ SIMPLE WORKING WEBHOOK - No verification for testing
router.post('/stripe', async (req, res) => {
  try {
    // Log the raw body
    console.log('🔵 Webhook endpoint hit!');
    console.log('🔵 Raw body:', req.body);
    
    // Parse the event - works for both test and real events
    let event;
    if (typeof req.body === 'string') {
      event = JSON.parse(req.body);
    } else {
      event = req.body;
    }
    
    console.log(`📥 Webhook received: ${event.type || 'test'}`);
    
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`✅ Checkout completed for customer: ${session.customer || 'test'}`);
      
      // Update tenant in database
      if (session.customer && session.subscription) {
        await handleSubscriptionCreated(session.customer, session.subscription);
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('🔴 Webhook error:', error);
    console.error('🔴 Error details:', error.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper function
async function handleSubscriptionCreated(customerId, subscriptionId) {
  console.log(`📦 Subscription created: ${subscriptionId} for customer ${customerId}`);
  // TODO: Update tenant in database
}

module.exports = router;