import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AlertCircle, Mail, FileText, AlertTriangle, Database, Trash2, Activity, Users } from "lucide-react";
import { toast } from "sonner";

const schedulerTools = [
  {
    title: "Email Tests",
    description: "Test email notification systems",
    actions: [
      { label: "Test Email", icon: Mail, action: "test-email" },
      { label: "Test Admin Report", icon: FileText, action: "test-admin-report" },
    ],
  },
  {
    title: "Subscription Management",
    description: "Test subscription lifecycle and warnings",
    actions: [
      { label: "Test Warning", icon: AlertTriangle, action: "test-subscription-warning" },
      { label: "Create Test Sub", icon: Users, action: "create-test-subscription" },
      { label: "Create Expiring Sub", icon: AlertCircle, action: "create-expiring-subscription" },
      { label: "Create Expired Sub", icon: AlertCircle, action: "create-expired-subscription" },
      { label: "Deactivate", icon: Trash2, action: "subscription-deactivate" },
      { label: "Subscription Count", icon: Activity, action: "subscription-count" },
    ],
  },
  {
    title: "System Maintenance",
    description: "Database and cache management tools",
    actions: [
      { label: "Redis Stats", icon: Database, action: "redis-stats" },
      { label: "Database Cleanup", icon: Database, action: "database-cleanup" },
      { label: "Cleanup Test Data", icon: Trash2, action: "cleanup-test-data" },
    ],
  },
  {
    title: "Scheduler Status",
    description: "Monitor background jobs and schedulers",
    actions: [
      { label: "Scheduler Status", icon: Activity, action: "scheduler-status" },
    ],
  },
];

export default function AdminTools() {
  const handleAction = (action: string, label: string) => {
    toast.success(`${label} executed successfully`, {
      description: `Action: ${action}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Tools</h1>
        <p className="text-muted-foreground mt-1">
          Scheduler tests and system utilities
        </p>
      </div>

      <div className="space-y-4">
        {schedulerTools.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {section.actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.action}
                      variant="outline"
                      onClick={() => handleAction(action.action, action.label)}
                    >
                      <Icon className="size-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warning bg-warning-light">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-warning mt-1" />
            <div>
              <CardTitle>Warning</CardTitle>
              <CardDescription className="text-foreground/80">
                These tools execute real system operations in a test environment. Use with caution and monitor the results in activity logs.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
