

// for rso representative
// looks like this url is no longer available in backend
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
// there is a url but different url address
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

function useRSODocuments() {

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

    return {
        // get document data
        generalDocuments,
        generalDocumentsLoading,
        generalDocumentsError,
        generalDocumentsQueryError,
        refetchGeneralDocuments,

        // submitDocumentMutate,
        submitDocumentMutate,
        submitDocumentLoading,
        submitDocumentSuccess,
        submitDocumentError,
        submitDocumentQueryError,

        // get documentTemplate
        documentTemplate,
        documentTemplateLoading,
        documentTemplateError,
        documentTemplateQueryError,
        refetchDocumentTemplate,
    }
}