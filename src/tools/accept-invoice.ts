import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const acceptInvoiceSchema = z.object({
  invoice_id: z.string().describe("Invoice ID to accept"),
});

export async function handleAcceptInvoice(params: z.infer<typeof acceptInvoiceSchema>): Promise<string> {
  const result = await client.post(`/invoices/${params.invoice_id}/accept`, {});
  return JSON.stringify(result, null, 2);
}
