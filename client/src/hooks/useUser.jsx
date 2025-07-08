import { useQuery, useMutation } from "@tanstack/react-query";

const loginUserRequest = async ({ email, password, platform }) => {
  console.log("Login request initiated with email:", email, "and platform:", platform, "password:", password);

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/webLogin`, {
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

const fetchUsersRequest = async () => {
  const token = localStorage.getItem("token");
  const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : "";

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/fetchUsers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${formattedToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const json = await response.json();
  return Array.isArray(json.users) ? json.users : [];
};

const updateUserRequest = async ({ userId, userData }) => {
  const token = localStorage.getItem("token");

  const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : "";

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/updateUserRole/${userId}`, {
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
};

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
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersRequest,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 0,
    cacheTime: 0,
  });

  const updateUserMutate = useMutation({
    mutationFn: updateUserRequest,
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
    data,
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
