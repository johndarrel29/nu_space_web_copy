import { useState } from "react";

export default function useSearchQuery(initialValue = "") {
    const [searchQuery, setSearchQuery] = useState(initialValue);
  
    return { searchQuery, setSearchQuery };
  }