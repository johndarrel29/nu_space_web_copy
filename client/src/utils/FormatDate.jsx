
export function FormatDate (dateString){
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return 'N/A';
    
        let formattedString = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
    
        const dateParts = formattedString.split('/');
        formattedString = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // YYYY-MM-DD format
    
        return formattedString;
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'N/A';
      }
}


  