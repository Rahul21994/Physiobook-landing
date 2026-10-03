import { lazy, Suspense, useRef, useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CareFinderFlow = lazy(() =>
  import("@/components/CareFinderFlow").then((module) => ({
    default: module.CareFinderFlow,
  })),
);

interface CarePathLauncherProps {
  citySlug?: string;
  className?: string;
  compact?: boolean;
  mobileMenu?: boolean;
}

export function CarePathLauncher({
  citySlug,
  className,
  compact = false,
  mobileMenu = false,
}: CarePathLauncherProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  function closeCareFinder() {
    setOpen(false);
    if (!mobileMenu) return;
    const mobileNavigation = detailsRef.current?.closest(
      'details[data-testid="mobile-menu"]',
    ) as HTMLDetailsElement | null;
    if (mobileNavigation) mobileNavigation.open = false;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <details
      ref={detailsRef}
      className={cn(
        "care-path-launcher",
        compact && "care-path-launcher--compact",
        mobileMenu && "care-path-launcher--mobile",
      )}
      data-testid="care-path-launcher"
      open={open}
      onKeyDown={handleKeyDown}
    >
      <summary
        ref={triggerRef}
        id={`${menuId}-trigger`}
        className={cn(
          "care-path-summary",
          compact && "shrink-0 whitespace-nowrap",
          className,
        )}
        aria-expanded={open}
        aria-controls={menuId}
        data-testid="care-path-launcher-trigger"
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
      >
        <span>{compact ? "Plan your care" : "Choose your care"}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden="true"
        />
      </summary>
      <div
        id={menuId}
        className="care-path-launcher-menu"
        data-testid="care-path-launcher-menu"
        hidden={!open}
      >
        <div className="mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Plan your care</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Choose a care format and optionally select your city to prefill the request.
          </p>
        </div>
        {open && (
          <Suspense
            fallback={
              <p className="py-8 text-center text-sm text-muted-foreground" role="status">
                Loading care options…
              </p>
            }
          >
            <CareFinderFlow
              citySlug={citySlug}
              placement="header"
              testIdPrefix="care-finder"
              onContinue={closeCareFinder}
            />
          </Suspense>
        )}
      </div>
    </details>
  );
}