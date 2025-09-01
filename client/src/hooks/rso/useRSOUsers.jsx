import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useTokenStore from "../../store/tokenStore";
import { useUserStoreWithAuth } from '../../store';

const fetchMembers = async () => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/user/get-members`, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Failed to fetch members");
        }
    } catch (error) {
        console.error("error getting RSO members", error.message);
    }
}

function useRSOUsers() {
    const {
        data: rsoMembers,
        isError: isErrorFetchingMembers,
        error: errorFetchingMembers,
        isRefetching: isRefetchingMembers,
    } = useQuery({
        queryKey: ["rsoMembers"],
        queryFn: fetchMembers
    });

    return {
        rsoMembers,
        isErrorFetchingMembers,
        errorFetchingMembers,
        isRefetchingMembers
    };
}

export default useRSOUsers;