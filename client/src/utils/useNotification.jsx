import { useState } from 'react';


export default function useNotification() {
    const [notification, setNotification] = useState(null);

    const handleNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
      };
    
    return { notification, handleNotification };
}