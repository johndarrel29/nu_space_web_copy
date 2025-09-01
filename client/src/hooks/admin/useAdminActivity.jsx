import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useTokenStore from "../../store/tokenStore";
import { useUserStoreWithAuth } from '../../store';

// admin fetch activity with parameters
const fetchAdminActivity = async ({ queryKey, pageParam = 1 }) => {
    const token = useTokenStore.getState().getToken();

    const [_, filter] = queryKey;
    const { limit = 12, query = "", sorted = "", RSO = "", RSOType = "", college = "" } = filter;

    const url = new URL(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/fetch-activities`);
    url.searchParams.set("page", pageParam);
    url.searchParams.set("limit", limit);
    if (query) url.searchParams.set("search", query);
    if (RSO) url.searchParams.set("RSO", RSO)
    if (RSOType) url.searchParams.set("RSOType", RSOType);
    if (college) url.searchParams.set("college", college);
    if (sorted) url.searchParams.set("sorted", sorted);

    console.log("Fetching admin activities with params:", {
        page: pageParam,
        query,
        sorted,
        RSO,
        RSOType,
        college,
    });

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
        hasNextPage: data.pagination?.hasNextPage,
        nextPage: data.pagination?.hasNextPage ? pageParam + 1 : undefined,
    }
    // return response.json();

}

const approveActivity = async ({ activityId }) => {
    try {
        console.log("url:", `${process.env.REACT_APP_BASE_URL}/api/admin/activities/approveActivity/${activityId}`);

        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/approveActivity/${activityId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            }
        });

        console.log("Response status:", response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        if (response.status === 400) {
            const errorData = await response.json();
            console.error("Error approving activity in hooks:", errorData.message);
            throw new Error(errorData.message || "Error approving activity");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error approving activity for approvedocument:", error);
        throw error;
    }
}

const rejectActivity = async ({ activityId }) => {
    try {
        console.log("url:", `${process.env.REACT_APP_BASE_URL}/api/admin/activities/rejectActivity/${activityId}`);

        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/rejectActivity/${activityId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            }
        });

        console.log("Response status:", response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        if (response.status === 400) {
            const errorData = await response.json();
            console.error("Error rejecting activity in hooks:", errorData.message);
            throw new Error(errorData.message || "Error rejecting activity");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error rejecting activity for rejectDocument:", error);
        throw error;
    }
}

function useAdminActivity({
    debouncedQuery = "",
    limit = 12,
    sorted = "",
    RSO = "",
    RSOType = "",
    college = "",
} = {}) {
    const { user } = useAuth();
    const { isUserAdmin, isUserCoordinator } = useUserStoreWithAuth();

    const filter = {
        query: debouncedQuery,
        limit,
        sorted,
        RSO,
        RSOType,
        college,
    };

    const {
        data: adminPaginatedActivities,
        error: adminError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["adminActivities", filter],
        queryFn: fetchAdminActivity,
        // enabled: !!debouncedQuery || !!sorted || !!RSO || !!RSOType || !!college,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })

    const {
        mutate: approveActivityMutate,
        isLoading: isApprovingActivity,
        isError: isErrorApprovingActivity,
        isSuccess: isActivityApproved,
    } = useMutation({
        mutationFn: approveActivity,
        onSuccess: () => {
            console.log("Activity approved successfully");
        },
        onError: (error) => {
            console.error("Error approving activity:", error);
        }
    });

    const {
        mutate: rejectActivityMutate,
        isLoading: isRejectingActivity,
        isError: isErrorRejectingActivity,
        isSuccess: isActivityRejected,
    } = useMutation({
        mutationFn: rejectActivity,
        onSuccess: () => {
            console.log("Activity rejected successfully");
        },
        onError: (error) => {
            console.error("Error rejecting activity:", error);
        }
    });

    return {
        // fetch admin activities
        adminPaginatedActivities,
        adminError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,

        // approve activity
        isApprovingActivity,
        isErrorApprovingActivity,
        isActivityApproved,
        approveActivityMutate,

        rejectActivityMutate,
        isRejectingActivity,
        isErrorRejectingActivity,
        isActivityRejected,
    }

}

export default useAdminActivity;    