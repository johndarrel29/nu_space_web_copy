import { useQuery } from '@tanstack/react-query';

function useTags() {
    const fetchTags = async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };

        const response = await fetch(`${process.env.REACT_APP_FETCH_TAGS_URL}`, {
            method: "GET",
            headers,
        });

        return response.json();
    }



    const { data } = useQuery({
        queryKey: ['tags'],
        queryFn: fetchTags,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    console.log('useTags data:', data);
    return {
        tags: data?.tags || [],
        isLoading: !data,
        isError: !data,
    };
}

export default useTags;