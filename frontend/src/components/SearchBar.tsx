import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 focus-within:border-black bg-white">
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Search snippets..."
            className="w-full text-black text-sm outline-none bg-transparent border-none"
        />
        <Search size={14} className="text-gray-400 flex-shrink-0" />
    </div>
  );
}