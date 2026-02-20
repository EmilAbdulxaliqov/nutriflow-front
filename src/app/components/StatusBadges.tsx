import { Badge } from "../components/ui/badge";

type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
type MenuStatus = "DRAFT" | "SUBMITTED" | "PREPARING" | "APPROVED" | "REJECTED" | "CANCELLED";
type DeliveryStatus = "PENDING" | "IN_PROGRESS" | "READY" | "ON_THE_WAY" | "DELIVERED" | "FAILED";
type UserLifecycle = "REGISTERED" | "VERIFIED" | "DATA_SUBMITTED" | "ACTIVE" | "EXPIRED";

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const variants: Record<SubscriptionStatus, { variant: any; className?: string }> = {
    ACTIVE: { variant: "default", className: "bg-success text-success-foreground" },
    EXPIRED: { variant: "secondary" },
    CANCELLED: { variant: "destructive" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
}

export function MenuStatusBadge({ status }: { status: MenuStatus }) {
  const variants: Record<MenuStatus, { variant: any; className?: string }> = {
    DRAFT: { variant: "outline" },
    SUBMITTED: { variant: "secondary", className: "bg-info-light text-info" },
    PREPARING: { variant: "secondary", className: "bg-warning-light text-warning" },
    APPROVED: { variant: "default", className: "bg-success text-success-foreground" },
    REJECTED: { variant: "destructive" },
    CANCELLED: { variant: "secondary" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
}

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const variants: Record<DeliveryStatus, { variant: any; className?: string }> = {
    PENDING: { variant: "outline" },
    IN_PROGRESS: { variant: "secondary", className: "bg-info-light text-info" },
    READY: { variant: "secondary", className: "bg-warning-light text-warning" },
    ON_THE_WAY: { variant: "secondary", className: "bg-primary-light text-primary" },
    DELIVERED: { variant: "default", className: "bg-success text-success-foreground" },
    FAILED: { variant: "destructive" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function UserLifecycleBadge({ status }: { status: UserLifecycle }) {
  const variants: Record<UserLifecycle, { variant: any; className?: string }> = {
    REGISTERED: { variant: "outline" },
    VERIFIED: { variant: "secondary", className: "bg-info-light text-info" },
    DATA_SUBMITTED: { variant: "secondary", className: "bg-warning-light text-warning" },
    ACTIVE: { variant: "default", className: "bg-success text-success-foreground" },
    EXPIRED: { variant: "secondary" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
