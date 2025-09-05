import { useUserStoreWithAuth } from "../../store";
import useTokenStore from "../../store/tokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getTemplateFormsRequest = async () => {
    try {
        const token = useTokenStore.getState().token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/forms/fetch-forms`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); // try to read the server's message
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching template forms:", error);
        throw error;
    }
}

const getSpecificFormRequest = async (formId) => {
    try {
        const token = useTokenStore.getState().token;
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/forms/fetch-specific-form/${formId}`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json(); // try to read the server's message
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);

        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching specific form:", error);
        throw error;
    }
}

function useRSOForms() {
    const { isUserRSORepresentative } = useUserStoreWithAuth();

    const {
        data: rsoFormsTemplate,
        isLoading: isLoadingRSOFormsTemplate,
        isError: isErrorRSOFormsTemplate,
        error: errorRSOFormsTemplate,
    } = useQuery({
        queryKey: ["rsoFormsTemplate"],
        queryFn: getTemplateFormsRequest,
        refetchOnWindowFocus: false,
        enabled: !!isUserRSORepresentative, // Only run if the user is an RSO representative
    });

    const {
        data: specificRSOForm,
        isLoading: isLoadingSpecificRSOForm,
        isError: isErrorSpecificRSOForm,
        error: errorSpecificRSOForm,
    } = useQuery({
        queryKey: ["specificForm"],
        queryFn: () => getSpecificFormRequest(rsoFormsTemplate?.formId), // Assuming formId is available in rsoFormsTemplate
        refetchOnWindowFocus: false,
        enabled: !!rsoFormsTemplate?.formId, // Only run if formId is available
    });

    return {
        rsoFormsTemplate,
        isLoadingRSOFormsTemplate,
        isErrorRSOFormsTemplate,
        errorRSOFormsTemplate,

        specificRSOForm,
        isLoadingSpecificRSOForm,
        isErrorSpecificRSOForm,
        errorSpecificRSOForm,
    };
}

export default useRSOForms;