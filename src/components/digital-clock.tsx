"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function DigitalClock() {
  const [time, setTime] = useState(new Date())
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .split(":")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const [hours, minutes, seconds] = formatTime(time)

  return (
    <div className="flex justify-end items-center">
      <div
        className={`
          bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg 
          transition-all transform duration-1000 ease-in-out
          ${isHovered ? "w-96 h-auto shadow-2xl -translate-x-8 scale-105" : "w-40 h-16"}
          absolute top-7 right-10 z-50
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="w-full h-full bg-transparent">
          <CardContent className="p-4 flex items-center justify-center h-full">
            {isHovered ? (
              <div className="w-full">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <TimeUnit value={hours} label="HOURS" />
                  <Separator orientation="vertical" className="h-16 bg-gray-300 dark:bg-gray-700" />
                  <TimeUnit value={minutes} label="MINUTES" />
                  <Separator orientation="vertical" className="h-16 bg-gray-300 dark:bg-gray-700" />
                  <TimeUnit value={seconds} label="SECONDS" />
                </div>

                {/* 🟢 Motion Date (Fade-in & Slide-in from Right) */}
                <motion.div
                  className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium"
                  initial={{ opacity: 0, x: 20 }} // เริ่มจากขวา
                  animate={{ opacity: 1, x: 0 }} // เลื่อนมาซ้าย
                  transition={{ duration: 0.5, ease: "easeOut" }} // เอฟเฟกต์ smooth
                >
                  {formatDate(time)}
                </motion.div>
              </div>
            ) : (
              // 🟢 Motion Time (Fade-in when Hovered)
              <motion.div
                className="text-2xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {`${hours}:${minutes}`}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }} // 🟢 Fade-in & slide-down
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  )
}