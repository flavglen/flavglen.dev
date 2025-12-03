"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, X } from "lucide-react";
import { BudgetAlert } from "@/hooks/useBudgetAlerts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BudgetAlertComponentProps {
  alerts: BudgetAlert[];
  onDismiss?: () => void;
}

export function BudgetAlertComponent({ alerts, onDismiss }: BudgetAlertComponentProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  if (alerts.length === 0) {
    return null;
  }

  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.has(alert.category)
  );

  if (visibleAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (category: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(category));
  };

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => (
        <Alert
          key={alert.category}
          variant="destructive"
          className="border-2 border-destructive/50 bg-destructive/5 dark:bg-destructive/10"
        >
          <AlertTriangle className="h-5 w-5" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <AlertTitle className="flex items-center gap-2">
                Budget Exceeded: {alert.category}
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    You've spent{" "}
                    <strong className="font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(alert.spent)}
                    </strong>{" "}
                    out of a budget of{" "}
                    <strong className="font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(alert.budget)}
                    </strong>
                  </span>
                </div>
                <div className="text-sm font-medium text-destructive">
                  Over budget by{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(alert.overBudget)}{" "}
                  ({alert.percentage}% of budget)
                </div>
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive/80"
              onClick={() => handleDismiss(alert.category)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}

