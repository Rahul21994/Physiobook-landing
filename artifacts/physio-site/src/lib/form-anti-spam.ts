const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function getFormAntiSpamToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/api/bookings/anti-spam-token`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;

    const result = (await response.json()) as { token?: unknown };
    return typeof result.token === "string" ? result.token : null;
  } catch {
    return null;
  }
}