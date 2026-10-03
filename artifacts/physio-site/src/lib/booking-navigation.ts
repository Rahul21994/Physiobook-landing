export type BookingMode = "home" | "telehealth";

export interface PendingBookingContext {
  mode?: BookingMode;
  citySlug?: string;
  localityId?: string;
}

const SESSION_STORAGE_KEY = "goswami.pending-booking-context";
const PENDING_CONTEXT_TTL_MS = 30_000;

let pendingBookingContext: PendingBookingContext | null = null;

function normalizeBookingContext(value: unknown): PendingBookingContext | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const mode =
    candidate.mode === "home" || candidate.mode === "telehealth"
      ? candidate.mode
      : undefined;
  const citySlug =
    typeof candidate.citySlug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.citySlug)
      ? candidate.citySlug
      : undefined;
  const localityId =
    typeof candidate.localityId === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.localityId)
      ? candidate.localityId
      : undefined;

  if (!mode && !citySlug && !localityId) return null;
  return { ...(mode ? { mode } : {}), ...(citySlug ? { citySlug } : {}), ...(localityId ? { localityId } : {}) };
}

export function setPendingBookingContext(context: PendingBookingContext) {
  pendingBookingContext = normalizeBookingContext(context);
  if (!pendingBookingContext) return;
  try {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ context: pendingBookingContext, savedAt: Date.now() }),
    );
  } catch {
    // The in-memory value still supports client-side navigation if storage is unavailable.
  }
}

export function consumePendingBookingContext(): PendingBookingContext | null {
  const memoryContext = pendingBookingContext;
  pendingBookingContext = null;
  let storedContext: PendingBookingContext | null = null;

  try {
    const savedValue = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    if (savedValue) {
      const saved = JSON.parse(savedValue) as {
        context?: unknown;
        mode?: unknown;
        savedAt?: unknown;
      };
      const age = typeof saved.savedAt === "number" ? Date.now() - saved.savedAt : Infinity;
      if (age >= 0 && age <= PENDING_CONTEXT_TTL_MS) {
        // Accept the previous storage shape for tabs that navigate during an upgrade.
        storedContext = normalizeBookingContext(saved.context ?? { mode: saved.mode });
      }
    }
  } catch {
    // Ignore unavailable or malformed session storage and keep booking available.
  }

  return memoryContext ?? storedContext;
}

export function setPendingBookingMode(mode: BookingMode) {
  setPendingBookingContext({ mode });
}

export function consumePendingBookingMode(): BookingMode | null {
  return consumePendingBookingContext()?.mode ?? null;
}
