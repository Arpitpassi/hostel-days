"use client";

import { motion } from "framer-motion";
import rightWingImg from "./right_wing.png";
import leftWingImg  from "./left_wing.png";
import bodyImg      from "./body.png";
import puuchImg     from "./puuch.png";

export default function BirdAnimation() {
  const baseTransition = { repeat: Infinity, ease: "easeInOut" };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      
      {/* FIX APPLIED HERE: 
        Replaced fixed 500x500 with a responsive square container. 
        It will be 500px on desktop, but shrink proportionately on mobile.
      */}
      <div style={{ position: "relative", width: "100%", maxWidth: "500px", aspectRatio: "1 / 1" }}>

        {/* Left Wing */}
        <motion.img
          src={leftWingImg.src}
          alt="left wing"
          initial={{ scaleX: 1 }}
          animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            right: "52%",
            top: "15%",
            transformOrigin: "right center",
          }}
        />

        {/* Right Wing */}
        <motion.img
          src={rightWingImg.src}
          alt="right wing"
          initial={{ scaleX: 1 }}
          animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            left: "52%",
            top: "15%",
            transformOrigin: "left center",
          }}
        />

        {/* Body */}
        <motion.img
          src={bodyImg.src}
          alt="body"
          animate={{ y: [0, -12, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            left: "25%",
            top: "23%",
            transformOrigin: "center",
          }}
        />

        {/* Tail */}
        <motion.img
          src={puuchImg.src}
          alt="tail"
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0.2 }}
          style={{
            position: "absolute",
            width: "33%",
            left: "34%",
            bottom: "8%",
            transformOrigin: "top center",
          }}
        />

      </div>
    </div>
  );
}