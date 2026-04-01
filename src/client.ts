const BASE_URL = "https://api.factura.uz/api/v1";
const AUTH_URL = "https://api.factura.uz/oauth2/token";
const TIMEOUT = 15_000;

export class FacturaClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry = 0;

  constructor() {
    this.clientId = process.env.FACTURA_CLIENT_ID ?? "";
    this.clientSecret = process.env.FACTURA_CLIENT_SECRET ?? "";
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        "Environment variables FACTURA_CLIENT_ID and FACTURA_CLIENT_SECRET are required. " +
        "Get credentials from Factura.uz developer portal."
      );
    }
  }

  async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Factura auth error ${response.status}: ${text}`);
      }

      const data = (await response.json()) as { access_token: string; expires_in: number };
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      return this.accessToken;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Factura: auth timeout (15s). Try again later.");
      }
      throw error;
    }
  }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const token = await this.getToken();
    const url = `${BASE_URL}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Factura HTTP ${response.status}: ${text}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return response.json();
      }
      return { status: response.status, message: await response.text() };
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Factura: request timeout (15s). Try again later.");
      }
      throw error;
    }
  }

  async get(path: string, params?: Record<string, string>): Promise<unknown> {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request("GET", `${path}${query}`);
  }

  async post(path: string, body: unknown): Promise<unknown> {
    return this.request("POST", path, body);
  }

  async put(path: string, body: unknown): Promise<unknown> {
    return this.request("PUT", path, body);
  }
}
