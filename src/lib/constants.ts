export const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
] as const;

export const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Key format: "M-D" (1-indexed month, no zero-padding) */
export const HOLIDAYS: Record<string, string> = {
  "1-1":   "New Year's Day",
  "1-26":  "Republic Day",
  "3-25":  "Holi",
  "4-14":  "Ambedkar Jayanti",
  "4-18":  "Good Friday",
  "8-15":  "Independence Day",
  "10-2":  "Gandhi Jayanti",
  "11-1":  "Diwali",
  "12-25": "Christmas Day",
};

export const TODAY = new Date();
