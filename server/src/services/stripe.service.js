const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // Create a Stripe customer
  async createCustomer(email, name, tenantId) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { tenantId: tenantId.toString() },
      });
      return customer;
    } catch (error) {
      console.error('Stripe createCustomer error:', error);
      throw error;
    }
  }

  // Create checkout session
  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          customerId,
        },
      });
      return session;
    } catch (error) {
      console.error('Stripe createCheckoutSession error:', error);
      throw error;
    }
  }

  // Create billing portal session
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      console.error('Stripe createBillingPortalSession error:', error);
      throw error;
    }
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
      });
      return subscriptions.data;
    } catch (error) {
      console.error('Stripe getCustomerSubscriptions error:', error);
      throw error;
    }
  }

  // Get customer invoices
  async getCustomerInvoices(customerId) {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 50,
      });
      return invoices.data;
    } catch (error) {
      console.error('Stripe getCustomerInvoices error:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Stripe cancelSubscription error:', error);
      throw error;
    }
  }

  // Update subscription (upgrade/downgrade)
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const updated = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
      });
      return updated;
    } catch (error) {
      console.error('Stripe updateSubscription error:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();