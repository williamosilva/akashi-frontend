import { Save, Trash } from "lucide-react";

interface ObjectActionsProps {
  onSave: () => void;
  onDelete: () => void;
}

export function ObjectActions({ onSave, onDelete }: ObjectActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
      <button
        onClick={onDelete}
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center justify-center"
      >
        <Trash className="mr-1" size={14} />
        Delete Object
      </button>
      <button
        onClick={onSave}
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 text-zinc-900 text-sm font-medium hover:bg-emerald-400 transition-colors flex items-center justify-center"
      >
        <Save className="mr-1" size={14} />
        Save Changes
      </button>
    </div>
  );
}
