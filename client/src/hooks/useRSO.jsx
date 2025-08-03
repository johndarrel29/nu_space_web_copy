import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useTokenStore from "../store/tokenStore";

function useRSO() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [fetchError, setFetchError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const { getToken } = useTokenStore();

  console.log("useRSO initialized with token:", getToken());

  // admin create an rso
  const createRSO = async (newOrg) => {
    setLoading(true);
    setSuccess(false);

    // change RSO_picture to RSO_image
    if (newOrg.RSO_picture && newOrg.RSO_picture instanceof File) {
      newOrg.RSO_image = newOrg.RSO_picture;
      delete newOrg.RSO_picture;

    }

    try {
      const token = useTokenStore.getState().getToken();
      const isFileUpload = newOrg.RSO_image instanceof File;


      let body;
      let headers = {
        "Authorization": token || "",
      };


      if (isFileUpload) {
        const formData = new FormData();

        Object.entries(newOrg).forEach(([key, value]) => {
          if (key === "RSO_picturePreview") return;
          if (key === "RSO_picture") {
            formData.append("RSO_image", value);
            return;
          }

          if (key === "RSO_tags" && Array.isArray(value)) {
            value.forEach((tag) => formData.append("RSO_tags[]", tag));
          } else {
            formData.append(key, value);
          }
        });
        console.log("Final FormData created:");
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(newOrg);
      }



      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/createRSO`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating RSO:", errorData);

        setCreateError(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        console.error("createRSO error:", createError);
        throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("RSO created:", result);
      setSuccess(true);

      // Update the state with the new organization
      setOrganizations((prevOrgs) => [...prevOrgs, result]);
    } catch (error) {
      const errorData = await error.response?.json();
      console.error("Error creating RSO:", errorData || error);
    } finally {
      setLoading(false);
    }
  };

  // admin update an rso
  // This function handles both file uploads and regular JSON updates
  const updateRSO = async (id, updatedOrg) => {
    setLoading(true);
    setUpdateError(null);
    setSuccess(false);

    try {
      const token = useTokenStore.getState().getToken();

      // Create FormData if RSO_picture exists (file upload)
      const isFileUpload = updatedOrg.RSO_picture instanceof File;
      const formData = new FormData();

      if (isFileUpload) {
        // Append all fields (including the file) to FormData
        Object.keys(updatedOrg).forEach((key) => {
          if (key === "RSO_picture") {
            formData.append("RSO_image", updatedOrg[key]);
          } else {
            formData.append(key, updatedOrg[key]);
          }
        });
      }

      const headers = {
        "Authorization": token || "",
        // Let the browser set Content-Type automatically for FormData (includes boundary)
        ...(!isFileUpload && { "Content-Type": "application/json" }),
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/update-rso/${id}`, {
        method: "PATCH",
        headers,
        body: isFileUpload ? formData : JSON.stringify(updatedOrg),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess(true);
      console.log("RSO updated:", result);

      setOrganizations((prevOrgs) =>
        prevOrgs.map((org) => (org._id === id ? result.updatedRSO : org))
      );
    } catch (err) {
      console.error("Error updating RSO:", err);
      setUpdateError(`Error: ${err.message}`);
    } finally {
      setLoading(false);

    }
  };

  // admin update RSO status
  // fix the updateRSOStatus function to use the correct endpoint and handle the request properly
  const updateRSOStatus = async ({ id, status }) => {
    const token = useTokenStore.getState().getToken();

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token || "",
    };

    console.log("Updating RSO status:", { id, status });

    const body = JSON.stringify({ RSO_membershipStatus: status });

    const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/api/admin/rso/recognize-rso/${id}`, {
      method: "PATCH",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to update RSO status: ${response.status}`);

    }

    return response.json();
  }

  // admin delete an rso
  const deleteRSO = async (id) => {
    setLoading(true);


    try {
      const token = useTokenStore.getState().getToken();

      const headers = {
        "Content-Type": "application/json",
        "Authorization": token || "",
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/deleteRSO/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log("RSO deleted");

      // Update the state by removing the deleted organization
      setOrganizations((prevOrgs) => prevOrgs.filter((org) => org._id !== id));
    } catch (err) {
      console.error("Error deleting RSO:", err);
      setDeleteError(`Error: ${err.message}`);

    } finally {
      setLoading(false);

    }
  };

  // Fetch all RSOs
  const fetchWebRSO = async () => {
    console.log("Fetching web RSO data...");

    try {
      const token = useTokenStore.getState().getToken();
      console.log("Stored token:", token);
      // const token = localStorage.getItem("token");

      console.log("Fetching web RSO data from:", `${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`, "with token:", token);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`, {
        method: "GET",
        headers: {
          "Authorization": token || "",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const rsoData = await response.json();
      console.log("Fetched web RSO rsoData from controller:", rsoData);
      return rsoData;
    } catch (error) {
      console.error("Error fetching RSO data:", error);
      throw error;
    }
  }

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

  // for admin update membership date
  const updateMembershipDate = async ({ date }) => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/open-update-membership`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "",
      },
      body: JSON.stringify({ membershipEndDate: date }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update membership date: ${response.status}`);
    }
    return response.json();

  }

  // for admin get membership date
  const getMembershipDate = async () => {
    try {
      const token = useTokenStore.getState().getToken();

      console.log("Fetching membership date with token:", token);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/membership-status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token || "",
        },
      });

      const responseData = await response.json();
      console.log("Membership date response data:", responseData);
      console.log("Membership date fetched successfully:", responseData);

      if (!response.ok) {
        throw new Error(`Failed to get membership date: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching membership date:", error);
      throw error;
    }

  }

  // for admin close membership date
  const closeMembershipDate = async () => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/manual-close-membership`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to close membership date: ${response.status}`);
    }
    return response.json();

  }

  // for admin extend membership date
  const extendMembershipDate = async ({ date, hours, minutes }) => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/update-membership-endDate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token || "",
      },
      body: JSON.stringify({ durationInDays: date, durationInHours: hours, durationInMinutes: minutes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to extend membership date: ${response.status}`);
    }
    return response.json();

  }

  const {
    data: RSOData,
    isError: fetchWebRSOError,
    refetch: fetchData,
  } = useQuery({
    queryKey: ["rsoData"],
    queryFn: fetchWebRSO,
    // enabled: false, // Disable automatic fetching
    onSuccess: (data) => {
      console.log("Web RSO data fetched successfully:", data);
      queryClient.setQueryData(["rsoData"], data);
    },
    onError: (error) => {
      console.error("Error fetching web RSO data:", error);
    },

  })

  const {
    mutate: extendMembershipDateMutate,
    isLoading: isExtendingMembershipDate,
    isError: isExtendingMembershipDateError,
    isSuccess: isExtendingMembershipDateSuccess,
  } = useMutation({

    mutationFn: extendMembershipDate,
    onSuccess: (data) => {
      console.log("Membership date extended successfully:", data);
      queryClient.invalidateQueries(["membershipDateData"]);
    },
    onError: (error) => {
      console.error("Error extending membership date:", error);
    },
  })


  const {
    mutate: closeMembershipDateMutate,
    isLoading: isClosingMembershipDate,
    isError: isClosingMembershipDateError,
    isSuccess: isClosingMembershipDateSuccess,
  } = useMutation({

    mutationFn: closeMembershipDate,
    onSuccess: (data) => {
      console.log("Membership date closed successfully:", data);
      queryClient.invalidateQueries(["membershipDateData"]);
    },
    onError: (error) => {
      console.error("Error closing membership date:", error);
    },
  })



  const {
    data: membershipDateData,
    isLoading: isGettingMembershipDate,
    isError: isGettingMembershipDateError,
    isSuccess: isGettingMembershipDateSuccess,
  } = useQuery({
    queryKey: ["membershipDateData"],
    queryFn: getMembershipDate,
    onSuccess: (data) => {
      console.log("Membership date fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching membership date:", error);
    },
  })

  const {
    mutate: updateMembershipDateMutate,
    isLoading: isUpdatingMembershipDate,
    isError: isUpdatingMembershipDateError,
    isSuccess: isUpdatingMembershipDateSuccess,
  } = useMutation({
    mutationFn: updateMembershipDate,
    onSuccess: (data) => {
      console.log("Membership date updated successfully:", data);
      queryClient.invalidateQueries(["membershipDateData"]);
    },
    onError: (error) => {
      console.error("Error updating membership date:", error);
    },
  })

  const {
    mutate: createOfficerMutate,
    isLoading: isCreatingOfficerLoading,
    isError: isCreatingOfficerError,
    isSuccess: isCreatingSuccess,
  } = useMutation({
    mutationFn: createOfficer,
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
    mutate: updateRSOStatusMutate,
    isLoading: isUpdatingStatus,
    error: updateStatusError,
  } = useMutation({
    mutationFn: updateRSOStatus,
    onSuccess: (data) => {
      console.log("RSO status updated successfully:", data);
      // Optionally, you can refetch the data or update the state here
      queryClient.invalidateQueries(["rsoData"]);

    },
    onError: (error) => {
      console.error("Error updating RSO status:", error);
    },
  })






  // console.log("React Query fetched data:", JSON.stringify(data, null, 2));

  return {
    organizations,
    loading,
    success,
    createRSO,
    updateRSO,
    deleteRSO,
    fetchData,
    RSOData,
    fetchWebRSOError,
    updateRSOStatusMutate,

    membersData,
    isMembersLoading,
    membersError,
    refetchMembers,
    membersSuccess,

    updateOfficerMutate,
    isUpdatingOfficer,
    isUpdateOfficerError,
    isUpdateOfficerSuccess,

    fetchError,
    createError,
    updateError,
    deleteError,

    createOfficerMutate,
    isCreatingOfficerLoading,
    isCreatingOfficerError,
    isCreatingSuccess,


    updateMembershipDateMutate,
    isUpdatingMembershipDate,
    isUpdatingMembershipDateError,
    isUpdatingMembershipDateSuccess,

    membershipDateData,
    isGettingMembershipDate,
    isGettingMembershipDateError,
    isGettingMembershipDateSuccess,

    closeMembershipDateMutate,
    isClosingMembershipDate,
    isClosingMembershipDateError,
    isClosingMembershipDateSuccess,

    extendMembershipDateMutate,
    isExtendingMembershipDate,
    isExtendingMembershipDateError,
    isExtendingMembershipDateSuccess,

  };
}

export default useRSO;