import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../../context/AuthContext';

// API call function
const getRSOActivitySurvey = async (activityId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rsoSurvey/activitySurvey/${activityId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching RSO activity survey:', error);
        throw error;
    }
};

function useAdminSurvey({ activityId }) {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const {
        data: adminActivitySurvey,
        error: adminActivitySurveyError,
        isLoading: isadminActivitySurveyLoading,
        isError: isadminActivitySurveyError,
        refetch: refetchAdminActivitySurvey,
        isRefetching: isRefetchingAdminActivitySurvey,
    } = useQuery({
        queryKey: ["adminActivitySurvey", activityId],
        queryFn: () => getRSOActivitySurvey(activityId),
        enabled: !!activityId,
    })



    return {
        adminActivitySurvey,
        adminActivitySurveyError,
        isadminActivitySurveyLoading,
        isadminActivitySurveyError,
    };
}

export default useAdminSurvey;