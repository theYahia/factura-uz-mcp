import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const getInvoiceSchema = z.object({
  invoice_id: z.string().describe("Invoice ID to retrieve"),
});

export async function handleGetInvoice(params: z.infer<typeof getInvoiceSchema>): Promise<string> {
  const result = await client.get(`/invoices/${params.invoice_id}`);
  return JSON.stringify(result, null, 2);
}
