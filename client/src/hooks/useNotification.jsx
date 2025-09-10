import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useTokenStore from "../store/tokenStore";

const getNotificationsRequest = async ({ queryKey }) => {
    try {
        const token = useTokenStore.getState().token;
        const userId = queryKey[1];

        console.log("notification url called:", `${process.env.REACT_APP_BASE_URL}/api/notification/fetch-notification/${userId}`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/notification/fetch-notification/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            }
        });

        if (!response.ok) {
            const errorData = await response.json(); // try to read the server's message
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

function useNotification({ userId } = {}) {

    const {
        data: notificationsData,
        isLoading: notificationsLoading,
        isError: notificationsError,
        error: notificationsErrorDetails
    } = useQuery({
        queryKey: ['notificationData', userId],
        queryFn: getNotificationsRequest,
    });

    return {
        // get notifications
        notificationsData,
        notificationsLoading,
        notificationsError,
        notificationsErrorDetails,
    }
}

export default useNotification;

