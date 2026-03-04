import { useState } from "react";
import { useSnippets } from "./hooks/useSnippets";
import type { Snippet } from "./types/snippet";
import SearchBar from "./components/SearchBar";
import SnippetList from "./components/SnippetList";
import SnippetEditor from "./components/SnippetEditor";
import { Plus } from "lucide-react";

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Snippet | null>(null);
  const { data: snippets = [], isLoading, isError } = useSnippets(search);

  return (
    <div className="min-h-screen bg-white flex flex-col">
        
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-black font-mono text-4xl font-semibold">CodeCache</h1>
        </div>

        <div className="flex flex-1">
          
          {/* Left Panel */}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 flex flex-col p-4 gap-3">

            <SearchBar value={search} onChange={setSearch} />

            <div className="flex items-center justify-between">

              <p className="text-black text-sm font-mono font-medium">Your Snippets</p>

              <button
                onClick={() => setSelected(null)}
                className="text-black hover:bg-gray-100 rounded p-1"
              >
                <Plus size={16} />
              </button>

            </div>

            <div className="flex-1 overflow-y-auto">
              {isError ? ( 
                <p className="text-red-500 text-sm">Failed to load.</p>
              ) : (
                isLoading ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : (
                  <SnippetList
                    snippets={snippets}
                    selected={selected}
                    onSelect={setSelected}
                    onDelete={ (id) => { if(id == selected?.id) setSelected(null) } }
                  />
              ))}
            </div>

          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col">
            <SnippetEditor
              selected={selected}
              onClear={() => setSelected(null)}
            />
          </div>

        </div>
    </div>
  );
}