import { useCallback } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

//refetch is cached, so it will not refetch the data unless the cache is invalidated

function useUserProfile() {
  const queryClient = useQueryClient();

  const fetchUserProfile = async () => {

    const cachedProfile = sessionStorage.getItem('user');
      if (cachedProfile) {
        console.log('Using cached profile data');
        console.log('Cached profile data:', cachedProfile);
        return JSON.parse(cachedProfile);
      }

      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      console.log('API URL:', `${process.env.REACT_APP_BASE_URL}/api/auth/userProfile`);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/userProfile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log('User profile data received:', data ? 'Yes' : 'No');
    
    // Cache the result AFTER receiving the data
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  };

    const fetchProfilePage = async () => {
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      console.log('API URL:', `${process.env.REACT_APP_BASE_URL}/api/auth/userProfile`);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/userProfile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log('User profile data received:', data ? 'Yes' : 'No');
    
    // Cache the result AFTER receiving the data
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  };

  

      const deleteOfficer = async (officerId) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rso/deleteRSOOfficer/${officerId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log("Officer deleted successfully");
      return response.json();
    } catch (err) {
      console.error("Error deleting officer:", err);
    }
  }

  const {
    data: profilePageData,
    error: profilePageError,
    isLoading: isProfilePageLoading,
    isError: isProfilePageError,
    refetch: refetchProfilePage,
  } = useQuery({
    queryKey: ['profilePage'],
    queryFn: fetchProfilePage,
  })

    const {
    data: user,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  
 const {
  mutate: deleteOfficerMutate,
  isLoading: isDeleting,
  isError: isDeleteError,
} = useMutation({
  mutationFn: deleteOfficer,
  onSuccess: () => {
    queryClient.invalidateQueries(["membersData"]);
    refetchProfilePage();
    console.log("Officer deleted successfully, refetching user profile");
  },
  onError: (err) => {
    console.error("Error deleting officer:", err);
  }
});

    


  return { user, error, isLoading, isError, refetch, 
    deleteOfficerMutate, isDeleting, isDeleteError, profilePageData };
}

export default useUserProfile;
