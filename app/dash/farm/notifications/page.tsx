"use client";

import { Bell, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/lib/components/custombadge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import { formatDate } from "@/lib/utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NotificationsPage() {
  // Mock data for crop price notifications

  const { data, error, isLoading } = useSWR("/api/notifications", fetcher, {
    refreshInterval: 1
  });

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Crop Price Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on price changes for agricultural commodities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Crops</DropdownMenuItem>
              <DropdownMenuItem>Price Increases</DropdownMenuItem>
              <DropdownMenuItem>Price Decreases</DropdownMenuItem>
              <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-9">
            <Bell className="mr-2 h-4 w-4" />
            Manage Alerts
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Updates</TabsTrigger>
          <TabsTrigger value="increases">Price Increases</TabsTrigger>
          <TabsTrigger value="decreases">Price Decreases</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {error || isLoading ? (
            <div className=" w-full h-[70vh] rounded-lg bg-gray-200 animate-pulse"></div>
          ) : (
            data?.data.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="increases" className="space-y-4">
          {error || isLoading ? (
            <div className=" w-full h-[70vh] rounded-lg bg-gray-200 animate-pulse"></div>
          ) : (
            data?.data
              .filter((notification) => notification.isIncrease)
              ?.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
          )}
        </TabsContent>
        <TabsContent value="decreases" className="space-y-4">
          {error || isLoading ? (
            <div className=" w-full h-[70vh] rounded-lg bg-gray-200 animate-pulse"></div>
          ) : (
            data?.data
              .filter((notification) => !notification.isIncrease)
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function NotificationCard({ notification }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`mt-1 p-2 rounded-full ${notification.isIncrease ? "bg-green-100" : "bg-red-100"}`}
            >
              {notification.isIncrease ? (
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg capitalize">
                  {notification.crop}
                </h3>
                <Badge
                  variant={notification.isIncrease ? "success" : "destructive"}
                  className="text-xs"
                >
                  {Math.ceil(notification.percentChange)} %
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  ₦{notification.previousPrice} → ₦{notification.currentPrice}
                </p>
                <p
                  className={`text-sm font-medium ${notification.isIncrease ? "text-green-600" : "text-red-600"}`}
                >
                  ₦{notification.priceChange}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDate(notification.timestamp)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
