const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true, unique: true },
    access_token: String,
    refresh_token: String,
    refresh_token_expires_at: Date,
    token_expires_at: Date,
    active: { type: Boolean, default: false },
    billing_status: String,
    billing_plan: String,
    billing_subscription_id: String,
    installed_at: Date,
    uninstalled_at: Date,
    walmart_connected: { type: Boolean, default: false },
    walmart_client_id: String,
    walmart_client_secret: String,
    walmart_scopes: mongoose.Schema.Types.Mixed,
    returns_enabled: { type: Boolean, default: false },
    order_credits_limit: { type: Number, default: 0 },
    order_credits_used: { type: Number, default: 0 },
    credits_reset_at: Date,
    wfs_last_order_sync: Date,
    shopify_fulfillment_service_id: String,
    shopify_location_id: String,
    shopify_inbound_location_id: String,
    shopify_fulfillment_location_id: String,
    webhook_ids: [String],
    settings: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'stores',
    strict: false, // allow extra fields present in DB
  }
)

module.exports = mongoose.model('Store', StoreSchema)
