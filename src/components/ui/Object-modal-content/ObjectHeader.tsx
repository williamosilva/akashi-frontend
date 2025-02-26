import { ArrowUpDown, Pencil, X } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import type { ObjectHeaderProps } from "@/types";
import { useState, useRef, memo } from "react";
import PremiumButtonEmpty from "../PremiumButtonEmpty";
import { cn } from "@/lib/utils";

// Componente separado para o campo de input
const NameEditor = memo(
  ({
    name,
    onFinishEditing,
  }: {
    name: string;
    onFinishEditing: (value: string) => void;
  }) => {
    const [inputLength, setInputLength] = useState(name.length);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFinish = () => {
      const newValue = inputRef.current?.value || "";
      if (newValue.trim() !== "") {
        onFinishEditing(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        handleFinish();
      }
    };

    return (
      <div className="flex items-center gap-2 max-w-96">
        <input
          ref={inputRef}
          type="text"
          defaultValue={name}
          onBlur={handleFinish}
          maxLength={30}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputLength(e.target.value.length)}
          className={cn(
            "text-2xl font-bold bg-transparent border-b -mb-[1px] px-0 py-0 focus:outline-none w-full",
            inputLength >= 30
              ? "border-red-500 text-red-500"
              : "border-emerald-500/40 text-emerald-500 focus:border-emerald-500/80"
          )}
        />
        <div
          className={cn(
            "text-xs mt-1",
            inputLength >= 30 ? "text-red-500" : "text-emerald-500"
          )}
        >
          {inputLength}/30
        </div>
        <button
          onClick={handleFinish}
          className="p-1 rounded-md bg-transparent text-zinc-400 hover:text-zinc-200 transition-all duration-200"
          title="Concluir edição"
        >
          <X size={16} />
        </button>
      </div>
    );
  }
);
NameEditor.displayName = "NameEditor";

// Componente de título memoizado
const MemoizedTitle = memo(
  ({ name, onEditClick }: { name: string; onEditClick: () => void }) => (
    <>
      <h2 className="text-2xl truncate max-w-[350px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
        {name}
      </h2>
      <button
        onClick={onEditClick}
        className="p-1 rounded-md bg-zinc-800/30 border border-emerald-500/10 text-emerald-400/70 hover:text-emerald-400 hover:bg-zinc-700/50 transition-all duration-200"
        title="Editar nome"
      >
        <Pencil size={16} />
      </button>
    </>
  )
);
MemoizedTitle.displayName = "MemoizedTitle";

// Botões de controle memoizados
const MemoizedControls = memo(
  ({
    sortAscending,
    setSortAscending,
    userPlan,
    onSimpleObjectCreate,
    onApiIntegrationCreate,
  }: Pick<
    ObjectHeaderProps,
    | "sortAscending"
    | "setSortAscending"
    | "userPlan"
    | "onSimpleObjectCreate"
    | "onApiIntegrationCreate"
  >) => (
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
          Sort {sortAscending ? "A-Z" : "Z-A"}
        </span>
      </button>
      <PremiumButton
        userPlan={userPlan}
        onSimpleObjectCreate={onSimpleObjectCreate}
        onApiIntegrationCreate={onApiIntegrationCreate}
      />
    </div>
  )
);
MemoizedControls.displayName = "MemoizedControls";

// Componente principal
export function ObjectHeader({
  name,
  sortAscending,
  setSortAscending,
  userPlan,
  onApiIntegrationCreate,
  onSimpleObjectCreate,
  onNameChange,
  empty,
  isLoading,
}: ObjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = (newValue: string) => {
    setIsEditing(false);
    if (onNameChange) {
      onNameChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        "flex relative flex-col h-full w-full items-start gap-8 justify-center pb-4 transition-all duration-300 ",
        empty && "flex-grow ",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-2">
        {isEditing ? (
          <NameEditor name={name} onFinishEditing={handleFinishEditing} />
        ) : (
          <MemoizedTitle name={name} onEditClick={handleEditClick} />
        )}
      </div>
      {empty ? (
        <PremiumButtonEmpty
          userPlan={userPlan}
          onSimpleObjectCreate={onSimpleObjectCreate}
          onApiIntegrationCreate={onApiIntegrationCreate}
        />
      ) : (
        <MemoizedControls
          sortAscending={sortAscending}
          setSortAscending={setSortAscending}
          userPlan={userPlan}
          onSimpleObjectCreate={onSimpleObjectCreate}
          onApiIntegrationCreate={onApiIntegrationCreate}
        />
      )}
    </div>
  );
}
