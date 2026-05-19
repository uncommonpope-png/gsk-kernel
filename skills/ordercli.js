module.exports = { skill_ordercli };

function skill_ordercli() {
  return {
    name: "OrderCLI",
    description: "Manage and track orders — place, check status, and manage e-commerce orders via CLI",
    when: "Placing orders programmatically, checking order status, managing fulfillment workflows",
    commands: {
      ordercli: {
        list: "ordercli list",
        status: "ordercli status <order-id>",
        place: "ordercli place --item \"Widget\" --qty 5",
        cancel: "ordercli cancel <order-id>",
        history: "ordercli history --days 30"
      },
      shopify: {
        setup: `SHOP="mystore.myshopify.com"
TOKEN="your-admin-token"`,
        listOrders: `curl -H "X-Shopify-Access-Token: $TOKEN" \\
  "https://$SHOP/admin/api/2024-01/orders.json?limit=10&status=any"`,
        getOrder: `curl -H "X-Shopify-Access-Token: $TOKEN" \\
  "https://$SHOP/admin/api/2024-01/orders/<id>.json"`,
        createDraft: `curl -X POST -H "X-Shopify-Access-Token: $TOKEN" \\
  -H "Content-Type: application/json" \\
  "https://$SHOP/admin/api/2024-01/draft_orders.json" \\
  -d '{"draft_order":{"line_items":[{"variant_id":123,"quantity":1}]}}'`
      }
    },
    notes: [
      "ordercli is a custom ForgeClaw skill for order management",
      "Adapt API patterns to your specific order system",
      "Track orders with webhooks for real-time status updates",
      "Use pagination for large order histories"
    ],
    alternatives: {
      local: ["Custom CLI with SQLite", "Local order DB"],
      free: ["Shopify Admin API (free tier)", "WooCommerce REST API"]
    }
  };
}