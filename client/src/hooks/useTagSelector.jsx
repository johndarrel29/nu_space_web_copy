// hooks/useTagSelector.js
import { useState, useEffect } from 'react';
import useSearchQuery from "./useSearchQuery";

export default function useTagSelector() {
    const { searchQuery, setSearchQuery } = useSearchQuery();
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [apiTags, setApiTags] = useState([]);

    useEffect(() => {
        async function fetchTags() {
            const token = localStorage.getItem("token");
            const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

            const headers = {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_FETCH_TAGS_URL}`, {
                    method: "GET",
                    headers,
                });
                
                const data = await response.json();
                setTags(data.tags.map(tagObj => tagObj.tag));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        }
        fetchTags();
    }, []);

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
      



    

    return {
        tags,
        selectedTags,
        setSelectedTags,
        searchQuery,
        setSearchQuery,
        isFocused,
        setIsFocused,
        searchedData,
        handleTagClick,
        handleApiTagRemove
    };
}