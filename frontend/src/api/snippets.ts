import axios from "axios";
import type { Snippet, SnippetCreate, SnippetUpdate } from "../types/snippet";

const api = axios.create({ baseURL: "http://localhost:5000/api" })

export const fetchSnippets = () : Promise<Snippet[]> => 
    api.get("/snippets").then(r => r.data)

export const searchSnippets = (q: string, lang?: string) : Promise<Snippet[]> =>
    api.get("/search", {params: { q, lang }}).then(r => r.data)

export const createSnippet = (data: SnippetCreate) : Promise<Snippet> =>
    api.post("/snippets", data).then(r => r.data)

export const updateSnippet = (id: number, data: SnippetUpdate) : Promise<Snippet> => 
    api.patch(`/snippets/${id}`, data).then(r => r.data)

export const deleteSnippet = (id: number) : Promise<void> =>
    api.delete(`/snippets/${id}`).then(() => undefined)