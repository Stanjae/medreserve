"use client";
import React, { useEffect, useState } from "react";
import { Easing, motion } from "framer-motion";

const ScrollableNavbar = ({ children }: { children: React.ReactNode }) => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const variants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as Easing | Easing[] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={showNavbar ? "visible" : "hidden"}
      variants={variants}
      className="fixed top-0 bg-background left-0 right-0 shadow-md z-50"
    >
      {children}
    </motion.div>
  );
};

export default ScrollableNavbar;
