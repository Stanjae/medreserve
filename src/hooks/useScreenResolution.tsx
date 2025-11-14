/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useEffect } from "react";

type ScreenSize = "mobile" | "tablet" | "desktop" | "large-desktop";

interface ScreenResolution {
  size: ScreenSize;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

// Default breakpoints (Tailwind-inspired)
const defaultBreakpoints = {
  mobile: 640, // sm
  tablet: 768, // md
  desktop: 1024, // lg
  largeDesktop: 1280, // xl
};

export function useScreenResolution(
  customBreakpoints?: Partial<typeof defaultBreakpoints>
): ScreenResolution {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  const getScreenSize = (width: number): ScreenSize => {
    if (width < breakpoints.mobile) return "mobile";
    if (width < breakpoints.tablet) return "tablet";
    if (width < breakpoints.desktop) return "desktop";
    return "large-desktop";
  };

  const [resolution, setResolution] = useState<ScreenResolution>(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") {
      return {
        size: "desktop",
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = getScreenSize(width);

    return {
      size,
      width,
      height,
      isMobile: size === "mobile",
      isTablet: size === "tablet",
      isDesktop: size === "desktop",
      isLargeDesktop: size === "large-desktop",
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const size = getScreenSize(width);

      setResolution({
        size,
        width,
        height,
        isMobile: size === "mobile",
        isTablet: size === "tablet",
        isDesktop: size === "desktop",
        isLargeDesktop: size === "large-desktop",
      });
    };

    // Add debounce to improve performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [
    breakpoints.mobile,
    breakpoints.tablet,
    breakpoints.desktop,
      breakpoints.largeDesktop,
  ]);

  return resolution;
}
