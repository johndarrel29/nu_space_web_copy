import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useRSO() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [fetchError, setFetchError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const createRSO = async (newOrg) => {
    setLoading(true);
    setSuccess(false);

    // change RSO_picture to RSO_image
    if (newOrg.RSO_picture && newOrg.RSO_picture instanceof File) {
      newOrg.RSO_image = newOrg.RSO_picture;
      delete newOrg.RSO_picture;

    }

    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
      console.log("Submitting new RSO:", newOrg);
      console.log("Request URL:", `${process.env.REACT_APP_BASE_URL}/api/rso/createRSO`);

      // Create FormData if RSO_picture exists (file upload)
      const isFileUpload = newOrg.RSO_image instanceof File;


      let body;
      let headers = {
        "Authorization": `Bearer ${formattedToken}`,
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

  const updateRSO = async (id, updatedOrg) => {
    setLoading(true);
    setUpdateError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

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
        "Authorization": token ? `Bearer ${formattedToken}` : "",
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

  const updateRSOStatus = async ({ id, status }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
    };

    console.log("Updating RSO status:", { id, status });

    const body = JSON.stringify({ RSO_membershipStatus: status });

    const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`, {
      method: "PATCH",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to update RSO status: ${response.status}`);

    }

    return response.json();
  }

  const deleteRSO = async (id) => {
    setLoading(true);


    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
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

  const fetchWebRSO = async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);

    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    console.log("Fetching web RSO data from:", `${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
    });
    return response.json();
  }

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);

    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
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

  const updateOfficer = async ({ id, updatedOfficer }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
      Authorization: `Bearer ${formattedToken}`,
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

  const createOfficer = async ({ createdOfficer }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    console.log("createdOfficer: ", createdOfficer);

    const headers = {
      Authorization: `Bearer ${formattedToken}`,
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

  const updateMembershipDate = async ({ date }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/open-update-membership`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
      body: JSON.stringify({ membershipEndDate: date }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update membership date: ${response.status}`);
    }
    return response.json();

  }

  const getMembershipDate = async () => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/membership-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get membership date: ${response.status}`);
    }
    return response.json();

  }

  const closeMembershipDate = async () => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/manual-close-membership`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to close membership date: ${response.status}`);
    }
    return response.json();

  }

  const extendMembershipDate = async ({ date, hours, minutes }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/update-membership-endDate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
      body: JSON.stringify({ durationInDays: date, durationInHours: hours, durationInMinutes: minutes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to extend membership date: ${response.status}`);
    }
    return response.json();

  }

  const {
    data,
    isError: fetchWebRSOError,
    refetch: fetchData,
  } = useQuery({
    queryKey: ["rsoData"],
    queryFn: fetchWebRSO,
    enabled: false, // Disable automatic fetching
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
    queryData: data,
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