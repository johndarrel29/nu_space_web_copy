import useTokenStore from "../store/tokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useAcademicYears() {
    const { getToken } = useTokenStore();

    const getAcademicYears = async () => {
        try {
            const token = useTokenStore.getState().getToken();

            console.log("Fetching academic years with token:", token, "and url: ", `${process.env.REACT_APP_BASE_URL}/api/admin/academicYear/getAcademicYears`);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/academicYear/getAcademicYears`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Academic years fetch failed:", errorText);
                throw new Error("Failed to fetch academic years");
            }
            console.log("Response status:", response.status);
            return response.json();

        } catch (error) {
            console.error("Error fetching academic years:", error);
            throw error; // rethrow so react-query can handle the error state
        }
    }

    const {
        data: academicYears,
        isLoading: academicYearsLoading,
        isError: academicYearsError,
        error: academicYearsErrorMessage,
        refetch: refetchAcademicYears,
        isRefetching: isRefetchingAcademicYears,
        isFetched: isAcademicYearsFetched,
    } = useQuery({
        queryKey: ["academicYears"],
        queryFn: getAcademicYears,
    })

    return {
        academicYears,
        academicYearsLoading,
        academicYearsError,
        academicYearsErrorMessage,
        refetchAcademicYears,
        isRefetchingAcademicYears,
        isAcademicYearsFetched,
    };
}

export default useAcademicYears;