export function FormatDate (dateString){
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return 'N/A';
    
        // Format date in Philippine timezone (Asia/Manila)
        const formattedString = date.toLocaleString('en-US', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
    
        return formattedString;
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'N/A';
      }
}


  