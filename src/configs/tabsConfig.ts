import { IconKey } from "@/components/menutabs";

export const DayOffTabsConfig = [
  {
    name: "Leave History",
    roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
    iconKey: "CalendarIcon" as IconKey,
    tooltip: "View leave history",
  },
  {
    name: "Reports",
    roles: ["MANAGER", "ADMIN", "HR"],
    iconKey: "BarChartIcon" as IconKey,
    tooltip: "Generate reports",
  },
  {
    name: "Settings",
    roles: ["ADMIN"],
    iconKey: "SettingsIcon" as IconKey,
    disabled: true,
    tooltip: "Configure settings (currently disabled)",
  },
];