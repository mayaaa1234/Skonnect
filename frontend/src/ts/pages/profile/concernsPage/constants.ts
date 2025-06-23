const DEFAULT_CONCERN_STATUS = "default";

const STATUSES = [
  { action: "default", label: "Default" },
  { action: "rejected", label: "Reject" },
  { action: "acknowledged", label: "Acknowledge" },
  { action: "in_progress", label: "Process" },
  { action: "resolved", label: "Resolve" },
  { action: "delete", label: "Delete" },
] as const;

const ASIDE_SECTIONS = [
  { action: "rejected", label: "Reject" },
  { action: "acknowledged", label: "Acknowledge" },
  { action: "in_progress", label: "Process" },
  { action: "resolved", label: "Resolve" },
] as const;

export { DEFAULT_CONCERN_STATUS, STATUSES, ASIDE_SECTIONS };
