
// for rso fetch members
const fetchMembers = async () => {
    const token = useTokenStore.getState().getToken();
    console.log("Stored token:", token);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": token || "",
    };

    setLoading(true);


    try {
        console.log("Fetching members from:", `${process.env.REACT_APP_BASE_URL}/api/rso/members`);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rso/members`, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const json = await response.json();
        console.log("Fetched members data:", json);
        return json.members || [];
    } catch (err) {
        setFetchError(err.message);
        console.error("Error loading members data:", err);
        return [];
    } finally {
        setLoading(false);

    }
}

// for rso update officer
const updateOfficer = async ({ id, updatedOfficer }) => {
    const token = useTokenStore.getState().getToken();

    const headers = {
        Authorization: token || "",
    };
    console.log("request sent: ", `${process.env.REACT_APP_BASE_URL}/api/rsoRep/rso/updateRSOOfficer/${id}`)
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/rso/updateRSOOfficer/${id}`, {
        method: "PUT",
        headers,
        body: updatedOfficer,
    });

    if (!response.ok) {
        throw new Error(`Failed to update officer: ${response.status}`);
    }
    return response.json();

}

// for rso create officer
const createOfficer = async ({ createdOfficer }) => {
    const token = useTokenStore.getState().getToken();
    console.log("createdOfficer: ", createdOfficer);

    const headers = {
        Authorization: token || "",
    };
    console.log("create request sent: ", `${process.env.REACT_APP_BASE_URL}/api/rsoRep/rso/createRSOOfficer`)
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/rso/createRSOOfficer`, {
        method: "POST",
        headers,
        body: createdOfficer,
    });

    if (!response.ok) {
        throw new Error(`Failed to create officer: ${response.status}`);
    }
    return response.json();

}

function useRSODetails() {
    const {
        mutate: updateOfficerMutate,
        isLoading: isUpdatingOfficer,
        isError: isUpdateOfficerError,
        isSuccess: isUpdateOfficerSuccess,
    } = useMutation({
        mutationFn: updateOfficer,
        onSuccess: (data) => {
            console.log("Officer updated successfully:", data);
            // Optionally, you can refetch the data or update the state here
            queryClient.invalidateQueries(["membersData"]);

        },
        onError: (error) => {
            console.error("Error updating officer:", error);
        },
    })

    const {
        data: membersData,
        isLoading: isMembersLoading,
        error: membersError,
        refetch: refetchMembers,
        isSuccess: membersSuccess,
    } = useQuery({
        queryKey: ["membersData"],
        queryFn: fetchMembers,
        onSuccess: (data) => {
            console.log("Members data fetched successfully:", data);
            queryClient.setQueryData(["membersData"], data);
        },
        onError: (error) => {
            console.error("Error fetching members data:", error);
        },
    })

    const {
        mutate: createOfficerMutate,
        isLoading: isCreatingOfficer,
        isError: isCreateOfficerError,
        isSuccess: isCreateOfficerSuccess,
    } = useMutation({
        mutationFn: createOfficer,
        onSuccess: (data) => {
            console.log("Officer created successfully:", data);
            // Optionally, you can refetch the data or update the state here
            queryClient.invalidateQueries(["membersData"]);
        },
        onError: (error) => {
            console.error("Error creating officer:", error);
        },
    })


    return {
        // Update Officer
        updateOfficerMutate,
        isUpdatingOfficer,
        isUpdateOfficerError,
        isUpdateOfficerSuccess,


        // Members Data
        membersData,
        isMembersLoading,
        membersError,
        refetchMembers,
        membersSuccess,

        // Create Officer
        createOfficerMutate,
        isCreatingOfficer,
        isCreateOfficerError,
        isCreateOfficerSuccess,


    }
}