
import { useTokenStore } from "../store";
import { useQuery, useMutation } from "@tanstack/react-query";

const uploadSignature = async ({ adminId, file }) => {
    try {
        const token = useTokenStore.getState().getToken();
        const formData = new FormData();
        formData.append("file", file);
        console.log("[Signature] Uploading file with id:", adminId, formData.get("file"));

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/signature/upload-signature/${adminId}`, {
            method: "POST",
            headers: {
                Authorization: token || "",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[Signature] Upload error:", error);
        throw error;
    }
}

const getSignature = async (id) => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/signature/fetch-signature/${id}`, {
            method: "GET",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[Signature] Fetch error:", error);
        throw error;
    }
}

const deleteSignature = async (id) => {
    try {
        const token = useTokenStore.getState().getToken();
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/signature/delete-signature/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token || "",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[Signature] Delete error:", error);
        throw error;
    }
}

function useSignature({ id } = {}) {

    const {
        mutate: mutateUploadSignature,
        isLoading: isUploading,
        isError: isUploadError,
        error: uploadError,
        data: uploadData
    } = useMutation({
        mutationFn: uploadSignature,
        onSuccess: (data) => {
            console.log("[Signature] Upload successful:", data);
        }
    });

    const {
        data: signatureData,
        isLoading: isFetching,
        isError: isFetchError,
        error: fetchError,
        refetch: refetchSignature
    } = useQuery({
        queryKey: ['signature', id],
        queryFn: () => getSignature(id),
        enabled: !!id, // Only fetch if id is available
        onSuccess: (data) => {
            console.log("[Signature] Fetch successful:", data);
        }
    });

    const {
        mutate: mutateDeleteSignature,
        isLoading: isDeleting,
        isError: isDeleteError,
        error: deleteError,
        data: deleteData
    } = useMutation({
        mutationFn: deleteSignature,
        onSuccess: (data) => {
            console.log("[Signature] Delete successful:", data);
        }
    });

    return {
        // upload mutation
        mutateUploadSignature,
        isUploading,
        isUploadError,
        uploadError,
        uploadData,
        // fetch query
        signatureData,
        isFetching,
        isFetchError,
        fetchError,
        refetchSignature,

        // delete mutation
        mutateDeleteSignature,
        isDeleting,
        isDeleteError,
        deleteError,
        deleteData
    }
}

export default useSignature;