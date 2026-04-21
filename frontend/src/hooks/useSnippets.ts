import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/snippets";
import type { SnippetCreate, SnippetUpdate } from "../types/snippet";

export const useSnippets = (q?: string, lang?: string) => 
    useQuery({
        queryKey: ["snippets", q, lang],
        queryFn: () => 
            q || lang ? 
                api.searchSnippets(q ?? "", lang) 
                : api.fetchSnippets(),
        placeholderData: keepPreviousData,
    });

export const useCreateSnippet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: SnippetCreate) => api.createSnippet(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
    });
};

export const useUpdateSnippet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, data} :{id: number, data: SnippetUpdate}) => api.updateSnippet(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
    });
};

export const useDeleteSnippet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteSnippet(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["snippets"] }),
    });
};