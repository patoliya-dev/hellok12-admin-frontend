import React, { useEffect, useId, useMemo } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef(
  (
    {
      className,
      id,
      checked = false,
      indeterminate = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const reactId = useId();

    // Stable, deterministic id across renders; use provided id when present
    const checkboxId = useMemo(() => {
      // useId can include ":" which is valid in HTML id.
      // If you prefer, you can replace ":" but not required.
      const safe = String(reactId).replace(/:/g, "");
      return id || `checkbox-${safe}`;
    }, [id, reactId]);

    // Ensure indeterminate state is applied to the native input (visual-only)
    useEffect(() => {
      if (!ref) return;
      const el = typeof ref === "function" ? null : ref.current;
      if (el) el.indeterminate = !!indeterminate;
    }, [indeterminate, ref]);

    const sizeClasses = {
      sm: "h-4 w-4",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    };

    const showCheck = checked && !indeterminate;
    const showMinus = indeterminate;

    return (
      <div className={cn("flex items-start space-x-2", className)}>
        <div className="relative flex items-center flex-row">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            checked={!!checked}
            disabled={disabled}
            required={required}
            className="peer sr-only"
            aria-invalid={!!error}
            aria-describedby={
              description || error ? `${checkboxId}-help` : undefined
            }
            {...props}
          />

          <label
            htmlFor={checkboxId}
            className={cn(
              "shrink-0 rounded-sm border border-primary ring-offset-background",
              "cursor-pointer transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              sizeClasses[size],
              (checked || indeterminate) &&
                "bg-primary text-primary-foreground border-primary",
              error && "border-destructive",
            )}
          >
            {/* keep icon alignment as before */}
            <span className="flex h-full w-full items-center justify-center">
              {showCheck && <Check className="h-3 w-3 text-current" />}
              {showMinus && <Minus className="h-3 w-3 text-current" />}
            </span>
          </label>
        </div>

        {(label || description || error) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  error ? "text-destructive" : "text-foreground",
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}

            {(description || error) && (
              <p
                id={`${checkboxId}-help`}
                className={cn(
                  "text-sm",
                  error ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {error || description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

/**
 * CheckboxGroup
 * - No functional change; small cleanup only.
 */
const CheckboxGroup = React.forwardRef(
  (
    {
      className,
      children,
      label,
      description,
      error,
      required = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        className={cn("space-y-3", className)}
        {...props}
      >
        {label && (
          <legend
            className={cn(
              "text-sm font-medium",
              error ? "text-destructive" : "text-foreground",
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </legend>
        )}

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        <div className="space-y-2">{children}</div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </fieldset>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
