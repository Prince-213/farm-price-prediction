"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";

import { useState } from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionModal from "@/components/prediction-modal";
import PredictionHistory from "@/components/prediction-history";

import { AnalyticsChart } from "../../../../components/analytics-chart";

// Mock initial data
const initialPredictions: Prediction[] = [
  {
    id: "1",
    date: "2023-12-10",
    produce: "Tomatoes",
    quantity: 500,
    season: "Summer",
    quality: "Premium",
    predictedPrice: 3.75,
    actualPrice: 3.8
  },
  {
    id: "2",
    date: "2023-12-05",
    produce: "Potatoes",
    quantity: 1000,
    season: "Fall",
    quality: "Standard",
    predictedPrice: 1.25,
    actualPrice: 1.3
  },
  {
    id: "3",
    date: "2023-11-28",
    produce: "Corn",
    quantity: 2000,
    season: "Summer",
    quality: "Premium",
    predictedPrice: 0.45,
    actualPrice: 0.42
  },
  {
    id: "4",
    date: "2023-11-15",
    produce: "Apples",
    quantity: 800,
    season: "Fall",
    quality: "Premium",
    predictedPrice: 2.15,
    actualPrice: 2.25
  },
  {
    id: "5",
    date: "2023-11-01",
    produce: "Carrots",
    quantity: 600,
    season: "Fall",
    quality: "Standard",
    predictedPrice: 1.05,
    actualPrice: 1.0
  }
];

export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictions, setPredictions] =
    useState<Prediction[]>(initialPredictions);

  const addPrediction = (prediction: Prediction) => {
    setPredictions([prediction, ...predictions]);
  };
  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Farm Produce Price Predictor</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <img
              src="/placeholder.svg?height=32&width=32"
              width="32"
              height="32"
              className="rounded-full"
              alt="User"
            />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, Farmer
          </h2>
          <Button className="ml-auto" onClick={() => setIsModalOpen(true)}>
            Predict New Price
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Predictions
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{predictions.length}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 10)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Accuracy
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Trend</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+4.3%</div>
              <p className="text-xs text-muted-foreground">
                Increasing trend for your crops
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">Prediction History</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-4">
            <div className="h-[400px]">
              <AnalyticsChart />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  A list of all your previous price predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionHistory predictions={predictions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addPrediction}
      />
    </ContentLayout>
  );
}
