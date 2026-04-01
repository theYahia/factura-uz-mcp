import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const signInvoiceSchema = z.object({
  invoice_id: z.string().describe("Invoice ID to sign"),
});

export async function handleSignInvoice(params: z.infer<typeof signInvoiceSchema>): Promise<string> {
  const result = await client.post(`/invoices/${params.invoice_id}/sign`, {});
  return JSON.stringify(result, null, 2);
}
