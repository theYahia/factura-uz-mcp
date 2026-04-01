import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const rejectInvoiceSchema = z.object({
  invoice_id: z.string().describe("Invoice ID to reject"),
  reason: z.string().describe("Rejection reason"),
});

export async function handleRejectInvoice(params: z.infer<typeof rejectInvoiceSchema>): Promise<string> {
  const result = await client.post(`/invoices/${params.invoice_id}/reject`, {
    reason: params.reason,
  });
  return JSON.stringify(result, null, 2);
}
