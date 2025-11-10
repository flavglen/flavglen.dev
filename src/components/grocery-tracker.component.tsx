"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  X
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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [purchasedFilter, setPurchasedFilter] = React.useState<string>("all");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    name: "",
    category: "Other",
    priority: "medium" as const,
    quantity: 1,
    notes: "",
  });
  const [weekId, setWeekId] = React.useState("");

  // Fetch grocery items
  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (purchasedFilter !== "all") {
        params.append("purchased", purchasedFilter === "purchased" ? "true" : "false");
      }
      
      const response = await fetch(`/api/protected/grocery-items?${params.toString()}`);
      const data = await response.json();
      setItems(data.data || []);
      setWeekId(data.weekId || "");
    } catch (error) {
      console.error("Failed to fetch grocery items:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, purchasedFilter]);

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

  // Toggle purchased status
  const togglePurchased = async (item: GroceryItem) => {
    try {
      const response = await fetch("/api/protected/grocery-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          purchased: !item.purchased,
        }),
      });
      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to update item:", error);
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
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to reset items:", error);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  // Statistics
  const stats = {
    total: items.length,
    purchased: items.filter((i) => i.purchased).length,
    remaining: items.filter((i) => !i.purchased).length,
    progress: items.length > 0 ? Math.round((items.filter((i) => i.purchased).length / items.length) * 100) : 0,
  };

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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Weekly Grocery Tracker</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Week: {weekId || "Current Week"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {items.length === 0 && (
            <Button onClick={initializeDefaults} variant="outline" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Initialize Default Items
            </Button>
          )}
          {items.length > 0 && (
            <>
              <Button onClick={() => handleReset(false)} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Purchased
              </Button>
              <Button onClick={() => handleReset(true)} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.purchased}</div>
              <p className="text-xs text-muted-foreground">Purchased</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.remaining}</div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.progress}%</div>
              <p className="text-xs text-muted-foreground">Progress</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All Categories</option>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={purchasedFilter}
                  onChange={(e) => setPurchasedFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All Items</option>
                  <option value="purchased">Purchased</option>
                  <option value="not-purchased">Not Purchased</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
                <CardDescription>
                  {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                        item.purchased
                          ? "bg-muted/50 border-muted"
                          : "bg-background border-border hover:bg-muted/30"
                      )}
                    >
                      <Checkbox
                        checked={item.purchased}
                        onCheckedChange={() => togglePurchased(item)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <label
                              className={cn(
                                "text-base font-medium cursor-pointer block",
                                item.purchased && "line-through text-muted-foreground"
                              )}
                              onClick={() => togglePurchased(item)}
                            >
                              {item.name}
                              {item.quantity && item.quantity > 1 && (
                                <span className="text-muted-foreground ml-2">
                                  (x{item.quantity})
                                </span>
                              )}
                            </label>
                            {item.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.priority && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  PRIORITY_COLORS[item.priority]
                                )}
                              >
                                {item.priority}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteItem(item.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

