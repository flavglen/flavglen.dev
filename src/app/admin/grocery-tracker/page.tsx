import { GroceryTrackerComponent } from "@/components/grocery-tracker.component";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GroceryTrackerPage() {
    return (
        <div className="container py-4 sm:py-8 px-2 sm:px-6">
            <div className="mb-4">
                <Link href="/admin/expenses">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Expenses
                    </Button>
                </Link>
            </div>
            <GroceryTrackerComponent />
        </div>
    );
}

