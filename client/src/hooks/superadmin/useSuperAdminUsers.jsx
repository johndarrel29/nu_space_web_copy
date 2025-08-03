import useTokenStore from "../../store/tokenStore";
import { useQuery, useMutation } from "@tanstack/react-query";

const deleteSDAOAccount = async () => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/superadmin/sdao/delete`, {
            method: "DELETE",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting SDAO account: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting SDAO account:", error);
        throw error;

    }
}

const createSDAOAccount = async () => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/superadmin/sdao/create`, {
            method: "POST",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error creating SDAO account: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating SDAO account:", error);
        throw error;

    }
}

const getSDAOAccounts = async () => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/superadmin/sdao/accounts`, {
            method: "GET",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching SDAO accounts: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching SDAO accounts:", error);
        throw error;
    }
}

const updateSDAORole = async () => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/superadmin/sdao/update-role`, {
            method: "POST",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error updating SDAO role: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating SDAO role:", error);
        throw error;
    }
}

function useSuperAdminSDAO() {
    const {
        data: sdaoAccounts,
        isLoading: accountsLoading,
        isError: accountsError,
        error: accountsErrorMessage,
        refetch: refetchAccounts,
        isRefetching: isRefetchingAccounts,
        isFetched: isAccountsFetched,
    } = useQuery({
        queryKey: ["sdaoAccounts"],
        queryFn: getSDAOAccounts,
    });

    const {
        mutate: createAccount,
        isLoading: isCreatingAccount,
        isError: isCreateError,
        error: createErrorMessage,
    } = useMutation({
        mutationFn: createSDAOAccount,
        onSuccess: () => {
            refetchAccounts();
        },
    });

    const {
        mutate: deleteAccount,
        isLoading: isDeletingAccount,
        isError: isDeleteError,
        error: deleteErrorMessage,
    } = useMutation({
        mutationFn: deleteSDAOAccount,
        onSuccess: () => {
            refetchAccounts();
        },
    });

    const {
        mutate: updateSDAORole,
        isLoading: isUpdatingSDAORole,
        isError: isUpdateSDAORoleError,
        error: updateSDAORoleErrorMessage,
    } = useMutation({
        mutationFn: updateSDAORole,
        onSuccess: () => {
            refetchAccounts();
        },
    });

    return {
        // SDAO accounts data
        sdaoAccounts,
        accountsLoading,
        accountsError,
        accountsErrorMessage,
        refetchAccounts,
        isRefetchingAccounts,
        isAccountsFetched,

        // SDAO create 
        createAccount,
        isCreatingAccount,
        isCreateError,
        createErrorMessage,

        // SDAO delete
        deleteAccount,
        isDeletingAccount,
        isDeleteError,
        deleteErrorMessage,

        // SDAO update role
        updateSDAORole,
        isUpdatingSDAORole,
        isUpdateSDAORoleError,
        updateSDAORoleErrorMessage
    };
}

export default useSuperAdminSDAO;