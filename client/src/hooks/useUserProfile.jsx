import { useCallback } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

function useUserProfile() {

  const fetchUserProfile = async () => {

    const cachedProfile = sessionStorage.getItem('user');
      if (cachedProfile) {
        console.log('Using cached profile data');
        console.log('Cached profile data:', cachedProfile);
        return JSON.parse(cachedProfile);
      }

      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      console.log('API URL:', process.env.REACT_APP_FETCH_USER_PROFILE_URL);

      const response = await fetch(process.env.REACT_APP_FETCH_USER_PROFILE_URL, {
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

  return { user, error, isLoading, isError, refetch};
}

export default useUserProfile;
