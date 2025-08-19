import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../../context/AuthContext';
import { useUserStoreWithAuth } from "../../store";

// for rso representative
// looks like this url is no longer available in backend
const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/documents/getDocuments`, {
        method: "GET",
        headers: {
            Authorization: token ? `Bearer ${formattedToken}` : "",
            'Content-Type': 'application/json'
        },
    });


    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} - ${response.statusText}`);
    }

    const json = await response.json();
    return json.documents ?? []; // return only array of docs
}

// submit document - pure API function (no local state)
const submitDocument = async ({ formData }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const headers = { Authorization: formattedToken || '' };

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/documents/submitDocument`, {
        method: "POST",
        headers,
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};

const fetchDocumentTemplate = async (documentFor = "", user = {}) => {
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

    return res.json();
}

function useRSODocuments({ documentFor } = {}) {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { isUserRSORepresentative } = useUserStoreWithAuth();

    const {
        data: generalDocuments,
        isLoading: generalDocumentsLoading,
        isError: generalDocumentsError,
        error: generalDocumentsQueryError,
        refetch: refetchGeneralDocuments,
    } = useQuery({
        queryKey: ["documents"],
        queryFn: fetchDocuments,
        enabled: isUserRSORepresentative,
        onSuccess: (data) => {
            console.log("Documents fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching documents:", error);
        },
    });

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

    const {
        data: documentTemplate,
        isLoading: documentTemplateLoading,
        isError: documentTemplateError,
        error: documentTemplateQueryError,
        refetch: refetchDocumentTemplate,
    } = useQuery({
        queryKey: ["documentTemplate", documentFor],
        queryFn: () => fetchDocumentTemplate(documentFor || "", user),
        enabled: !!documentFor && !!user,
        onSuccess: (data) => {
            console.log("Document template fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching document template:", error);
        }
    });

    return {
        // get document data
        generalDocuments,
        generalDocumentsLoading,
        generalDocumentsError,
        generalDocumentsQueryError,
        refetchGeneralDocuments,

        // submitDocument
        submitDocumentMutate,
        submitDocumentLoading,
        submitDocumentSuccess,
        submitDocumentError,
        submitDocumentQueryError,

        // document template
        documentTemplate,
        documentTemplateLoading,
        documentTemplateError,
        documentTemplateQueryError,
        refetchDocumentTemplate,
    }
}

export default useRSODocuments;