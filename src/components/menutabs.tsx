"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"

const allTabs = [
  { name: "My Leave", roles: ["EMPLOYEE", "MANAGER", "HR","ADMIN"] },
  { name: "Requests", roles: ["MANAGER", "HR","ADMIN"] },
  { name: "Reports", roles: ["MANAGER","ADMIN"] },
] // config role base here

export default function Menutabs(
  { userRole , onTabChange}: { userRole: "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN", onTabChange: (tabName: string) => void  }
) {
  const tabs = allTabs.filter(tab => tab.roles.includes(userRole)).map(tab => tab.name)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onTabChange(tabs[index]); // ส่งชื่อแท็บกลับไปยัง parent component
  };


  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex]
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement
      setActiveStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` })
    }
  }, [activeIndex])

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0]
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement
        setActiveStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` })
      }
    })
  }, [])

  return (
    <Card className="h-[50px] border-none shadow-none relative flex items-center">
      <CardContent className="p-0">
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-[6px] flex items-center"
            style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) tabRefs.current[index] = el;
                }}
                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${index === activeIndex ? "text-[#0e0e10]" : "text-[#0e0f1199]"}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index)
                  handleTabClick(index)
                }}
              >
                <div className="text-sm leading-5 whitespace-nowrap flex items-center justify-center h-full">
                  {tab}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
