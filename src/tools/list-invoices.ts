import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const listInvoicesSchema = z.object({
  date_from: z.string().describe("Start date (YYYY-MM-DD)"),
  date_to: z.string().describe("End date (YYYY-MM-DD)"),
  status: z.enum(["draft", "sent", "accepted", "rejected", "cancelled"]).optional().describe("Filter by status"),
  direction: z.enum(["in", "out"]).optional().describe("Filter by direction (in=received, out=sent)"),
});

export async function handleListInvoices(params: z.infer<typeof listInvoicesSchema>): Promise<string> {
  const query: Record<string, string> = {
    date_from: params.date_from,
    date_to: params.date_to,
  };
  if (params.status) query.status = params.status;
  if (params.direction) query.direction = params.direction;

  const result = await client.get("/invoices", query);
  return JSON.stringify(result, null, 2);
}
