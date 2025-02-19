import { Trash } from "lucide-react";
import type { PropertyItemProps } from "@/types";
import { useEffect, useRef, useState } from "react";

export function PropertyItem({
  propertyKey,
  value,
  onValueChange,
  onKeyChange,
  onDeleteKey,
  error,
  editable = true,
  existingKeys = [],
}: PropertyItemProps & {
  editable?: boolean;
  existingKeys?: string[];
}) {
  const [draftKey, setDraftKey] = useState(propertyKey);
  const prevPropertyKeyRef = useRef(propertyKey);

  useEffect(() => {
    if (prevPropertyKeyRef.current !== propertyKey) {
      setDraftKey(propertyKey);
      prevPropertyKeyRef.current = propertyKey;
    }
  }, [propertyKey]);
  const displayValue =
    value === null || value === undefined ? "" : String(value);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setDraftKey(newKey);
    onKeyChange(propertyKey, newKey);
  };

  return (
    <div className="flex flex-col p-3 rounded-lg border border-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0px_10px_rgba(0,0,0,0.25)] hover:shadow-emerald-500/10 transition-all group bg-zinc-800">
      <div className="flex items-center sm:w-full w-auto flex-1 sm:flex-0">
        <div className="flex-1 flex md:flex-row flex-col items-center md:gap-0 gap-2 md:space-x-2 space-x-0">
          <div className="md:w-2/5 w-full">
            <input
              type="text"
              id="property-key"
              value={draftKey}
              className={`flex- w-auto sm:w-full sm:flex-1 text-emerald-300 text-sm font-medium bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1 ${
                error ? "border border-red-500" : ""
              }`}
              onChange={handleKeyChange}
            />
          </div>
          <span className="text-emerald-300 md:block hidden">|</span>
          <input
            type="text"
            value={displayValue}
            className="md:flex-1 md:w-auto w-full text-zinc-400 text-sm bg-zinc-900 bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1"
            onChange={(e) => onValueChange(propertyKey, e.target.value)}
          />
        </div>
        <button
          onClick={() => onDeleteKey(propertyKey)}
          className="ml-2 text-zinc-400 opacity-100 hover:text-red-400 transition-all"
        >
          <Trash size={14} />
        </button>
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
