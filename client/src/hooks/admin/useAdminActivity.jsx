import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useTokenStore from "../../store/tokenStore";
import { useUserStoreWithAuth } from '../../store';

// admin fetch activity with parameters
const fetchAdminActivity = async ({
    pageParam = 1,
    query = "",
    sorted = "",
    RSO = "",
    RSOType = "",
    college = ""
}) => {
    const token = useTokenStore.getState().getToken();

    const url = new URL(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/fetch-activities`);
    url.searchParams.set("page", pageParam);
    url.searchParams.set("limit", 12);
    if (query) url.searchParams.set("search", query);
    if (RSO) url.searchParams.set("RSO", RSO)
    if (RSOType) url.searchParams.set("RSOType", RSOType);
    if (college) url.searchParams.set("college", college);
    if (sorted) url.searchParams.set("sorted", sorted);

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        }
    }
    )

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }


    const data = await response.json();
    return {
        activities: data.activities,
        nextPage: data.pagination?.hasNextPage ? pageParam + 1 : undefined,
    }
    // return response.json();

}

function useAdminActivity({
    debouncedQuery = "",
    sorted = "",
    RSO = "",
    RSOType = "",
    college = ""
}) {
    const { user } = useAuth();
    const { isUserAdmin, isUserCoordinator } = useUserStoreWithAuth();

    const {
        data: adminPaginatedActivities,
        error: adminError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["adminActivities", debouncedQuery, sorted, RSO, RSOType, college],
        queryFn: ({ pageParam = 1 }) =>
            fetchAdminActivity({ pageParam, query: debouncedQuery, sorted: sorted, RSO: RSO, RSOType: RSOType, college: college }),
        // enabled: !!debouncedQuery || !!sorted || !!RSO || !!RSOType || !!college,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })

    return {
        // fetch admin activities
        adminPaginatedActivities,
        adminError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }

}

export default useAdminActivity;