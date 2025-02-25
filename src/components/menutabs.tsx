"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { CalendarIcon, BarChartIcon, SettingsIcon } from "lucide-react"
import Tooltip from "@/components/Tooltip" // Import your Tooltip component

// Define icon keys and map type
export type IconKey = "CalendarIcon" | "BarChartIcon" | "SettingsIcon";
type IconMap = Record<IconKey, React.ReactNode>;

interface TabConfig {
  name: string;
  roles: string[];
  iconKey?: IconKey;
  disabled?: boolean;
  tooltip?: string;
}

interface MenutabsProps {
  userRole: string;
  tabsConfig: TabConfig[];
  onTabChange: (tabName: string) => void;
  defaultTab?: string;
}

// Icon mapping with explicit typing
const iconMap: IconMap = {
  "CalendarIcon": <CalendarIcon className="w-4 h-4" />,
  "BarChartIcon": <BarChartIcon className="w-4 h-4" />,
  "SettingsIcon": <SettingsIcon className="w-4 h-4" />,
};

export default function Menutabs({
  userRole,
  tabsConfig,
  onTabChange,
  defaultTab,
}: MenutabsProps) {
  const tabs = tabsConfig.filter(tab => tab.roles.includes(userRole));
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(() => {
    const defaultIndex = defaultTab ? tabs.findIndex(tab => tab.name === defaultTab) : 0;
    return defaultIndex >= 0 ? defaultIndex : 0;
  });
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTabClick = (index: number) => {
    if (!tabs[index].disabled) {
      setActiveIndex(index);
      onTabChange(tabs[index].name);
    }
  };

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` });
    }
  }, [activeIndex]);

  return (
    <Card className="h-[50px] border-none shadow-none relative flex items-center">
      <CardContent className="p-0">
        <div className="relative">
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-[6px] flex items-center"
            style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
          />
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={activeStyle}
          />
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <Tooltip
                key={index}
                content={tab.tooltip || ""} 
                position="top"
                delay={1000}
              >
                <div
                  ref={(el) => {
                    if (el) tabRefs.current[index] = el;
                  }}
                  className={`px-3 py-2 transition-colors duration-300 h-[30px] flex items-center justify-center
                    ${tab.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    ${index === activeIndex ? "text-[#0e0e10]" : "text-[#0e0f1199]"}`}
                  onMouseEnter={() => !tab.disabled && setHoveredIndex(index)}
                  onMouseLeave={() => !tab.disabled && setHoveredIndex(null)}
                  onClick={() => handleTabClick(index)}
                >
                  <div className="text-sm leading-5 whitespace-nowrap flex items-center gap-2 h-full">
                    {tab.iconKey && iconMap[tab.iconKey] && (
                      <span className={index === activeIndex ? "text-[#0e0e10]" : "text-[#0e0f1199]"}>
                        {iconMap[tab.iconKey]}
                      </span>
                    )}
                    <span>{tab.name}</span>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}