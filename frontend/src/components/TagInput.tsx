import { useState } from "react";
import type { KeyboardEvent } from "react";

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const clean = input.trim().toLowerCase();
    if (clean && !tags.includes(clean) && tags.length < 10) {
      onChange([...tags, clean]);
      setInput("");
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !input) onChange(tags.slice(0, -1));
  };

  return (
    <div className="flex flex-wrap gap-1 border border-gray-400 rounded p-2 bg-white flex-1 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
      {tags.map(t => (
        <span key={t} className="bg-black text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          {t}
          <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-gray-300">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addTag}
        placeholder="Add tag, press Enter..."
        className="outline-none text-sm text-black py-1 flex-1 min-w-20 placeholder-gray-800"
      />
    </div>
  );
}