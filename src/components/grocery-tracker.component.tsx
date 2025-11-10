"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  RotateCcw, 
  Trash2,
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  Save,
  Tag
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { GroceryItem } from "@/app/api/protected/grocery-items/route"
import { DEFAULT_CATEGORIES } from "@/lib/grocery-constants"

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800 border-blue-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-red-100 text-red-800 border-red-300",
};

export function GroceryTrackerComponent() {
  const [items, setItems] = React.useState<GroceryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    name: "",
    category: "Other",
    priority: "medium" as const,
    quantity: 1,
    notes: "",
  });
  const [weekId, setWeekId] = React.useState("");
  // Track local changes before saving
  const [pendingChanges, setPendingChanges] = React.useState<Record<string, boolean>>({});
  const [saving, setSaving] = React.useState(false);

  // Fetch grocery items
  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/protected/grocery-items`);
      const data = await response.json();
      setItems(data.data || []);
      setWeekId(data.weekId || "");
      // Clear pending changes when fetching fresh data
      setPendingChanges({});
    } catch (error) {
      console.error("Failed to fetch grocery items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Initialize default items
  const initializeDefaults = async () => {
    try {
      const response = await fetch("/api/protected/grocery-items/init", {
        method: "POST",
      });
      if (response.ok) {
        await fetchItems();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to initialize default items");
      }
    } catch (error) {
      console.error("Failed to initialize defaults:", error);
      alert("Failed to initialize default items");
    }
  };

  // Toggle purchased status (local state only)
  const togglePurchased = (item: GroceryItem) => {
    if (!item.id) return;
    const currentPurchased = pendingChanges[item.id] !== undefined 
      ? pendingChanges[item.id] 
      : item.purchased;
    setPendingChanges(prev => ({
      ...prev,
      [item.id!]: !currentPurchased
    }));
  };

  // Save all pending changes
  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    setSaving(true);
    try {
      // Batch update all changed items
      const updatePromises = Object.entries(pendingChanges).map(([id, purchased]) =>
        fetch("/api/protected/grocery-items", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            purchased,
          }),
        })
      );

      const results = await Promise.all(updatePromises);
      const allSuccessful = results.every(res => res.ok);

      if (allSuccessful) {
        setPendingChanges({});
        await fetchItems();
      } else {
        alert("Some items failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Add new item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    try {
      const response = await fetch("/api/protected/grocery-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setNewItem({
          name: "",
          category: "Other",
          priority: "medium",
          quantity: 1,
          notes: "",
        });
        setShowAddForm(false);
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/protected/grocery-items?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Reset weekly list
  const handleReset = async (clearAll: boolean = false) => {
    const message = clearAll
      ? "Are you sure you want to clear all items for this week?"
      : "Are you sure you want to reset all purchased items?";
    
    if (!confirm(message)) return;

    try {
      const params = new URLSearchParams();
      if (clearAll) {
        params.append("clearAll", "true");
      }
      const response = await fetch(`/api/protected/grocery-items/init?${params.toString()}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPendingChanges({}); // Clear pending changes
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to reset items:", error);
    }
  };

  // Get effective purchased status (pending changes override saved status)
  const getEffectivePurchased = (item: GroceryItem): boolean => {
    if (!item.id) return item.purchased;
    return pendingChanges[item.id] !== undefined 
      ? pendingChanges[item.id] 
      : item.purchased;
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Statistics (using effective purchased status)
  const stats = {
    total: items.length,
    purchased: items.filter((i) => getEffectivePurchased(i)).length,
    remaining: items.filter((i) => !getEffectivePurchased(i)).length,
    progress: items.length > 0 ? Math.round((items.filter((i) => getEffectivePurchased(i)).length / items.length) * 100) : 0,
  };

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading grocery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold">Weekly Grocery Tracker</h2>
          <p className="text-xs text-muted-foreground">
            Week: {weekId || "Current Week"}
            {hasUnsavedChanges && (
              <span className="ml-2 text-orange-600 font-medium">
                • Unsaved changes
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveChanges} 
              disabled={saving}
              size="sm"
              className="bg-primary hover:bg-primary/90 h-8"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
          {items.length === 0 && (
            <Button onClick={initializeDefaults} variant="outline" size="sm" className="h-8">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Initialize Default Items
            </Button>
          )}
          {items.length > 0 && (
            <>
              <Button onClick={() => handleReset(false)} variant="outline" size="sm" className="h-8">
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset Purchased
              </Button>
              <Button onClick={() => handleReset(true)} variant="outline" size="sm" className="h-8">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9"
        />
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Item</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Item Name *</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Milk, Bread"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Input
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Grocery Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No grocery items yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by initializing default items or adding your own.
            </p>
            <Button onClick={initializeDefaults} variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Initialize Default Items
            </Button>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No items match your filters</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Statistics Row */}
                {items.length > 0 && (
                  <div className="grid grid-cols-[auto_1fr_80px_60px] gap-3 px-3 py-2 border-b bg-muted/20 text-xs">
                    <div className="w-8"></div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">Total: <span className="font-medium text-foreground">{stats.total}</span></span>
                      <span className="text-muted-foreground">Purchased: <span className="font-medium text-green-600">{stats.purchased}</span></span>
                      <span className="text-muted-foreground">Remaining: <span className="font-medium text-orange-600">{stats.remaining}</span></span>
                      <span className="text-muted-foreground">Progress: <span className="font-medium text-foreground">{stats.progress}%</span></span>
                    </div>
                    <div></div>
                    <div></div>
                  </div>
                )}
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[auto_1fr_80px_60px] gap-3 px-3 py-1.5 border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                  <div className="w-8"></div>
                  <div>Item</div>
                  <div>Priority</div>
                  <div></div>
                </div>
                {/* Items List */}
                <div className="divide-y">
                  {filteredItems.map((item) => {
                    const effectivePurchased = getEffectivePurchased(item);
                    const hasPendingChange = item.id && pendingChanges[item.id] !== undefined;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "grid grid-cols-[auto_1fr_80px_60px] gap-2 sm:gap-3 px-2 sm:px-3 py-1 transition-colors hover:bg-muted/20",
                          effectivePurchased && "bg-muted/30",
                          hasPendingChange && "ring-1 ring-orange-500/50 ring-inset"
                        )}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={effectivePurchased}
                            onCheckedChange={() => togglePurchased(item)}
                            className="flex-shrink-0 h-4 w-4"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-1.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <label
                                className={cn(
                                  "text-xs sm:text-sm font-medium cursor-pointer leading-tight flex-1 min-w-0",
                                  effectivePurchased && "line-through text-muted-foreground"
                                )}
                                onClick={() => togglePurchased(item)}
                              >
                                {item.name}
                                {item.quantity && item.quantity > 1 && (
                                  <span className="text-muted-foreground ml-1 text-xs">
                                    (x{item.quantity})
                                  </span>
                                )}
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 flex-shrink-0 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Tag className="h-3 w-3 text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" side="right" align="start">
                                  <div className="text-xs font-medium">Category</div>
                                  <div className="text-sm mt-1">{item.category}</div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            {item.notes && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {item.priority && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1 py-0 h-4",
                                PRIORITY_COLORS[item.priority]
                              )}
                            >
                              {item.priority.charAt(0).toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteItem(item.id!)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Item Button */}
      {!showAddForm && (
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            className="rounded-full shadow-lg"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
}

