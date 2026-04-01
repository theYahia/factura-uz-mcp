# factura-uz-mcp

MCP server for Factura.uz electronic invoicing system (Uzbekistan). Supports creating, signing, accepting, and rejecting e-invoices, plus company and product lookups.

## Tools (8)

| Tool | Description |
|------|-------------|
| `create_invoice` | Create an electronic invoice |
| `sign_invoice` | Sign an invoice digitally |
| `get_invoice` | Get invoice details |
| `list_invoices` | List invoices with filters |
| `accept_invoice` | Accept a received invoice |
| `reject_invoice` | Reject a received invoice |
| `get_company_by_inn` | Look up company by tax ID |
| `list_products` | Search product catalog |

## Quick Start

```json
{
  "mcpServers": {
    "factura-uz": {
      "command": "npx",
      "args": ["-y", "@theyahia/factura-uz-mcp"],
      "env": {
        "FACTURA_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "FACTURA_CLIENT_SECRET": "<YOUR_CLIENT_SECRET>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FACTURA_CLIENT_ID` | Yes | OAuth2 client ID from Factura.uz |
| `FACTURA_CLIENT_SECRET` | Yes | OAuth2 client secret |

## Demo Prompts

- "Create an invoice from Seller LLC to Buyer LLC for 10 widgets at 5000 UZS each"
- "List all sent invoices from January to March 2026"
- "Look up company with INN 123456789"
- "Accept invoice inv_abc123"
- "Search the product catalog for laptops"

## License

MIT
