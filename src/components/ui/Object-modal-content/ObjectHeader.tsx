import { ArrowUpDown, Pencil, X } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import type { ObjectHeaderProps } from "@/types";
import { useEffect, useState } from "react";
import PremiumButtonEmpty from "../PremiumButtonEmpty";
import { cn } from "@/lib/utils";

export function ObjectHeader({
  name,
  sortAscending,
  setSortAscending,
  userPlan,
  onApiIntegrationCreate,
  onSimpleObjectCreate,
  onNameChange,
  empty,
}: ObjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    console.log(empty);
  }, [empty]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditedName(newValue);
    if (onNameChange && newValue.trim() !== "") {
      onNameChange(newValue);
    }
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleFinishEditing();
    }
  };

  return (
    <div
      className={cn(
        "flex relative flex-col h-full w-full items-start gap-8 justify-center pb-4 ",
        empty && "flex-grow"
      )}
    >
      <div
        className="flex items-center gap-2 
      "
      >
        {isEditing ? (
          <div className="flex items-center gap-2 max-w-80 ">
            <input
              type="text"
              value={editedName}
              onChange={handleInputChange}
              onBlur={handleFinishEditing}
              onKeyDown={handleKeyDown}
              className="text-2xl flex-grow font-bold bg-transparent border-b -mb-[1px] border-emerald-500/40 px-0 py-0 text-emerald-500 focus:outline-none focus:border-emerald-500/80"
              autoFocus
            />

            <button
              onClick={handleFinishEditing}
              className="p-1 rounded-md bg-transparent text-zinc-400 hover:text-zinc-200 transition-all duration-200"
              title="Concluir edição"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl truncate max-w-[315px]  font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              {name}
            </h2>
            <button
              onClick={handleEditClick}
              className="p-1 rounded-md bg-zinc-800/30 border border-emerald-500/10 text-emerald-400/70 hover:text-emerald-400 hover:bg-zinc-700/50 transition-all duration-200"
              title="Editar nome"
            >
              <Pencil size={16} />
            </button>
          </>
        )}
      </div>
      {empty ? (
        <PremiumButtonEmpty
          userPlan={userPlan}
          onSimpleObjectCreate={onSimpleObjectCreate}
          onApiIntegrationCreate={onApiIntegrationCreate}
        />
      ) : (
        <div className="relative ml-auto flex justify-between w-full">
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="group flex items-center gap-2  px-2.5 py-1.5 rounded-md bg-zinc-800 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-zinc-700 transition-all duration-200"
            title={sortAscending ? "Sort Z to A" : "Sort A to Z"}
          >
            <ArrowUpDown
              size={15}
              className={`text-emerald-400/70 transition-all duration-200 ${
                sortAscending ? "" : "rotate-180"
              }`}
            />
            <span className="font-medium group-hover:text-emerald-300">
              Sort {sortAscending ? "A-Z" : "Z-A"}
            </span>
          </button>
          <PremiumButton
            userPlan={userPlan}
            onSimpleObjectCreate={onSimpleObjectCreate}
            onApiIntegrationCreate={onApiIntegrationCreate}
          />
        </div>
      )}
    </div>
  );
}
