import { z } from "zod";
import { FacturaClient } from "../client.js";

const client = new FacturaClient();

export const listProductsSchema = z.object({
  query: z.string().describe("Search query for product catalog"),
});

export async function handleListProducts(params: z.infer<typeof listProductsSchema>): Promise<string> {
  const result = await client.get("/products", { q: params.query });
  return JSON.stringify(result, null, 2);
}
