const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const stripeService = require('../services/stripe.service');
const Tenant = require('../models/Tenant');

// ✅ Get subscription status
router.get('/subscription/status', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    res.json({
      subscribed: !!tenant.stripeSubscriptionId,
      status: tenant.subscriptionStatus || 'inactive',
      plan: tenant.plan || 'free',
      currentPeriodEnd: tenant.subscriptionEndDate,
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// ✅ Create checkout session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const tenant = await Tenant.findById(req.user.tenantId);

    // Get or create Stripe customer
    let customerId = tenant.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer(
        tenant.email,
        tenant.name,
        tenant._id
      );
      customerId = customer.id;
      tenant.stripeCustomerId = customerId;
      await tenant.save();
    }

    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ✅ Create billing portal session
router.post('/billing-portal', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripeService.createBillingPortalSession(
      tenant.stripeCustomerId,
      req.body.returnUrl || `${process.env.FRONTEND_URL}/settings`
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

// ✅ Get invoices
router.get('/invoices', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant.stripeCustomerId) {
      return res.json([]);
    }

    const invoices = await stripeService.getCustomerInvoices(tenant.stripeCustomerId);
    res.json(invoices.map(inv => ({
      id: inv.id,
      number: inv.number,
      amountPaid: inv.amount_paid,
      amountDue: inv.amount_due,
      status: inv.status,
      issuedAt: inv.created,
      pdfUrl: inv.invoice_pdf,
    })));
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

module.exports = router;