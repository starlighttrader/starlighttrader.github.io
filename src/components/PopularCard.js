"use client";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
}) => {
  const pathRef = useRef();
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

const PopularCard = ({ children, className }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative p-[1px] overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <MovingBorder duration={4000} rx="30%" ry="30%">
            <div className="h-48 w-48 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]" />
          </MovingBorder>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
      <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-gemini-blue to-gemini-pink text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
        Best Value
      </div>
    </div>
  );
};

export default PopularCard; 