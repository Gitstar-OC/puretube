"use client"
import { motion, useAnimation } from "motion/react"
import type React from "react"

import type { HTMLAttributes } from "react"
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@/lib/utils"

export interface DownloadIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface DownloadIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const DownloadIcon = forwardRef<DownloadIconHandle, DownloadIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start("animate")
        } else {
          onMouseEnter?.(e)
        }
      },
      [controls, onMouseEnter],
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start("normal")
        } else {
          onMouseLeave?.(e)
        }
      },
      [controls, onMouseLeave],
    )

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <motion.polyline
            points="7 10 12 15 17 10"
            variants={{
              normal: { y: 0 },
              animate: { y: [0, 3, 0] },
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            animate={controls}
          />
          <motion.line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
            variants={{
              normal: { scaleY: 1 },
              animate: { scaleY: [1, 1.1, 1] },
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            animate={controls}
          />
        </motion.svg>
      </div>
    )
  },
)

DownloadIcon.displayName = "DownloadIcon"
export { DownloadIcon }
