const STATUS_CLASS = {
  Scheduled: 'status-scheduled',
  'In Progress': 'status-in-progress',
  Completed: 'status-completed',
  Missed: 'status-missed',
  Submitted: 'status-submitted',
  Verified: 'status-verified',
};

export default function StatusBadge({ status }) {
  const className = STATUS_CLASS[status] || 'status-submitted';
  return <span className={`status-badge ${className}`}>{status}</span>;
}
