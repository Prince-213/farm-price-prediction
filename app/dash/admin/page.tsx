"use client";

import { useActionState, useEffect, useState } from "react";
import { Search, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import useSWR from "swr";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { updatePrice } from "@/lib/actions";
import { toast } from "sonner";

const initialState = {
  message: ""
};

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function AdminDashboard() {
  // Sample data for farm produce prices

  // State for editing

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProduce, setSelectedProduce] = useState("");

  // Add new produce

  // Delete produce

  const {
    data: priceData,
    error: priceError,
    isLoading: priceLoading
  } = useSWR("/api/prices", fetcher, {
    refreshInterval: 10
  });

  // Filter produce data based on search and category

  console.log(priceData);

  const [state, formAction, pending] = useActionState(
    updatePrice,
    initialState
  );

  useEffect(() => {
    if (state.message == "success") {
      toast.success("Price updated successfully");
    } else if (state.message == "unsuccess") {
      toast.error("Error updating price");
    }
  }, [state]);

  // Featured produce (top 4 by price change)

  return (
    <div className="flex h-screen overflow-y-scroll w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and update farm produce prices
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            {priceLoading || priceError || priceData == null ? (
              <div className=" w-full h-28 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {priceData?.data.map((produce) => (
                  <Card key={produce.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm capitalize font-medium">
                        {produce.crop}
                      </CardTitle>
                      {/* <Badge
                      variant={
                        produce.trend === "up" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {produce.change}
                    </Badge> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(produce.pricePerKg)}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Per unit
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {formatDate(produce.lastUpdated)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manage Produce Prices</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search produce..."
                          className="w-[200px] pl-8 md:w-[260px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                      <div>Produce</div>
                      <div>Current Price</div>
                      <div>Unit</div>
                      <div>Season</div>
                      <div>Last Updated</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {priceLoading || priceError ? (
                      <div></div>
                    ) : (
                      <div className="divide-y">
                        {priceData?.data.map((produce) => (
                          <div
                            key={produce.id}
                            className="grid grid-cols-6 items-center px-4 py-3"
                          >
                            <>
                              <div className="font-medium capitalize">
                                {produce.crop}
                              </div>
                              <div>{formatCurrency(produce.pricePerKg)}</div>
                              <div>kg</div>
                              <div className={"text-green-500 capitalize"}>
                                {produce.season}
                              </div>
                              <div>{formatDate(produce.lastUpdated)}</div>

                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedProduce(produce.crop);
                                      }}
                                    >
                                      <Edit className="h-8 w-8 text-green-500" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader className=" space-y-2">
                                      <DialogTitle>
                                        Put in the new price of{" "}
                                        <span className=" uppercase">
                                          {selectedProduce}
                                        </span>
                                      </DialogTitle>
                                      <DialogDescription className=" ">
                                        <form
                                          action={formAction}
                                          method="POST"
                                          className=" space-y-2"
                                        >
                                          <Input type="number" name="amount" />
                                          <input
                                            type="text"
                                            className=" hidden"
                                            value={produce.crop}
                                            name="crop"
                                          />
                                          <Button>
                                            {pending
                                              ? "Updating..."
                                              : "Update Price"}
                                          </Button>
                                        </form>
                                      </DialogDescription>
                                      <DialogFooter>
                                        By completing this action you will
                                        update the price of the farm produce per
                                        Kg and farmers in the system will be
                                        notified
                                      </DialogFooter>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
