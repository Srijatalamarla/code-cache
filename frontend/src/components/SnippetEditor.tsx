import { useState, useEffect } from "react";
import type { Snippet, SnippetCreate } from "../types/snippet";
import { SUPPORTED_LANGUAGES } from "../types/snippet";
import { useCreateSnippet, useUpdateSnippet } from "../hooks/useSnippets";
import TagInput from "./TagInput";
import { Check, Copy, RefreshCw } from "lucide-react";

import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { getLanguageExtension } from "../utils/languageExtensions";

interface Props {
  selected: Snippet | null;
  onClear: () => void;
}

const empty: SnippetCreate = {
  title: "",
  code: "",
  language: "python",
  tags: [],
  starred: false,
};

export default function SnippetEditor({ selected, onClear }: Props) {
  const [form, setForm] = useState<SnippetCreate>(empty);
  const [copied, setCopied] = useState(false);
  const create = useCreateSnippet();
  const update = useUpdateSnippet();

  useEffect(() => {

    if (selected) {
      setForm({
        title: selected.title,
        code: selected.code,
        language: selected.language,
        tags: selected.tags,
        starred: selected.starred,
      });
    } else {
      setForm(empty);
    }

  }, [selected]);

  const isValid = form.title.trim() && form.code.trim() && form.language;

  const handleSave = () => {

    if (!isValid) return;

    if (selected) {
      update.mutate({ id: selected.id, data: form }, { onSuccess: onClear });
    } else {
      create.mutate(form, { onSuccess: () => { setForm(empty); onClear(); } });
    }

  };

  const handleCopy = () => {

    navigator.clipboard.writeText(form.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);

  };

  const handleRefresh = () => {

    if (selected) {
      setForm({
        title: selected.title,
        code: selected.code,
        language: selected.language,
        tags: selected.tags,
        starred: selected.starred,
      });
    } else {
      setForm(empty);
    }

  };

  return (
    <div className="flex flex-col h-full">

      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

        <input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Untitled File"
          className="text-black font-mono text-base font-semibold outline-none placeholder-gray-400 bg-transparent"
        />

        <div className="flex gap-2">
          <select
            value={form.language}
            onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            className="bg-white text-black text-sm border border-gray-300 rounded px-2 py-1 outline-none"
          >
            {SUPPORTED_LANGUAGES.map(
              l => 
              <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.substring(1)}
              </option>
            )}
          </select>

          <button
            onClick={handleRefresh}
            className="px-3 py-1 text-black hover:bg-gray-100"
          >
            <RefreshCw size={16}/>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1 text-black hover:bg-gray-100"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {/* {copied ? "Copied!" : "Copy"} */}
          </button>

        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={form.code}
          height="100%"
          theme={oneDark}
          extensions={[getLanguageExtension(form.language)]}
          onChange={value => setForm(f => ({ ...f, code: value }))}
          style={{ height: "100%", fontSize: "16px" }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            tabSize: 2,
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        
        <div className="flex items-center gap-2 flex-1 mr-4">

          <span className="text-gray-800 font-mono">Tags</span>
          <TagInput
            tags={form.tags}
            onChange={tags => setForm(f => ({ ...f, tags }))}
          />

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!isValid || create.isPending || update.isPending}
            className="bg-black text-white px-4 py-2 rounded text-base hover:bg-gray-800 disabled:opacity-40"
          >
            {selected ? "Update" : "Save"}
          </button>
        </div>

      </div>

      {(create.isError || update.isError) && (
        <p className="text-red-500 text-xs px-4 pb-2">Save failed.</p>
      )}

    </div>
  );
}