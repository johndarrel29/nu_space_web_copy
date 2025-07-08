import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../context/AuthContext';

function useDocumentManagement({ rsoID, documentId, reviewedById, userID } = {}) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = `${process.env.REACT_APP_BASE_URL}/api/admin/rso`;
    const queryClient = useQueryClient();
    const { user, token } = useAuth();

    const fetchDocuments = async () => {
        const token = localStorage.getItem("token");
        // console.log("Stored token:", token);
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;


        console.log("calling url ", `${process.env.REACT_APP_BASE_URL}/api/rsoRep/documents/getDocuments`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/documents/getDocuments`, {
            method: "GET",
            headers: {
                Authorization: token ? `Bearer ${formattedToken}` : "",
                'Content-Type': 'application/json'
            },
        })


        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status} - ${response.statusText}`);
        }

        const json = await response.json();
        console.log("Fetched data:", json);

        return json.documents ?? []; // ← Return only the array of docs

    }

    const submitDocument = async ({ formData }) => {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);

        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            Authorization: token ? `Bearer ${formattedToken}` : "",
        };

        setLoading(true);
        setError(null);

        // try {
        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File - name: ${value.name}, type: ${value.type}, size: ${value.size}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log("Sending request to:", `${process.env.REACT_APP_BASE_URL}/api/documents/submitDocument`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/documents/submitDocument`, {
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

    };

    const fetchRSODocuments = async (rsoID) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
        console.log("Stored token for RSO documents:", localStorage.getItem("token"));

        console.log("Fetching URL:", `${baseURL}/${rsoID}/general-documents`);

        const res = await fetch(`${baseURL}/${rsoID}/general-documents`, {
            method: "GET",
            headers: {
                'Authorization': formattedToken,
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

        console.log("request url: " + `${process.env.REACT_APP_BASE_URL}/api/documents/approveDocument/${documentId}`);
        console.log("request body: ", JSON.stringify({ reviewedById }));


        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/documents/approveDocument/${documentId}`, {
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

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/documents/rejectDocument/${documentId}`, {
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

    const fetchDocumentsStudentRso = async (userID) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        console.log("Fetching documents for RSO ID:", userID);
        const res = await fetch(`${baseURL}/${userID}/general-documents-rso`, {
            method: "GET",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
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

    // Add new function to fetch general documents with direct ID
    const fetchGeneralDocuments = async (id) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        console.log("Fetching general documents for ID:", id);
        console.log("URL:", `${baseURL}/${id}/general-documents-rso`);

        const res = await fetch(`${baseURL}/${id}/general-documents-rso`, {
            method: "GET",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
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
    };

    const fetchDocumentTemplate = async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        let url = '';

        const role = user?.role || '';
        switch (role) {
            case 'admin':
            case 'super_admin':
                url = `${process.env.REACT_APP_BASE_URL}/api/admin/documents/templateDocuments`;
                break;
            case 'rso_representative':
                url = `${process.env.REACT_APP_BASE_URL}/api/rsoRep/documents/template`;
                break;
            default:
                console.warn(`No URL defined for role: ${role}`);
                throw new Error(`No URL defined for role: ${role}`);

        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Fetch failed: ${errorText}`);
        }

        const json = await res.json();
        return json;
    }

    const {
        data: documentTemplate,
        isLoading: documentTemplateLoading,
        isError: documentTemplateError,
        error: documentTemplateQueryError,
        refetch: refetchDocumentTemplate,
    } = useQuery({
        queryKey: ["documentTemplate"],
        queryFn: fetchDocumentTemplate,
        onSuccess: (data) => {
            console.log("Document template fetched successfully:", data);
            setDocuments(data);
        }
        ,
        onError: (error) => {
            console.error("Error fetching document template:", error);
            setError(error.message);
        }
    });

    const {
        data: documentsData,
        isLoading: documentsLoading,
        isError: documentsError,
        error: documentsQueryError,
        refetch: refetchDocuments,

    } = useQuery({
        queryKey: ["documents", userID],
        queryFn: () => fetchDocumentsStudentRso(userID),
        enabled: !!userID, // Only run this query if rsoID is available
        onSuccess: (data) => {
            console.log("Documents fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching documents:", error);
            setError(error.message);
        },
    });

    const {
        data: generalDocuments,
        isLoading: generalDocumentsLoading,
        isError: generalDocumentsError,
        error: generalDocumentsQueryError,
        refetch: refetchGeneralDocuments,
    } = useQuery({
        queryKey: ["documents"],
        queryFn: fetchDocuments,
        onSuccess: (data) => {
            setDocuments(data);
            console.log("Documents fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching documents:", error);
            setError(error.message);
        },
    })

    // mutation for submitting documents
    const {
        mutate: submitDocumentMutate,
        isLoading: submitDocumentLoading,
        isSuccess: submitDocumentSuccess,
        isError: submitDocumentError,
        error: submitDocumentQueryError,
    } = useMutation({
        mutationFn: ({ formData }) => submitDocument({ formData }),
        onSuccess: () => {
            queryClient.invalidateQueries(["documents"]);
        },
    });

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
        mutationFn: ({ documentId, reviewedById }) => approveRSODocument(documentId, reviewedById),
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
        mutationFn: ({ documentId, reviewedById }) => rejectRSODocument(documentId, reviewedById),
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

        submitDocumentMutate,
        submitDocumentLoading,
        submitDocumentSuccess,
        submitDocumentError,

        generalDocuments,
        refetchGeneralDocuments,
        generalDocumentsLoading,
        fetchGeneralDocuments,

        documentsData,
        documentsLoading,
        documentsError,
        documentsQueryError,
        refetchDocuments,

        documentTemplate,
        documentTemplateLoading,
        documentTemplateError,
        documentTemplateQueryError,
        refetchDocumentTemplate,
    };
}

export default useDocumentManagement;