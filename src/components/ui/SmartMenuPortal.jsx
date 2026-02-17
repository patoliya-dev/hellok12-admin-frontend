import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * SmartMenuPortal
 * Props:
 * - anchorRect: DOMRect of the button/icon (required)
 * - onClose: () => void
 * - width: number (optional, default 144px ≈ w-56)
 * - gap: number (optional, default 8px)
 * - children: menu content
 */
export default function SmartMenuPortal({ anchorRect, anchorEl, onClose, width = 144, gap = 8, children }) {
    const hostRef = useRef(null);
    const menuRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    if (!hostRef.current) hostRef.current = document.createElement("div");

    // mount/unmount host
    useEffect(() => {
        const host = hostRef.current;
        host.style.position = "fixed";
        host.style.zIndex = "9999";
        document.body.appendChild(host);

        const onEsc = (e) => e.key === "Escape" && onClose?.();
        // Use 'click' (not 'mousedown') to avoid pre-empting the button's onClick.
        const onDocClick = (e) => {
            const t = e.target;
            // if click is on the menu itself -> ignore
            if (host.contains(t)) return;
            // if click is on the anchor button/icon -> let the component toggle it
            if (anchorEl && anchorEl.contains && anchorEl.contains(t)) return;
            onClose?.();
        };
        window.addEventListener("resize", onClose);
        window.addEventListener("scroll", onClose, true);
        document.addEventListener("keydown", onEsc);
        document.addEventListener("click", onDocClick);

        setMounted(true);
        return () => {
            window.removeEventListener("resize", onClose);
            window.removeEventListener("scroll", onClose, true);
            document.removeEventListener("keydown", onEsc);
            document.removeEventListener("click", onDocClick);
            document.body.removeChild(host);
        };
    }, [onClose, anchorEl]);

    // position after paint (so we can measure menu size)
    useLayoutEffect(() => {
        if (!mounted || !anchorRect || !menuRef.current || !hostRef.current) return;

        const host = hostRef.current;
        const menu = menuRef.current;

        // Desired placement: bottom-right of anchor
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Measure menu
        // Temporarily ensure it's visible (in case styles hide it)
        menu.style.visibility = "hidden";
        menu.style.maxWidth = `${Math.min(width, vw - 24)}px`;
        menu.style.display = "block";

        const menuRect = menu.getBoundingClientRect();
        const mw = menuRect.width;
        const mh = menuRect.height;

        // Compute bottom placement
        let top = Math.round(anchorRect.bottom + gap);
        let left = Math.round(anchorRect.right - mw);

        // Horizontal clamp
        const pad = 12;
        if (left + mw > vw - pad) left = vw - pad - mw;
        if (left < pad) left = pad;

        // Flip up if it overflows bottom
        if (top + mh > vh - pad) {
            const flippedTop = Math.round(anchorRect.top - gap - mh);
            if (flippedTop >= pad) {
                top = flippedTop;
            } else {
                // not enough space up or down: pin to viewport with maxHeight
                top = Math.max(pad, Math.min(top, vh - pad - mh));
                menu.style.maxHeight = `${vh - pad * 2}px`;
                menu.style.overflow = "auto";
            }
        }

        // Apply
        host.style.top = `${top}px`;
        host.style.left = `${left}px`;

        // Reveal
        menu.style.visibility = "visible";
    }, [mounted, anchorRect, width, gap]);

    if (!mounted) return null;

    return createPortal(
        <div
            ref={menuRef}
            style={{ width }}
            className="rounded-lg border border-border bg-popover shadow-lg"
        >
            {children}
        </div>,
        hostRef.current
    );
}
