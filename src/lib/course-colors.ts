// Course color system for visual distinction
export type CourseName = "FIN 1" | "TOM" | "FRC" | "MKT" | "LEAD" | "STRAT";

export interface CourseColor {
  bg: string; // Background color for cards
  border: string; // Border color
  text: string; // Text color for course name
  accent: string; // Accent color for case badges
  light: string; // Light version for hover states
}

export interface MobileColorOptions {
  touchFeedback: string;
  focus: string;
}

const colorThemes: Map<string, CourseColor> = new Map();
colorThemes.set("FIN 1", {
  bg: "bg-blue-50",
  border: "border-blue-200",
  text: "text-blue-900",
  accent: "bg-blue-100 text-blue-700",
  light: "hover:bg-blue-100",
});

colorThemes.set("TOM", {
  bg: "bg-green-50",
  border: "border-green-200",
  text: "text-green-900",
  accent: "bg-green-100 text-green-700",
  light: "hover:bg-green-100",
});

colorThemes.set("FRC", {
  bg: "bg-orange-50",
  border: "border-orange-200",
  text: "text-orange-900",
  accent: "bg-orange-100 text-orange-700",
  light: "hover:bg-orange-100",
});

colorThemes.set("MKT", {
  bg: "bg-red-50",
  border: "border-red-200",
  text: "text-red-900",
  accent: "bg-red-100 text-red-700",
  light: "hover:bg-red-100",
});

colorThemes.set("LEAD", {
  bg: "bg-indigo-50",
  border: "border-indigo-200",
  text: "text-indigo-900",
  accent: "bg-indigo-100 text-indigo-700",
  light: "hover:bg-indigo-100",
});

colorThemes.set("STRAT", {
  bg: "bg-yellow-50",
  border: "border-yellow-200",
  text: "text-yellow-900",
  accent: "bg-yellow-100 text-yellow-700",
  light: "hover:bg-yellow-100",
});

colorThemes.set("DEFAULT", {
  bg: "bg-gray-50",
  border: "border-gray-200",
  text: "text-gray-900",
  accent: "bg-gray-100 text-gray-700",
  light: "hover:bg-gray-100",
});
// colorThemes.set('PINK', {
//   bg: 'bg-pink-50',
//   border: 'border-pink-200',
//   text: 'text-pink-900',
//   accent: 'bg-pink-100 text-pink-700',
//   light: 'hover:bg-pink-100'
// })

// colorThemes.set('PURPLE', {
//   bg: 'bg-purple-50',
//   border: 'border-purple-200',
//   text: 'text-purple-900',
//   accent: 'bg-purple-100 text-purple-700',
//   light: 'hover:bg-purple-100'
// })

// Get consistent color theme for a course name
export function getCourseColor(courseName: string): CourseColor {
  return colorThemes.get(courseName) || colorThemes.get("DEFAULT")!;
}

// Helper function to get course color classes as a string
export function getCourseColorClasses(courseName: string) {
  const colors = getCourseColor(courseName);
  return {
    card: `${colors.bg} ${colors.border}`,
    title: colors.text,
    case: colors.accent,
    hover: colors.light,
    // Mobile-specific classes for better touch interaction
    mobile: `active:scale-98 transition-transform duration-150 ${colors.light}`,
    focus: "focus:ring-2 focus:ring-offset-2 focus:outline-none",
  };
}
