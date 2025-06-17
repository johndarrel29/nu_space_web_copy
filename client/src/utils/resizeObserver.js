// Debounce function to limit how often a function can be called
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Safe ResizeObserver wrapper
export const createSafeResizeObserver = (callback, options = {}) => {
  const debouncedCallback = debounce(callback, options.debounceTime || 100);
  
  try {
    return new ResizeObserver((entries) => {
      try {
        debouncedCallback(entries);
      } catch (error) {
        console.warn('ResizeObserver callback error:', error);
      }
    });
  } catch (error) {
    console.warn('ResizeObserver creation error:', error);
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }
}; 