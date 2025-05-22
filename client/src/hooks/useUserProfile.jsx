import { useCallback } from 'react';
import { useState } from 'react';

function useUserProfile() {

  const [ error, setError ] = useState(null);

  const fetchUserProfile = useCallback(async () => {


    try {
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
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error);
      return null;
    }
  }, []); // dependencies can be added if needed

  return { fetchUserProfile, error };
}

export default useUserProfile;
