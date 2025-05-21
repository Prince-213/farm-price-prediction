"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { useActionState } from "react";
import { predictPrice } from "@/lib/actions";

/* interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
} */

const initialState = {
  prediction: null as number | null,
  error: null as string | null,
  message: ""
};

// Mapping objects for form values to model numeric inputs
const regionMapping = {
  West: 0,
  South: 1,
  North: 2,
  East: 3
};

const weatherMapping = {
  Cloudy: 0,
  Rainy: 1,
  Sunny: 2
};

const cropMapping = {
  Cotton: 0,
  Rice: 1,
  Barley: 2,
  Soybean: 3,
  Wheat: 4,
  Maize: 5
};

const soilMapping = {
  Sandy: 0,
  Clay: 1,
  Loam: 2,
  Silt: 3,
  Peaty: 4
};

export default function PredictionModal({ isOpen, onClose }) {
  const [showResults, setShowResults] = useState(false);
  const [state, formAction, isPending] = useActionState(
    predictPrice,
    initialState
  );

  useEffect(() => {
    if (state.prediction !== null) {
      setShowResults(true);
      onClose();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleClose = () => {
    setShowResults(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Crop Yield</DialogTitle>
            <DialogDescription>
              Enter agricultural details to predict crop yield potential.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Region
                </Label>
                <Select required name="region">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(regionMapping).map(([name, value]) => (
                      <SelectItem key={name} value={`${value}`}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="soil_type" className="text-right">
                  Soil Type
                </Label>
                <Select required name="soil_type">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(soilMapping).map(([name, _]) => (
                      <SelectItem key={name} value={`${_}`}>
                        {name} {_}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="crop" className="text-right">
                  Crop
                </Label>
                <Select required name="crop">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(cropMapping).map(([name, _]) => (
                      <SelectItem key={name} value={`${_}`}>
                        {name} {_}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rainfall" className="text-right">
                  Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  min="-10"
                  max="50"
                  step="0.1"
                  required
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fertilizer" className="text-right">
                  Fertilizer Used
                </Label>
                <Select required name="fertilizer">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Yes</SelectItem>
                    <SelectItem value="1">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="irrigation" className="text-right">
                  Irrigation Used
                </Label>
                <Select required name="irrigation">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Yes</SelectItem>
                    <SelectItem value="1">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weather" className="text-right">
                  Weather Condition
                </Label>
                <Select required name="weather">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(weatherMapping).map(([name, _]) => (
                      <SelectItem key={name} value={`${_}`}>
                        {name} {_}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="harvest" className="text-right">
                  Days to Harvest
                </Label>
                <Input
                  id="harvest"
                  name="harvest"
                  type="number"
                  min="1"
                  required
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Predicting..." : "Predict Yield"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showResults} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Prediction Results</DialogTitle>
            <DialogDescription>
              {"Here's"} the predicted yield for your crop
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">
                Estimated Value: ₦
                {state?.prediction?.toLocaleString() ?? ""}{" "}
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">
                This prediction is based on the input parameters you provided.
              </p>
              <p className="text-sm text-gray-500">
                For optimal results, consider consulting with an agricultural
                expert.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
