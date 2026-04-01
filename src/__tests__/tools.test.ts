import { describe, it, expect, vi, beforeEach } from "vitest";
import { createInvoiceSchema } from "../tools/create-invoice.js";
import { signInvoiceSchema } from "../tools/sign-invoice.js";
import { getInvoiceSchema } from "../tools/get-invoice.js";
import { listInvoicesSchema } from "../tools/list-invoices.js";
import { acceptInvoiceSchema } from "../tools/accept-invoice.js";
import { rejectInvoiceSchema } from "../tools/reject-invoice.js";
import { getCompanyByInnSchema } from "../tools/get-company-by-inn.js";
import { listProductsSchema } from "../tools/list-products.js";

describe("factura-uz-mcp schemas", () => {
  it("validates create_invoice params", () => {
    const valid = createInvoiceSchema.safeParse({
      seller: { inn: "123456789", name: "Seller LLC" },
      buyer: { inn: "987654321", name: "Buyer LLC" },
      items: [
        { name: "Widget", quantity: 10, unit: "pcs", price: 5000, vat_rate: 12 },
      ],
      contract_id: "CTR-001",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects create_invoice with empty items", () => {
    const invalid = createInvoiceSchema.safeParse({
      seller: { inn: "123456789", name: "Seller LLC" },
      buyer: { inn: "987654321", name: "Buyer LLC" },
      items: [],
    });
    expect(invalid.success).toBe(false);
  });

  it("validates sign_invoice params", () => {
    const valid = signInvoiceSchema.safeParse({ invoice_id: "inv_abc" });
    expect(valid.success).toBe(true);
  });

  it("validates get_invoice params", () => {
    const valid = getInvoiceSchema.safeParse({ invoice_id: "inv_abc" });
    expect(valid.success).toBe(true);
  });

  it("validates list_invoices params", () => {
    const valid = listInvoicesSchema.safeParse({
      date_from: "2026-01-01",
      date_to: "2026-03-31",
      status: "accepted",
      direction: "out",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects list_invoices with invalid status", () => {
    const invalid = listInvoicesSchema.safeParse({
      date_from: "2026-01-01",
      date_to: "2026-03-31",
      status: "invalid_status",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates accept_invoice params", () => {
    const valid = acceptInvoiceSchema.safeParse({ invoice_id: "inv_abc" });
    expect(valid.success).toBe(true);
  });

  it("validates reject_invoice params", () => {
    const valid = rejectInvoiceSchema.safeParse({
      invoice_id: "inv_abc",
      reason: "Incorrect amounts",
    });
    expect(valid.success).toBe(true);
  });

  it("validates get_company_by_inn params", () => {
    const valid = getCompanyByInnSchema.safeParse({ inn: "123456789" });
    expect(valid.success).toBe(true);
  });

  it("validates list_products params", () => {
    const valid = listProductsSchema.safeParse({ query: "laptop" });
    expect(valid.success).toBe(true);
  });
});

describe("FacturaClient", () => {
  beforeEach(() => {
    vi.stubEnv("FACTURA_CLIENT_ID", "");
    vi.stubEnv("FACTURA_CLIENT_SECRET", "");
  });

  it("throws when credentials are missing", async () => {
    const { FacturaClient } = await import("../client.js");
    expect(() => new FacturaClient()).toThrow("FACTURA_CLIENT_ID");
  });
});
