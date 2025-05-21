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

import { useState } from "react";
import { BarChart } from "lucide-react";
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

import { predictYield } from "@/lib/api";

/* async function handlePrediction() {
  try {
    const input = {
      region: 0, // West
      soil_type: 1, // Clay
      crop: 4, // Wheat
      rainfall: 120.5,
      temperature: 25.0,
      fertilizer: 0, // True
      irrigation: 0, // True
      weather: 2, // Sunny
      days_to_harvest: 90
    };

    const result = await predictYield(input);
    console.log("Prediction:", result.prediction);
    console.log("Human readable:", result.human_readable);
  } catch (error) {
    console.error("Prediction error:", error);
  }
}
 */

async function handlePrediction() {
  try {
    const input = {
      region: 2, // North
      soil_type: 1, // Clay
      crop: 5, // Maize
      rainfall: 120.5,
      temperature: 25.0,
      fertilizer: 0, // True
      irrigation: 0, // True
      weather: 2, // Sunny
      harvest: 90
    };

    const result = await predictYield(input);
    console.log(`Predicted Yield: ${result.yield_tons} tons`);
    console.log(`Estimated Value: ₦${result.naira_value.toLocaleString()}`);
    console.log("Details:", result.human_readable);
  } catch (error) {
    console.error("Prediction error:", error);
  }
}
import useSWR from "swr";
import { formatCurrency } from "@/lib/utils";
import { BarChartComponent } from "@/components/admin-panel/bar-chart-farmer";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, error, isLoading } = useSWR("/api/farmer", fetcher);

  const {
    data: priceData,
    error: priceError,
    isLoading: priceLoading
  } = useSWR("/api/prices", fetcher, {
    refreshInterval: 10
  });

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

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, Farmer
          </h2>
          <Button onClick={() => handlePrediction()}>Test</Button>
          <Button className="ml-auto" onClick={() => setIsModalOpen(true)}>
            Predict New Price
          </Button>
        </div>

        <div className="">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Predictions
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {!error && !isLoading ? (
                  <p> {data?.data.predictions.length} </p>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(Math.random() * 10)}% from last month
              </p>
            </CardContent>
          </Card>
          <br />

          {/* New Tabs for Data Visualization */}
          <Tabs defaultValue="cards" className="w-full">
            <TabsList>
              <TabsTrigger value="cards">Price Cards</TabsTrigger>
              <TabsTrigger value="chart">Price Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="cards">
              {priceData && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {priceData?.data.map((produce) =>
                    priceError || priceLoading ? (
                      <div
                        key={produce.id}
                        className=" w-full h-20 bg-gray-200 animate-pulse"
                      ></div>
                    ) : (
                      <Card key={produce.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm capitalize font-medium">
                            {produce.crop}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatCurrency(produce.pricePerKg)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Per unit
                          </p>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="chart">
              {priceData && <BarChartComponent data={priceData?.data} />}
            </TabsContent>
          </Tabs>
        </div>

        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics">Prediction History</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  A list of all your previous price predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error || isLoading ? (
                  <div className=" w-full h-40 rounded-md bg-gray-200 animate-pulse"></div>
                ) : (
                  <PredictionHistory predictions={data?.data.predictions} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </ContentLayout>
  );
}
