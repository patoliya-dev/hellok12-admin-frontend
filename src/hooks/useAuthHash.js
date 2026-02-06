import { useState, useEffect } from "react";
import { parseAuthHash } from "../utils/hashParser";

/**
 * React hook to return parsed auth tab and roleData from URL hash on mount.
 * @returns {{ tab: string, roleData: Object|null }}
 */
export default function useAuthHash() {
  const [authState, setAuthState] = useState({ tab: "signin", roleData: null });

  useEffect(() => {
    const updateFromHash = () => {
      const { tab, roleData } = parseAuthHash(window.location.hash);
      setAuthState({ tab, roleData });
    };

    updateFromHash();

    // Optional: listen to hashchange if you want dynamic updates
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  return authState;
}
