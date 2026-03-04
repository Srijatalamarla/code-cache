import type { Snippet } from "../types/snippet";
import { useDeleteSnippet, useUpdateSnippet } from "../hooks/useSnippets";
import { Star, Trash2 } from "lucide-react";

interface Props {
  snippets: Snippet[];
  selected: Snippet | null;
  onSelect: (s: Snippet) => void;
  onDelete: (id: number) => void;
}

export default function SnippetList({ snippets, selected, onSelect, onDelete }: Props) {
  const del = useDeleteSnippet();
  const update = useUpdateSnippet();

  if (!snippets.length)
    return <p className="text-gray-400 text-base mt-4">No snippets yet.</p>;

  return (
    <div className="flex flex-col gap-2 mt-2">

      {snippets.map(s => (
        <div
          key={s.id}
          onClick={() => onSelect(s)}
          className={`flex items-center justify-between rounded p-2 cursor-pointer border ${
            selected?.id === s.id
              ? "border-black bg-black text-white text-sm font-medium"
              : "border-gray-200 bg-white hover:bg-gray-200"
          }`}
        >
          <div className="flex-1 min-w-0">

            <p className="truncate">{s.title}</p>
            <p className={`text-xs ${selected?.id === s.id ? "text-gray-300" : "text-gray-400"}`}>
                {s.language}
            </p>

          </div>

          <div className="flex items-center gap-1 ml-2">

            <button
              onClick={e => {
                e.stopPropagation();
                update.mutate({ id: s.id, data: { starred: !s.starred } });
              }}
            >
                <Star
                    size={16}
                    className={
                        selected?.id == s.id 
                            ? s.starred ? "fill-white text-white" : "text-white opacity-40"
                            : s.starred ? "fill-black text-black" : "text-gray-300"
                        }
                />
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                del.mutate(s.id, { onSuccess: () =>  { onDelete(s.id); } });
              }}
                className={`text-xs px-1 ${selected?.id === s.id ? "text-gray-300 hover:text-red-400" : "text-gray-400 hover:text-red-500"}`}            >
                <Trash2 size={16} />
                
            </button>
            
          </div>
        </div>
      ))}
    </div>
  );
}