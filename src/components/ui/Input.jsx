import React, { useId, useMemo } from "react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = useId();

    // Stable, deterministic id across renders; uses provided `id` if passed
    const inputId = useMemo(() => {
      const safe = String(reactId).replace(/:/g, "");
      return id || `input-${safe}`;
    }, [id, reactId]);

    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            className,
          )}
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          {...props}
        />
      );
    }

    // Radio
    if (type === "radio") {
      return (
        <input
          type="radio"
          className={cn(
            "peer h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            className,
          )}
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          {...props}
        />
      );
    }

    // File upload (custom wrapper)
    if (type === "file") {
      return (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium leading-none block text-foreground"
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}

          <div
            className={cn(
              "flex items-center justify-between w-full border-2 border-dashed border-[#E5E7EB] rounded-lg px-4 py-1.5 bg-white",
              error && "border-destructive",
            )}
          >
            <span className="text-[#1F29378C] text-sm truncate max-w-[70%] font-medium">
              {props.filename || props.placeholder || "Upload file"}
            </span>

            {/* Keep UI same; clicking this triggers the hidden input */}
            <label htmlFor={inputId} className="cursor-pointer">
              <span className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-sm font-medium text-brand-gray-800 flex items-center gap-1">
                <Icon name="FolderOpen" size={16} /> Choose File
              </span>
            </label>

            <input
              type="file"
              id={inputId}
              className="hidden"
              ref={ref}
              aria-invalid={!!error}
              {...props}
            />
          </div>

          {description && !error && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );
    }

    // Default inputs (text/email/password/number/date/etc.)
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none text-foreground",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          type={type}
          className={cn(
            "peer",
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            description || error ? `${inputId}-help` : undefined
          }
          {...props}
        />

        {(description || error) && (
          <p
            id={`${inputId}-help`}
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {error || description}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
