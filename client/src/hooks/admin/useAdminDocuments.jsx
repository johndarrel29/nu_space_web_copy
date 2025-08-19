import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from '../../context/AuthContext';
import { useUserStoreWithAuth } from "../../store";
import { useEffect } from "react";

// =============API Calls
// for admin
const approveRSODocument = async (documentId, reviewedById) => {
    try {
        console.log("approveRSODocument called with:", { documentId, reviewedById });
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
    } catch (error) {
        console.error("Error in approveRSODocument:", error);
        throw error;
    }
};

// for admin
const rejectRSODocument = async (documentId, reviewedById) => {
    try {
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
    } catch (error) {
        console.error("Error in rejectRSODocument:", error);
        throw error;
    }
}

// for admin
// Add new function to fetch general documents with direct ID
const fetchGeneralDocuments = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        console.log("Fetching general documents for ID:", id);
        console.log("URL:", `${process.env.REACT_APP_BASE_URL}/${id}/general-documents-rso`);

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/${id}/general-documents-rso`, {
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
    } catch (error) {
        console.error("Error in fetchGeneralDocuments:", error);
        throw error;
    }
};

// checks if the user has a role and fetches the document template accordingly
const fetchDocumentTemplate = async (documentFor, user) => {
    try {
        // user is now passed as an argument
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
    } catch (error) {
        console.error("Error in fetchDocumentTemplate:", error);
        throw error;
    }
}

// for admin
// add a parameter to fetch all documents based on documentFor, documentType, or userID
const fetchAllDocuments = async ({ queryKey }) => {
    try {
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
    } catch (error) {
        console.error("Error in fetchAllDocuments:", error);
        throw error;
    }
}

const setAccreditationDeadlineRequest = async (data) => {
    try {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

        console.log("Setting accreditation deadline with data:", data);

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/rso-accreditation/deadline`, {
            method: "PATCH",
            headers: {
                'Authorization': formattedToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Fetch failed: ${errorText}`);
        }

        const json = await res.json();
        return json;
    } catch (error) {
        console.error("Error setting accreditation deadline:", error);
        throw error;
    }
}

function useAdminDocuments({
    page = 1,
    limit = 10,
    purpose = "",
    status = "",
    rsoId = "",
    startDate = "",
    endDate = "",
    search = "",
    documentType = "",
    yearId = "",
} = {}) {
    const { user } = useAuth();
    const { isUserAdmin } = useUserStoreWithAuth();
    const queryClient = useQueryClient();

    const filters = {
        page,
        limit,
        purpose,
        status,
        rsoId,
        startDate,
        endDate,
        search,
        documentType,
        yearId,
    };

    useEffect(() => {
        if (!isUserAdmin) {
            console.log("not admin detected. removing documents query")
            queryClient.removeQueries(['documents']);
        }
    }, [isUserAdmin, queryClient]);

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
            // Optionally handle side effects here
            console.log("All documents fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching all documents:", error);
        },
        // enabled: isUserAdmin,
        enabled: (() => {
            const isEnabled = isUserAdmin;
            console.log("Query enabled:", isEnabled);
            return isEnabled;
        })(),
    });

    const {
        mutate: setAccreditationDeadline,
        error: setAccreditationDeadlineError,
        success: setAccreditationDeadlineSuccess,
        refetch: refetchSetAccreditationDeadline
    } = useMutation({
        mutationFn: setAccreditationDeadlineRequest,
        onSuccess: (data) => {
            console.log("Accreditation deadline set successfully:", data);
        },
        onError: (error) => {
            console.error("Error setting accreditation deadline:", error);
        },
    });

    return {
        allDocuments,
        allDocumentsLoading,
        allDocumentsError,
        allDocumentsQueryError,
        refetchAllDocuments,

        // Set Accreditation Deadline
        refetchSetAccreditationDeadline,
        setAccreditationDeadline,
        setAccreditationDeadlineError,
        setAccreditationDeadlineSuccess
    };
}

export default useAdminDocuments;