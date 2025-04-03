export function handleShortenName(name) {
    if (!name) {
      // Return a fallback string if name is undefined or null
      return '';
    }
  
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  }