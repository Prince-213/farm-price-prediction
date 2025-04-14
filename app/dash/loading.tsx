import { Loader } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className=" w-full h-screen flex items-center justify-center">
      <Loader className=" animate-spin" />
    </div>
  );
}
