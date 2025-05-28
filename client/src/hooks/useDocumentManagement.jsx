import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useDocumentManagement(rsoID, documentId, reviewedById) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = process.env.REACT_APP_FETCH_RSO_DOCUMENTS_BASE_URL; 
    const queryClient = useQueryClient();


    const fetchDocuments = useCallback(async () => {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            Authorization: token ? `Bearer ${formattedToken}` : "",
        };

        setLoading(true);
        setError(null);

        try {
            console.log("Fetching documents from:", process.env.REACT_APP_FETCH_DOCUMENTS_URL);
            const response = await fetch(`${process.env.REACT_APP_FETCH_DOCUMENTS_URL}`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
            console.log("Fetched documents response:", json);

            if (json.success && Array.isArray(json.documents)) {
                setDocuments(json.documents);
                console.log("Updated documents state:", json.documents);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitDocument = async (formData) => {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            Authorization: token ? `Bearer ${formattedToken}` : "",
        };

        setLoading(true);
        setError(null);

        try {
            console.log("Sending request to:", process.env.REACT_APP_SUBMIT_DOCUMENT_URL);
            const response = await fetch(`${process.env.REACT_APP_SUBMIT_DOCUMENT_URL}`, {
                method: "POST",
                headers,
                body: formData,
            });

            console.log("Response received:", response);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
            console.log("Response from server:", json);

            if (json.success) {
                const newDocuments = Array.isArray(json.documents) ? json.documents : [];
                setDocuments((prev) => [...prev, ...newDocuments]);
                console.log("Document successfully submitted and state updated with:", newDocuments);
            } else {
                throw new Error(json.message || "Failed to submit document");
            }
        } catch (err) {
            console.error("Error in submitDocument:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log("submitDocument execution completed.");
        }
    };

    const fetchRSODocuments = async (rsoID) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
        console.log("Stored token for RSO documents:", localStorage.getItem("token"));

        console.log("Fetching URL:", `${baseURL}/${rsoID}/general-documents`);

        const res = await fetch(`${baseURL}/${rsoID}/general-documents`, {
            method: "GET",
            headers: {
                'Authorization':  formattedToken,
                'Content-Type': 'application/json' 

            },
        });

                // Log all response headers for debugging
        console.log("Response headers:");
        res.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Fetch failed: ${errorText}`);
        }

        const json = await res.json();

        if (json.success && Array.isArray(json.documents)) {
            return json.documents || [];  
        }

    throw new Error("Unexpected response structure");
    }

    const approveRSODocument = async (documentId, reviewedById) => {
  console.log("approveRSODocument called with:");
  console.log("documentId:", documentId);
  console.log("reviewedById:", reviewedById);

        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        console.log("request url: " + `${process.env.REACT_APP_APPROVE_DOCUMENT_URL}/${documentId}`);
        console.log("request body: ", JSON.stringify({ reviewedById }));


        const res = await fetch(`${process.env.REACT_APP_APPROVE_DOCUMENT_URL}/${documentId}`, {
            method: "PATCH",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reviewedById }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Approval failed: ${errorText}`);
        }

        

        return res.json();
    };

    const rejectRSODocument = async (documentId, reviewedById) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        const res = await fetch(`${process.env.REACT_APP_REJECT_DOCUMENT_URL}/${documentId}`, {
            method: "PATCH",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reviewedById }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Rejection failed: ${errorText}`);
        }

        return res.json();
    }

    // Query to fetch RSO documents
    const {
        data: rsoDocuments,
        isLoading: rsoDocumentsLoading,
        isError: rsoDocumentsError,
        error: rsoQueryError
    } = useQuery({
        queryKey: ["rso-documents", rsoID],
        queryFn: () => fetchRSODocuments(rsoID),
        enabled: !!rsoID,
    });

    //Query to approve RSO documents
    const {
        mutate: approveDocumentMutate,
        data: approveData,
        isLoading: approveLoading,
        isError: approveError,
        error: approveQueryError,
    } = useMutation({
        mutationFn: ({documentId, reviewedById}) => approveRSODocument(documentId, reviewedById),
        onSuccess: () => {
        queryClient.invalidateQueries(["rso-documents", rsoID]); // Refetch updated documents
    },
    });

    //Query to reject RSO documents
    const {
        mutate: rejectDocumentMutate,
        data: rejectData,
        isLoading: rejectLoading,
        isError: rejectError,
        error: rejectQueryError,
    } = useMutation({
        mutationFn: ({documentId, reviewedById}) => rejectRSODocument(documentId, reviewedById),
        onSuccess: () => {
        queryClient.invalidateQueries(["rso-documents", rsoID]); // Refetch updated documents
    },
    });

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        submitDocument,
        rsoDocuments,
        rsoDocumentsLoading,
        rsoDocumentsError,
        rsoQueryError,

        // approve props
        approveData,
        approveLoading,
        approveError,
        approveQueryError,
        approveDocumentMutate,
        // reject props
        rejectDocumentMutate,
        rejectData,
        rejectLoading,
        rejectError,
        rejectQueryError,
        approveRSODocument,
        rejectRSODocument,
    };
}

export default useDocumentManagement;