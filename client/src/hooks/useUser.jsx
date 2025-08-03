import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

// match url with the role on updateuserrole

const loginUserRequest = async ({ email, password, platform }) => {
  console.log("Login request initiated with email:", email, "and platform:", platform, "password:", password);

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/login/webLogin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, platform }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Login failed");
  }

  return json;
}

// for admin registering user
const registerUserRequest = async ({ firstName, lastName, email, password, confirmpassword, platform }) => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/createAdminAccount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({ firstName, lastName, email, password, confirmpassword, platform }),
  });

  const json = await response.json(); // <- parse JSON even if response is not ok

  if (!response.ok || !json.success) {
    throw {
      message: json.message || "Registration failed1",
      details: json.errors || [],
    };
  }
  return json;
}

// for admin fetching users
const fetchUsersRequest = async () => {
  try {
    console.log("Fetching users...");
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : "";


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

function useUser() {
  const { user } = useAuth();
  console.log("useUser hook called with user:", user);

  const loginUserMutate = useMutation({
    mutationFn: loginUserRequest,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      console.error("Error logging in:", error);
    },
  });

  const {
    mutate: registerUserMutate,
    isError: isRegisterError,
    isLoading: isRegisterLoading,
    isSuccess: isRegisterSuccess,
    error: registerError,
  } = useMutation({
    mutationFn: registerUserRequest,
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
    },
    onError: (error) => {
      console.error("Error registering user:", error);
      if (error.details && error.details.length > 0) {
        console.error("Validation errors:", error.details[0].msg);
      }
    },
  });

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
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

  const updateUserMutate = useMutation({
    mutationFn: ({ userId, userData }) => updateUserRequest({ userId, userData, userRole: user?.role }),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
    },
  });

  const deleteUserMutate = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  return {
    usersData,
    loading: isLoading,
    error: isError ? error : null,
    refetch,

    updateUserMutate,
    deleteUserMutate,
    loginUserMutate,

    registerUserMutate,
    isRegisterError,
    isRegisterLoading,
    isRegisterSuccess,
    registerError,

    fetchUsersRequest,
    updateUserRequest,
    deleteUserRequest,

  };
}

export default useUser;
