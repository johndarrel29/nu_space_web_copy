import useTokenStore from "../../store/tokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStoreWithAuth } from '../../store';
import { useEffect } from "react";

const getAVPDocuments = async () => {
    try {
        const token = useTokenStore.getState().getToken();
        console.log("Fetching AVP documents with token:", token, "and url: ", `${process.env.REACT_APP_BASE_URL}/api/avp/documents/fetch-documents`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/avp/documents/fetch-documents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("AVP documents fetch failed:", errorText);
            throw new Error("Failed to fetch AVP documents");
        }
        console.log("Response status:", response.status);
        return response.json();
    }
    catch (error) {
        console.error("Error fetching AVP documents:", error);
        throw error; // rethrow so react-query can handle the error state
    }
};

const approveAVPDocument = async (documentId) => {
    try {
        const token = useTokenStore.getState().getToken();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/avp/documents/approve/${documentId}`, {
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
        console.error("Error approving AVP document:", error);
        throw error;
    }
}

function useAVPDocuments() {
    const { isAVP } = useUserStoreWithAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAVP) {
            queryClient.removeQueries(['avpDocuments']);
        }
    }, [isAVP, queryClient]);

    const {
        data: avpDocuments,
        isLoading: documentsLoading,
        isError: documentsError,
        error: documentsErrorMessage,
        refetch: refetchDocuments,
        isRefetching: isRefetchingDocuments,
        isFetched: isDocumentsFetched,
    } = useQuery({
        queryKey: ["avpDocuments"],
        queryFn: getAVPDocuments,
        enabled: isAVP,
    });

    const {
        mutate: approveDocument,
        isLoading: isApprovingDocument,
        isError: isApproveError,
        error: approveErrorMessage,
    } = useMutation({
        mutationFn: approveAVPDocument,
        onSuccess: () => {
            // Invalidate and refetch
            refetchDocuments();
        },
        enabled: isAVP,
    });

    return {
        avpDocuments,
        documentsLoading,
        documentsError,
        documentsErrorMessage,
        refetchDocuments,
        isRefetchingDocuments,
        isDocumentsFetched,
    };
}

export default useAVPDocuments;
