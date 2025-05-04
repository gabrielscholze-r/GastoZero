import { useQuery } from '@tanstack/react-query';
import api from "../services/API.jsx";

export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const response = await api.get('/plan/user');
            return response.data;
        },
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });
}