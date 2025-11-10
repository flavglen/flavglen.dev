import { GroceryTrackerComponent } from "@/components/grocery-tracker.component";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function GroceryTrackerPage() {
    return (
        <div className="container py-4 sm:py-8 px-2 sm:px-6">
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/dashboard">
                        <Button variant="outline" className="flex items-center gap-2 text-sm">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <h1 className="text-2xl sm:text-3xl font-bold">Grocery Tracker</h1>
                </div>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    Manage your weekly grocery shopping list. Mark items as purchased, add new items, and track your shopping progress.
                </p>
            </div>
            <GroceryTrackerComponent />
        </div>
    );
}

