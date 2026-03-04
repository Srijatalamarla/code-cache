import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";

export function getLanguageExtension(lang: string): Extension {
  switch (lang) {
    case "python": return python();
    case "javascript": return javascript();
    case "typescript": return javascript({ typescript: true });
    case "java": return java();
    case "cpp":
    case "c": return cpp();
    case "rust": return rust();
    case "sql": return sql();
    case "html": return html();
    case "css": return css();
    case "json": return json();
    default: return [];
  }
}