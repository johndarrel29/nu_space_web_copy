import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../context/AuthContext';
import { useTokenStore } from "../store";

function useDocumentManagement({
    rsoID,
    userID,
    page = 1,
    limit = 10,
    documentFor,
    purpose = "",
    status = "",
    rsoId = "",
    startDate = "",
    endDate = "",
    search = "",
    documentType = "",
} = {}) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseURL = `${process.env.REACT_APP_BASE_URL}/api/admin/rso`;
    const queryClient = useQueryClient();
    const { user, token } = useAuth();

    // for rso representative
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

    // for rso
    const submitDocument = async ({ formData }) => {
        const token = useTokenStore.getState().token;

        const headers = { Authorization: token || '' }

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

    //no role -- probably remove
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

    // for admin
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

    // for admin
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

    // no role -- probably remove
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

    // for admin
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

    // checks if the user has a role and fetches the document template accordingly
    const fetchDocumentTemplate = async (documentFor) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        let url = '';

        const role = user?.role || '';
        switch (role) {
            case 'admin':
            case 'coordinator':
            case 'super_admin':
                url = `${process.env.REACT_APP_BASE_URL}/api/admin/documents/templateDocuments`;
                break;
            case 'rso_representative':
                url = `${process.env.REACT_APP_BASE_URL}/api/rsoRep/documents/template?documentFor=${documentFor}`;
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

    // for admin
    // add a parameter to fetch all documents based on documentFor, documentType, or userID
    const fetchAllDocuments = async ({ queryKey }) => {
        const [_key, params] = queryKey;
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        // Filter out undefined, null, or empty string values from params
        const filteredParams = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                filteredParams[key] = value;
            }
        });

        // Construct the query string from params
        const queryString = new URLSearchParams(filteredParams).toString();
        console.log("url request: ", `${process.env.REACT_APP_BASE_URL}/api/admin/documents/allDocuments?${queryString}`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/documents/allDocuments?${queryString}`, {
            method: "GET",
            headers: {
                Authorization: token ? `Bearer ${formattedToken}` : "",
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status} - ${response.statusText}`);
        }

        if (response.status === 204) {
            console.warn("No documents found.");
            return [];
        }

        const json = await response.json();
        return json.documents || json || [];
    }

    // Query to fetch all documents
    const filters = {
        page,
        limit,
        purpose,
        status,
        rsoId,
        startDate,
        endDate,
        search,
        documentType
    };


    const {
        data: allDocuments,
        isLoading: allDocumentsLoading,
        isError: allDocumentsError,
        error: allDocumentsQueryError,
        refetch: refetchAllDocuments,
    } = useQuery({
        queryKey: ["documents", filters],
        queryFn: fetchAllDocuments,
        onSuccess: (data) => {
            setDocuments(data);
            console.log("All documents fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching all documents:", error);
            setError(error.message);
        },
    });

    const {
        data: documentTemplate,
        isLoading: documentTemplateLoading,
        isError: documentTemplateError,
        error: documentTemplateQueryError,
        refetch: refetchDocumentTemplate,
    } = useQuery({
        queryKey: ["documentTemplate", documentFor],
        queryFn: () => fetchDocumentTemplate(documentFor || ""),
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
        queryKey: ["documents", userID, documentFor],
        queryFn: () => fetchDocumentsStudentRso({ userID, documentFor }),
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

        allDocuments,
        allDocumentsLoading,
        allDocumentsError,
        allDocumentsQueryError,
        refetchAllDocuments,
    };
}

export default useDocumentManagement;