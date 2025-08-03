import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useTokenStore from "../../store/tokenStore";

// for admin fetching users
const fetchUsersRequest = async () => {
    try {
        console.log("Fetching users...");
        const token = localStorage.getItem("token");


        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/fetchUsers`, {
            method: "GET",
            headers: {
                Authorization: token,

            },
        });

        console.log("Response status users:", response.status);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const json = await response.json();
        // return regular data
        console.log("Fetched users data in UseUser:", json);

        return json?.students;

    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error(`Failed to fetch users: ${error.message}`);
    }

};

// for admin updating user role
const updateUserRequest = async ({ userId, userData, userRole }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : "";

    console.log('Updating user with ID:', userId, 'and data:', userData);

    if (!userRole) {
        throw new Error('user role is missing. Cannot fetch profile.');
    }

    try {
        let url = '';

        const role = userRole || '';

        switch (role) {
            case 'admin':
                url = `${process.env.REACT_APP_BASE_URL}/api/admin/user/updateUserRole/${userId}`;
                break;
            case 'super_admin':
                url = `${process.env.REACT_APP_BASE_URL}/api/admin/user/super-admin/updateUserRole/${userId}`;
                break;
            default:
                console.warn(`No URL defined for role: ${role}`);

        }

        console.log('Updating user role for URL:', url);
        console.log('User data being sent:', userData);
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${formattedToken}`,
            },

            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }


};

// for admin deleting user
const deleteUserRequest = async (userId) => {
    const token = localStorage.getItem("token");

    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : "";

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formattedToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();

}

const fetchAdminProfile = async () => {
    try {
        const token = useTokenStore.getState().token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/fetchAdminProfile`, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Error fetching admin profile:", error);
        throw new Error(`Failed to fetch admin profile: ${error.message}`);
    }

}

function useAdminUser() {
    const { user } = useAuth();

    const {
        data: usersData,
        isLoading: isUsersLoading,
        isError: isUsersError,
        error: usersError,
        refetch: refetchUsersData,
    } = useQuery({
        queryKey: ["users"],
        queryFn: () => {
            console.log("useQuery is running");
            return fetchUsersRequest();
        },
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 0,
        cacheTime: 0,
    });

    const {
        mutate: updateUserMutate,
        isError: isUpdateError,
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        error: updateError,
    } = useMutation({
        mutationFn: ({ userId, userData }) => updateUserRequest({ userId, userData, userRole: user?.role }),
        onSuccess: () => {
            console.log("User updated successfully");
            // refetch();
        },
        onError: (error) => {
            console.error("Error updating user role:", error);
        },
    });

    const {
        mutate: deleteUserMutate,
        isError: isDeleteError,
        isLoading: isDeleteLoading,
        isSuccess: isDeleteSuccess,
        error: deleteError,
    } = useMutation({
        mutationFn: deleteUserRequest,
        onSuccess: () => {
            console.log("User deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting user:", error);
        },
    });

    const {
        data: adminProfile,
        isLoading: isAdminProfileLoading,
        isError: isAdminProfileError,
        error: adminProfileError,
        refetch: refetchAdminProfile,
        isRefetching: isAdminProfileRefetching,
    } = useQuery({
        queryKey: ["adminProfile"],
        queryFn: fetchAdminProfile,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return {
        // fetching users admin
        usersData,
        isUsersLoading,
        isUsersError,
        usersError,
        refetchUsersData,
        updateError,

        // updating users
        updateUserMutate,
        isUpdateError,
        isUpdateLoading,
        isUpdateSuccess,

        // deleting users
        deleteUserMutate,
        isDeleteError,
        isDeleteLoading,
        isDeleteSuccess,
        deleteError,

        // fetching admin profile
        adminProfile,
        isAdminProfileLoading,
        isAdminProfileError,
        adminProfileError,
        refetchAdminProfile,
        isAdminProfileRefetching,

    };
}

export default useAdminUser;