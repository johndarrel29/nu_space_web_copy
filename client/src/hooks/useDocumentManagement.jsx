import { useState, useCallback } from "react";

function useDocumentManagement() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        submitDocument,
    };
}

export default useDocumentManagement;