import { cn } from "@/lib/utils";

export type IssueStatus = "pending" | "assigned" | "progress" | "resolved";

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig: Record<
  IssueStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "status-pending",
  },
  assigned: {
    label: "Assigned",
    className: "status-assigned",
  },
  progress: {
    label: "In Progress",
    className: "status-progress",
  },
  resolved: {
    label: "Resolved",
    className: "status-resolved",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.className, className)}>
      {config.label}
    </span>
  );
};
