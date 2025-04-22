"use client";

import type React from "react";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { predictPrice } from "@/lib/actions";
import { toast } from "sonner";

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState = {
  message: ""
};

export default function PredictionModal({
  isOpen,
  onClose
}: PredictionModalProps) {
  const [state, formAction, pending] = useActionState(
    predictPrice,
    initialState
  );

  useEffect(() => {
    if (state.message == "success") {
      toast.success("Prediction Successful");
    } else if (state.message == "unsuccess") {
      toast.error("Prediction Unsuccessful");
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Predict Produce Price</DialogTitle>
          <DialogDescription>
            Enter the details of your produce to get a price prediction.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} method="POST">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="produce" className="text-right">
                Produce
              </Label>
              <Select required name="crop">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select produce" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                  <SelectItem value="cassava">Cassava</SelectItem>
                  <SelectItem value="yam">Yam</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
                  <SelectItem value="millet">Millet</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="plantain">Plantain</SelectItem>
                  <SelectItem value="groundnut">Groundnut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity (kg)
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="season" className="text-right">
                Season
              </Label>
              <Select required name="season">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planting">Planting</SelectItem>
                  <SelectItem value="harvest">Harvest</SelectItem>
                  <SelectItem value="off-season">Off-Season</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quality" className="text-right">
                Quality
              </Label>
              <Select required name="quality">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="season" className="text-right">
                Period
              </Label>
              <Select required name="period">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="1-2-years">1-2 Years</SelectItem>
                  <SelectItem value="2-5-years">2-5 Years</SelectItem>
                  <SelectItem value="5+-years">5+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Predicting..." : "Predict Price"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
