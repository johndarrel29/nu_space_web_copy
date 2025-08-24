import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useTokenStore from "../../store/tokenStore";
import { useUserStoreWithAuth } from '../../store';

const fetchAllForms = async () => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/forms/fetch-all-centralized-forms`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error encountered fetching forms: ", error.message)
        throw new Error("Failed to fetch forms");
    }
}

const createCentralizedForm = async (formData) => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/forms/create-centralized-form`, {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: JSON.stringify(formData),
        })

        if (!response.ok) {
            throw new Error("Failed to create form");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error encountered creating form: ", error.message)
        throw new Error("Failed to create form");
    }
}

function useAdminCentralizedForms() {

    const {
        data: allForms,
        isLoading: isLoadingAllForms,
        isRefetching: isRefetchingAllForms,
        error: errorAllForms
    } = useQuery({
        queryKey: ["admin-centralized-forms"],
        queryFn: fetchAllForms,
    });

    const {
        mutate: createFormMutate,
        isLoading: isCreatingForm,
        isError: isCreatingFormError,
        error: createFormError
    } = useMutation({
        mutationFn: createCentralizedForm,
        onSuccess: () => {
            // Invalidate and refetch
        },
        onError: (error) => {
            console.error("Error creating form:", error);
        },
    });

    return {
        allForms,
        isLoadingAllForms,
        isRefetchingAllForms,
        errorAllForms,

        // create form
        createFormMutate,
        isCreatingForm,
        isCreatingFormError,
        createFormError
    };
}

export default useAdminCentralizedForms;