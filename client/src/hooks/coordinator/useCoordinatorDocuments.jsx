import useTokenStore from "../../store/tokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStoreWithAuth } from '../../store';
import { useEffect } from "react";

const getCoordinatorDocuments = async () => {
    try {
        const token = useTokenStore.getState().getToken();

        console.log("Fetching coordinator documents with token:", token, "and url: ", `${process.env.REACT_APP_BASE_URL}/api/coordinator/documents/fetch-documents`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/coordinator/documents/fetch-documents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Coordinator documents fetch failed:", errorText);
            throw new Error("Failed to fetch coordinator documents");
        }
        console.log("Response status:", response.status);
        return response.json();

    } catch (error) {
        console.error("Error fetching coordinator documents:", error);
        throw error; // rethrow so react-query can handle the error state
    }
}

const approveCoordinatorDocument = async ({ formData, documentId }) => {
    try {
        console.log("received data, ", documentId, formData);
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/coordinator/documents/approveDocument/${documentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Error approving document: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error approving coordinator document:", error);
        throw error;
    }

}

function useCoordinatorDocuments() {
    const { isCoordinator } = useUserStoreWithAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isCoordinator) {
            queryClient.removeQueries(['coordinatorDocuments']);
        }
    }, [isCoordinator, queryClient]);

    const {
        data: coordinatorDocuments,
        isLoading: documentsLoading,
        isError: documentsError,
        error: documentsErrorMessage,
        refetch: refetchDocuments,
        isRefetching: isRefetchingDocuments,
        isFetched: isDocumentsFetched,
    } = useQuery({
        queryKey: ["coordinatorDocuments"],
        queryFn: getCoordinatorDocuments,
        enabled: isCoordinator
    });

    const {
        mutate: approveDocumentMutate,
        isLoading: isApprovingDocument,
        isError: isApproveDocumentError,
        isSuccess: isApproveDocumentSuccess,
    } = useMutation({
        mutationFn: approveCoordinatorDocument,
        onSuccess: (data) => {
            console.log("Document approved successfully:", data);
            // Optionally, you can refetch the data or update the state here
            queryClient.invalidateQueries(["coordinatorDocuments"]);
        },
        onError: (error) => {
            console.error("Error approving document:", error);
        },
        enabled: isCoordinator
    });

    return {
        // Data and loading/error states for coordinator documents
        coordinatorDocuments,
        documentsLoading,
        documentsError,
        documentsErrorMessage,
        refetchDocuments,
        isRefetchingDocuments,
        isDocumentsFetched,

        // Approve document functionality
        approveDocumentMutate,
        isApprovingDocument,
        isApproveDocumentError,
        isApproveDocumentSuccess,
    };
}

export default useCoordinatorDocuments;