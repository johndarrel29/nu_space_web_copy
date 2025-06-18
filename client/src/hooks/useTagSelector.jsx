// hooks/useTagSelector.js
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSearchQuery from "./useSearchQuery";

async function fetchTags() {
  const token = localStorage.getItem("token");
  const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  

  const headers = {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${formattedToken}` : "",
  };

  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tags/getTags`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export default function useTagSelector() {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [apiTags, setApiTags] = useState([]);
  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    onError: (error) => {
      console.error('Error fetching tags:', error);
    }
  });

  const tags = tagsData?.tags?.map(tagObj => tagObj.tag) || [];

  const searchedData = isFocused 
    ? tags.filter(tag => !searchQuery || tag.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  function handleTagClick(tag) {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    setSearchQuery("");
  }

  function handleApiTagRemove(tag) {
    setApiTags((prev) => prev.filter((t) => t !== tag));
  }

    const deleteTags = async (tagId) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
    };
    console.log("delete url", `${process.env.REACT_APP_BASE_URL}/api/tags/deleteTag/${tagId}`);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tags/deleteTag/${tagId}`, {
        method: "DELETE",
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to delete tag');
    }

    return response.json();
}

    const updateTags = async ({tagId, tagName}) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;


    console.log("Update Tag URL:", `${process.env.REACT_APP_BASE_URL}/api/tags/update/${tagId}`);

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tags/update/${tagId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        },
        body: JSON.stringify({ tag: tagName }),

    });
        return response.json();
    }

    const createTags = async (tagName) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    console.log("Create Tag URL:", `${process.env.REACT_APP_BASE_URL}/api/tags/createTags`);
    console.log("body :", JSON.stringify({ tag: tagName }));
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tags/createTags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        },
        body: JSON.stringify({ tag: tagName }),

    });

    return response.json();

    }

// create function
const {
    mutate: createTagMutation,
    isLoading: isCreatingTag,
    error: createTagError,
} = useMutation({
    mutationFn: createTags,
    onSuccess: (data) => {
        console.log('Tag created successfully:', data);
        // refetch the tags after creation
        queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
        console.error('Error creating tag:', error);
    },
});

// edit function
const {
    mutate: updateTagMutation,
    isLoading: isUpdatingTag,
    error: updateTagError,
} = useMutation({
    mutationFn: updateTags,
    onSuccess: (data) => {
    console.log('Tag updated successfully:', data);
    //refetch the tags after update
    queryClient.invalidateQueries({ queryKey: ['tags'] });
    
    },
});


// delete function
 const {
    mutate: deleteTagMutation,
    isLoading: isDeletingTag,
    error: deleteTagError,
 } = useMutation({
    mutationFn: deleteTags,
    onSuccess: (data) => {
      console.log('Tag deleted successfully:', data);
      //refetch the tags after deletion
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      
    },
 })

  return {
    tagsData,
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    searchedData,
    handleTagClick,
    handleApiTagRemove,

    deleteTagMutation,
    isDeletingTag,
    deleteTagError,

    updateTagMutation,
    isUpdatingTag,
    updateTagError,

    createTagMutation,
    isCreatingTag,
    createTagError,
  };
}