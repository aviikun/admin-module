export type Status = "Verified" | "Pending" | "Flagged";
export type SyncStatus = "Synced" | "Offline Sync Pending" | "Failed";

export type Inspection = {
  id: string;
  organization: string;
  organizationId: string;
  inspector: string;
  date: string;
  time: string;
  gps: "Verified" | "Outside radius" | "Pending";
  photo: "Captured" | "Pending";
  status: Status;
  sync: SyncStatus;
  duration: string;
  distance: string;
  coordinates: string;
  evidenceId: string;
};

export const inspections: Inspection[] = [
  { id: "SD-INS-2026-0842", organization: "Seva Foundation", organizationId: "seva-foundation", inspector: "Aarav Mehta", date: "27 Sep 2026", time: "09:42", gps: "Verified", photo: "Captured", status: "Verified", sync: "Synced", duration: "48 min", distance: "18 m", coordinates: "28.6139° N, 77.2090° E", evidenceId: "EV-842-A7F" },
  { id: "SD-INS-2026-0841", organization: "Udaan Welfare Society", organizationId: "udaan-welfare", inspector: "Meera Nair", date: "27 Sep 2026", time: "08:15", gps: "Verified", photo: "Captured", status: "Pending", sync: "Synced", duration: "52 min", distance: "24 m", coordinates: "28.5355° N, 77.3910° E", evidenceId: "EV-841-K2C" },
  { id: "SD-INS-2026-0838", organization: "Jan Kalyan Trust", organizationId: "jan-kalyan", inspector: "Vikram Singh", date: "26 Sep 2026", time: "15:30", gps: "Outside radius", photo: "Captured", status: "Flagged", sync: "Synced", duration: "31 min", distance: "184 m", coordinates: "28.7041° N, 77.1025° E", evidenceId: "EV-838-P9D" },
  { id: "SD-INS-2026-0836", organization: "Shakti Rural Development Centre", organizationId: "shakti-rural", inspector: "Nisha Verma", date: "26 Sep 2026", time: "12:10", gps: "Verified", photo: "Captured", status: "Verified", sync: "Offline Sync Pending", duration: "1 hr 04 min", distance: "12 m", coordinates: "28.4595° N, 77.0266° E", evidenceId: "EV-836-M4J" },
  { id: "SD-INS-2026-0831", organization: "Hope Community Foundation", organizationId: "hope-community", inspector: "Rohan Kapoor", date: "25 Sep 2026", time: "10:05", gps: "Verified", photo: "Pending", status: "Pending", sync: "Offline Sync Pending", duration: "44 min", distance: "35 m", coordinates: "28.4089° N, 77.3178° E", evidenceId: "EV-831-Q5S" },
];

export const organizations = [
  { id: "seva-foundation", name: "Seva Foundation", reg: "NGO-DL-2018-0421", location: "New Delhi", last: "27 Sep 2026", next: "Window assigned", verification: "Verified", risk: "Low attention", count: 24 },
  { id: "udaan-welfare", name: "Udaan Welfare Society", reg: "NGO-UP-2020-1178", location: "Noida, Uttar Pradesh", last: "27 Sep 2026", next: "Review pending", verification: "Pending", risk: "Review", count: 16 },
  { id: "jan-kalyan", name: "Jan Kalyan Trust", reg: "NGO-DL-2016-0892", location: "North Delhi", last: "26 Sep 2026", next: "Randomized", verification: "Flagged", risk: "High attention", count: 31 },
  { id: "shakti-rural", name: "Shakti Rural Development Centre", reg: "NGO-HR-2019-0634", location: "Gurugram, Haryana", last: "26 Sep 2026", next: "Sync pending", verification: "Verified", risk: "Low attention", count: 19 },
  { id: "hope-community", name: "Hope Community Foundation", reg: "NGO-UP-2021-1430", location: "Greater Noida, Uttar Pradesh", last: "25 Sep 2026", next: "Not scheduled", verification: "Pending", risk: "Review", count: 12 },
];

export const analytics = [
  { day: "1 Sep", total: 8, verified: 6, pending: 2, random: 3, flagged: 0 },
  { day: "5 Sep", total: 12, verified: 9, pending: 3, random: 5, flagged: 1 },
  { day: "9 Sep", total: 10, verified: 8, pending: 2, random: 4, flagged: 1 },
  { day: "13 Sep", total: 16, verified: 13, pending: 3, random: 7, flagged: 0 },
  { day: "17 Sep", total: 13, verified: 11, pending: 2, random: 6, flagged: 1 },
  { day: "21 Sep", total: 15, verified: 12, pending: 3, random: 8, flagged: 2 },
  { day: "27 Sep", total: 12, verified: 10, pending: 2, random: 5, flagged: 0 },
];

export const randomSchedule = [
  { id: "RS-219", organization: "Hope Community Foundation", inspector: "Rohan Kapoor", window: "28 Sep · 08:00–12:00", frequency: "Quarterly", state: "Upcoming" },
  { id: "RS-218", organization: "Jan Kalyan Trust", inspector: "Vikram Singh", window: "28 Sep · 13:00–17:00", frequency: "Monthly", state: "Upcoming" },
  { id: "RS-214", organization: "Seva Foundation", inspector: "Aarav Mehta", window: "27 Sep · 08:00–11:00", frequency: "Quarterly", state: "Completed" },
  { id: "RS-211", organization: "Udaan Welfare Society", inspector: "Meera Nair", window: "26 Sep · 09:00–13:00", frequency: "Bi-monthly", state: "Completed" },
];

export const timeline = [
  ["Random inspection scheduled", "26 Sep 2026 · 18:00", "System-generated time window"],
  ["Inspector notified", "27 Sep 2026 · 08:02", "Assignment delivered securely"],
  ["Inspector reached location", "27 Sep 2026 · 09:39", "Arrival registered"],
  ["GPS detected", "27 Sep 2026 · 09:40", "Within 18 m of registered location"],
  ["Live photo captured", "27 Sep 2026 · 09:42", "Captured during inspection"],
  ["Inspection completed", "27 Sep 2026 · 10:30", "Digital record submitted"],
  ["Evidence synchronized", "27 Sep 2026 · 10:31", "Secure upload completed"],
  ["Authority reviewed record", "27 Sep 2026 · 11:05", "Evidence layers verified"],
] as const;
