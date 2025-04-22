"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PredictionHistory({ predictions }) {
  const [sortField, setSortField] = useState<keyof Prediction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const [selected, setSelected] = useState(0);

  const handleSort = (field: keyof Prediction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    if (typeof a[sortField] === "number" && typeof b[sortField] === "number") {
      return sortDirection === "asc"
        ? (a[sortField] as number) - (b[sortField] as number)
        : (b[sortField] as number) - (a[sortField] as number);
    }

    // String comparison
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return (
    <div className="rounded-md border">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prediction Detail</DialogTitle>
            <DialogDescription>
              <div className="space-y-2 text-gray-700 text-lg">
                <p>
                  <span className="font-semibold">Crop:</span>{" "}
                  {predictions[selected].crop}
                </p>
                <p>
                  <span className="font-semibold">Season:</span>{" "}
                  {predictions[selected].season}
                </p>
                <p>
                  <span className="font-semibold">Quality:</span>{" "}
                  {predictions[selected].quality.charAt(0).toUpperCase() +
                    predictions[selected].quality.slice(1)}
                </p>
                <p>
                  <span className="font-semibold">Current Price per Kg:</span>{" "}
                  {predictions[selected].currency}{" "}
                  {predictions[selected].pricePerKg.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Predicted Price per Kg:</span>{" "}
                  {predictions[selected].currency}{" "}
                  {predictions[selected].predictedPrice.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Projected Date:</span>{" "}
                  {new Date(predictions[selected].projectedDate).toDateString()}
                </p>
                <p>
                  <span className="font-semibold">Time Period:</span>{" "}
                  {predictions[selected].timePeriod.replace(/-/g, " to ")}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {predictions[selected].quantity.toLocaleString()} kg
                </p>
                <p>
                  <span className="font-semibold">Total Projected Price:</span>{" "}
                  {predictions[selected].currency}{" "}
                  {predictions[selected].totalPrice.toLocaleString()}
                </p>
                <p className="text-justify">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {predictions[selected].explanation}
                </p>
                <p>
                  <span className="font-semibold">Report Generated On:</span>{" "}
                  {new Date(predictions[selected].timestamp).toUTCString()}
                </p>
                <p>
                  <span className="font-semibold">Farmer ID:</span>{" "}
                  {predictions[selected].farmersId}
                </p>
                <p>
                  <span className="font-semibold">Prediction ID:</span>{" "}
                  {predictions[selected].id}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                className="p-0 h-8"
                onClick={() => handleSort("date")}
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-8"
                onClick={() => handleSort("produce")}
              >
                Produce
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                className="p-0 h-8"
                onClick={() => handleSort("quantity")}
              >
                Quantity (kg)
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Season</TableHead>
            <TableHead className="hidden md:table-cell">Quality</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-8"
                onClick={() => handleSort("predictedPrice")}
              >
                Predicted Price Per Unit
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 h-8"
                onClick={() => handleSort("predictedPrice")}
              >
                Predicted Price Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>

            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPredictions.map((prediction, index) => (
            <TableRow key={prediction?.id} className=" capitalize">
              <TableCell className="font-medium">
                {formatDate(prediction?.timestamp)}
              </TableCell>
              <TableCell className=" capitalize">{prediction?.crop}</TableCell>
              <TableCell className="hidden md:table-cell">
                {prediction?.quantity}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {prediction?.season}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {prediction?.quality}
              </TableCell>
              <TableCell>{formatCurrency(prediction?.pricePerKg)}</TableCell>
              <TableCell>{formatCurrency(prediction.totalPrice)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelected(index);
                        setIsOpen(true);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
