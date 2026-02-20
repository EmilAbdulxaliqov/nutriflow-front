import { FileX, Package, Search, Users } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-muted-foreground mb-4">
        {icon || <Package className="size-16" />}
      </div>
      <h3 className="mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-center max-w-md mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

export function NoMenuYet() {
  return (
    <EmptyState
      icon={<FileX className="size-16" />}
      title="No menu yet"
      description="Your personalized monthly menu is being prepared. This usually takes 24-48 hours after health data submission."
    />
  );
}

export function NoDeliveriesToday() {
  return (
    <EmptyState
      icon={<Package className="size-16" />}
      title="No deliveries today"
      description="There are no scheduled deliveries for today."
    />
  );
}

export function NoPatients() {
  return (
    <EmptyState
      icon={<Users className="size-16" />}
      title="No patients assigned"
      description="You don't have any patients assigned yet."
    />
  );
}

export function NoResultsFound() {
  return (
    <EmptyState
      icon={<Search className="size-16" />}
      title="No results found"
      description="Try adjusting your search or filters."
    />
  );
}
