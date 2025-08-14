import useTokenStore from "../../store/tokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStoreWithAuth } from '../../store';
import { useEffect } from "react";

const fetchDirectorDocuments = async () => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/director/documents/fetch-documents`, {
            method: "GET",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching director documents: ${response.statusText}`);
        }

        const data = await response.json();
        return data.documents || [];
    } catch (error) {
        console.error("Error fetching director documents:", error);
        throw error;
    }
}

const approveDirectorDocument = async (documentId) => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/director/documents/approve/${documentId}`, {
            method: "POST",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error approving document: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error approving director document:", error);
        throw error;
    }
}

function useDirectorDocuments() {
    const { isDirector } = useUserStoreWithAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isDirector) {
            queryClient.removeQueries(['directorDocuments']);
        }
    }, [isDirector, queryClient]);

    const {
        data: directorDocuments,
        isLoading: documentsLoading,
        isError: documentsError,
        error: documentsErrorMessage,
        refetch: refetchDocuments,
        isRefetching: isRefetchingDocuments,
        isFetched: isDocumentsFetched,
    } = useQuery({
        queryKey: ["directorDocuments"],
        queryFn: fetchDirectorDocuments,
        enabled: isDirector,
    });

    const {
        mutate: approveDocumentMutate,
        isLoading: isApprovingDocument,
        isError: isApproveDocumentError,
        isSuccess: isApproveDocumentSuccess,
    } = useMutation({
        mutationFn: approveDirectorDocument,
        onSuccess: (data) => {
            console.log("Document approved successfully:", data);
            // Optionally, you can refetch the data or update the state here
            queryClient.invalidateQueries(["directorDocuments"]);
        },
        onError: (error) => {
            console.error("Error approving document:", error);
        },
        enabled: isDirector,
    });

    return {
        // Data and loading/error states for director documents
        directorDocuments,
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

export default useDirectorDocuments;