export interface Snippet {
    id: number;
    title: string;
    code: string;
    language: string;
    tags: string[];
    starred: boolean;
    created_at: string;
}

export interface SnippetCreate {
    title: string;
    code: string;
    language: string;
    tags: string[];
    starred: boolean;
}

export interface SnippetUpdate {
    tittle?: string;
    code?: string;
    language?: string;
    tags?: string[];
    starred?: boolean;
}

export const SUPPORTED_LANGUAGES = [
    "python", "javascript", "typescript", "go", "rust",
  "java", "cpp", "c", "bash", "sql", "html", "css", "json"
] as const;