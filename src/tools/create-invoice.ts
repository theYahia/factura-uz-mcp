import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

const itemSchema = z.object({
  name: z.string().describe("Product/service name"),
  quantity: z.number().positive().describe("Quantity"),
  unit: z.string().describe("Unit of measure"),
  price: z.number().positive().describe("Unit price"),
  vat_rate: z.number().min(0).describe("VAT rate (e.g. 12)"),
  catalog_code: z.string().optional().describe("Product catalog code"),
  package_code: z.string().optional().describe("Package code"),
});

const partySchema = z.object({
  inn: z.string().describe("Tax identification number (INN)"),
  name: z.string().describe("Company name"),
  address: z.string().optional().describe("Legal address"),
  account: z.string().optional().describe("Bank account number"),
  bank_id: z.string().optional().describe("Bank MFO code"),
});

export const createInvoiceSchema = z.object({
  seller: partySchema.describe("Seller details"),
  buyer: partySchema.describe("Buyer details"),
  items: z.array(itemSchema).min(1).describe("Invoice line items"),
  contract_id: z.string().optional().describe("Contract ID"),
});

export async function handleCreateInvoice(params: z.infer<typeof createInvoiceSchema>): Promise<string> {
  const items = params.items.map((item) => ({
    ...item,
    amount: item.quantity * item.price,
    vat_amount: (item.quantity * item.price * item.vat_rate) / 100,
  }));

  const result = await client.post("/invoices", {
    seller: params.seller,
    buyer: params.buyer,
    items,
    contract_id: params.contract_id,
  });
  return JSON.stringify(result, null, 2);
}
