"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup type="single" className="flex flex-wrap">
          <ToggleGroupItem value="nofrills" aria-label="Toggle bold">
            No Frills
          </ToggleGroupItem>
          <ToggleGroupItem value="Freshco" aria-label="Toggle italic">
            Freshco
          </ToggleGroupItem>
          <ToggleGroupItem value="batala" aria-label="Toggle underline">
            batala
          </ToggleGroupItem>
          <ToggleGroupItem value="walmart" aria-label="Toggle underline">
            walmart
          </ToggleGroupItem>
          <ToggleGroupItem value="tim" aria-label="Toggle underline">
            tim
          </ToggleGroupItem>
          <ToggleGroupItem value="yal" aria-label="Toggle underline">
            yal
          </ToggleGroupItem>
          <ToggleGroupItem value="fusion" aria-label="Toggle underline">
            fusion
          </ToggleGroupItem>
          <ToggleGroupItem value="jianhing" aria-label="Toggle underline">
            jian Hing
          </ToggleGroupItem>
        </ToggleGroup>

        <Input  type="number"/>

        <Calendar
            mode="single"
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
          />
        </CardContent>
        <CardFooter>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
