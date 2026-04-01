import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const getCompanyByInnSchema = z.object({
  inn: z.string().describe("Tax identification number (INN) to look up"),
});

export async function handleGetCompanyByInn(params: z.infer<typeof getCompanyByInnSchema>): Promise<string> {
  const result = await client.get(`/companies/${params.inn}`);
  return JSON.stringify(result, null, 2);
}
