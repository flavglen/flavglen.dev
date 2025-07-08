"use client"

import React, { useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { fetchExpenses, getCurrentMonthStartEnd } from "@/services/expense"
import { Expense } from "@/components/expense.component"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Food: {
    label: "Food",
    color: "#0088FE",
  },
  safari: {
    label: "Safari",
    color: "#00C49F",
  },
  firefox: {
    label: "Firefox",
    color: "#FFBB28",
  },
  edge: {
    label: "Edge",
    color: "#FF8042",
  },
  other: {
    label: "Other",
    color: "#8884D8",
  },
} satisfies ChartConfig

const DashboardChart = () => {
  const [groupedChartData, setGroupedChartData] = React.useState<any[]>([]);

  const prepareChartData = (expenses: Expense[]) => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    const chartData = Object.values(
      expenses.reduce<Record<string, { category: string; amount: number; fill: string }>>((acc, { category, amount }) => {
        if (!acc[category]) {
          acc[category] = {
            category,
            amount: 0,
            fill: colors[Object.keys(acc).length % colors.length] // assign next color
          };
        }
        acc[category].amount += amount;
        return acc;
      }, {})
    ).map(({ category, amount, fill }: { category: string; amount: number; fill: string }) => ({
      category,
      amount,
      fill
    }));

    setGroupedChartData(chartData)
  }

  useEffect(() => {
    const fetchData = async () => {
      const {dateTo, dateFrom } = getCurrentMonthStartEnd()
      const data =  await fetchExpenses({dateTo: '2025-06-31T04:00:00.000Z', dateFrom: '2025-06-01T04:00:00.000Z' });
      prepareChartData(data);
    }

   void fetchData();
  },[])
  
  const totalVisitors = React.useMemo(() => {
    return groupedChartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [groupedChartData])

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:grid-cols-4">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Monthly Expense BreakUp</CardTitle>
          <CardDescription>June 2025</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={groupedChartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={80}
                strokeWidth={10}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Amount
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            dad <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            dada
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DashboardChart; 