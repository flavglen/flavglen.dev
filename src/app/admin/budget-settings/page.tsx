"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { categoryPatterns } from "@/lib/categories";
import { Save, Loader2 } from "lucide-react";

// Extract unique categories from categoryPatterns
const categories = Array.from(
  new Set([
    ...categoryPatterns.map((p) => p.category),
    "Others", // Add Others category
  ])
).sort();

export default function BudgetSettingsPage() {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load budgets on mount
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/protected/budgets");
      const result = await response.json();

      if (response.ok) {
        setBudgets(result.data || {});
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load budget settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budget settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setBudgets((prev) => ({
      ...prev,
      [category]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Filter out zero values and ensure all values are numbers
      const budgetsToSave: Record<string, number> = {};
      Object.entries(budgets).forEach(([category, amount]) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount));
        if (!isNaN(numAmount) && numAmount > 0) {
          budgetsToSave[category] = numAmount;
        }
      });

      console.log("Saving budgets:", budgetsToSave);

      const response = await fetch("/api/protected/budgets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budgets: budgetsToSave }),
      });

      const result = await response.json();
      console.log("Save response:", { status: response.status, result });

      if (response.ok) {
        // Update local state with saved data
        setBudgets(result.data || budgetsToSave);
        toast({
          title: "Success",
          description: "Budget settings saved successfully",
        });
      } else {
        console.error("Save failed:", result);
        toast({
          title: "Error",
          description: result.error || "Failed to save budget settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save budgets:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save budget settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 sm:py-8 px-2 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 sm:py-8 px-2 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Budget Settings</h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Set monthly budgets for each expense category to track your spending.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>
              Enter monthly budget amounts for each category. Leave empty or set to 0 to disable budget tracking for that category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <Label htmlFor={category}>{category}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={category}
                      type="number"
                      min="0"
                      step="0.01"
                      value={budgets[category] || ""}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Budgets
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={loadBudgets}
                disabled={saving || loading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

