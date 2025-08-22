// hooks/useHash.js
"use client";
import { useEffect, useState } from "react";

export function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    // Function to update hash state
    const updateHash = () => {
      setHash(window.location.hash);
    };

    // Set initial hash after component mounts
    updateHash();

    // Listen for hash changes (back/forward buttons, manual URL changes)
    window.addEventListener("hashchange", updateHash);

    // Listen for popstate for better browser navigation support
    window.addEventListener("popstate", updateHash);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, []);

  return hash;
}
