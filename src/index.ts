#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createInvoiceSchema, handleCreateInvoice } from "./tools/create-invoice.js";
import { signInvoiceSchema, handleSignInvoice } from "./tools/sign-invoice.js";
import { getInvoiceSchema, handleGetInvoice } from "./tools/get-invoice.js";
import { listInvoicesSchema, handleListInvoices } from "./tools/list-invoices.js";
import { acceptInvoiceSchema, handleAcceptInvoice } from "./tools/accept-invoice.js";
import { rejectInvoiceSchema, handleRejectInvoice } from "./tools/reject-invoice.js";
import { getCompanyByInnSchema, handleGetCompanyByInn } from "./tools/get-company-by-inn.js";
import { listProductsSchema, handleListProducts } from "./tools/list-products.js";

const server = new McpServer({ name: "factura-uz-mcp", version: "1.0.0" });

server.tool("create_invoice", "Create an electronic invoice (e-factura).", createInvoiceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateInvoice(params) }] }));

server.tool("sign_invoice", "Sign an invoice with digital signature.", signInvoiceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSignInvoice(params) }] }));

server.tool("get_invoice", "Get invoice details by ID.", getInvoiceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetInvoice(params) }] }));

server.tool("list_invoices", "List invoices with filters.", listInvoicesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListInvoices(params) }] }));

server.tool("accept_invoice", "Accept a received invoice.", acceptInvoiceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleAcceptInvoice(params) }] }));

server.tool("reject_invoice", "Reject a received invoice.", rejectInvoiceSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleRejectInvoice(params) }] }));

server.tool("get_company_by_inn", "Look up company by INN (tax ID).", getCompanyByInnSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetCompanyByInn(params) }] }));

server.tool("list_products", "Search product catalog.", listProductsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListProducts(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[factura-uz-mcp] Server started. 8 tools registered.");
}

main().catch((error) => { console.error("[factura-uz-mcp] Error:", error); process.exit(1); });
