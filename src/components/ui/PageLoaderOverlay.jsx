import { Loader2 } from "lucide-react";

/**
 * A global page overlay loader.
 * Appears whenever async thunks are in flight (ref-counted).
 *
 * Props:
 *  • show: boolean — controls visibility
 *  • label?: string — optional message ("Loading…" by default)
 */
export default function PageLoaderOverlay({ show, label = "Loading…" }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-card border border-border rounded-2xl shadow-elevation-3 px-6 py-6 flex flex-col items-center justify-center space-y-3">
        {/* Lucide loader icon */}
        <Loader2
          className="h-8 w-8 text-primary animate-spin"
          strokeWidth={2.5}
        />

        {/* Label */}
        <p className="text-sm font-medium text-foreground tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}
