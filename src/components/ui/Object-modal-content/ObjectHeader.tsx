// components/Object-modal-content/ObjectHeader.tsx
import { ArrowUpDown } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import type { SubscriptionPlan } from "@/types";

interface ObjectHeaderProps {
  name: string; // Changed to required string
  sortAscending: boolean;
  setSortAscending: (value: boolean) => void;
  userPlan: SubscriptionPlan;
}

export function ObjectHeader({
  name,
  sortAscending,
  setSortAscending,
  userPlan,
}: ObjectHeaderProps) {
  const handleSimpleObjectCreate = () => {
    console.log("Creating simple object");
    // Add logic to create a simple object
  };

  const handleApiIntegrationCreate = () => {
    console.log("Creating API integration");
    // Add logic to create an API integration
  };

  return (
    <div className="flex relative flex-col items-start gap-8 justify-center w-full pb-4">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
        {name}
      </h2>
      <div className="relative ml-auto flex justify-between w-full">
        <button
          onClick={() => setSortAscending(!sortAscending)}
          className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all duration-200"
          title={sortAscending ? "Sort Z to A" : "Sort A to Z"}
        >
          <ArrowUpDown
            size={15}
            className={`text-emerald-400/70 transition-all duration-200 ${
              sortAscending ? "" : "rotate-180"
            }`}
          />
          <span className="font-medium group-hover:text-emerald-300">
            Sort {sortAscending ? "a-z" : "z-a"}
          </span>
        </button>
        <PremiumButton
          userPlan={userPlan}
          onSimpleObjectCreate={handleSimpleObjectCreate}
          onApiIntegrationCreate={handleApiIntegrationCreate}
        />
      </div>
    </div>
  );
}
