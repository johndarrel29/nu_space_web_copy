import { createPopper } from '@popperjs/core';

let initializing = null; // shared promise

/**
 * Idempotent Material Tailwind initializer.
 * Call once (or many times safely). Will:
 *  - Expose window.Popper
 *  - Dynamically import @material-tailwind/html
 *  - Run init (initTWE or initMaterialTailwind)
 *  - Retry automatically once when back online if initial load failed due to offline state
 */
export default async function safeInitMaterialTailwind(options = { dropdown: true, tooltip: true, popover: true }) {
    if (typeof window === 'undefined') return;
    if (window.__MTW_INIT__) return;                // already initialized successfully
    if (initializing) return initializing;          // already in progress

    // Ensure Popper global (some versions check window.Popper)
    if (!window.Popper) {
        window.Popper = { createPopper };
    }

    initializing = (async () => {
        try {
            const mod = await import('@material-tailwind/html');
            if (mod.initTWE) {
                mod.initTWE(options);
            } else if (mod.initMaterialTailwind) {
                mod.initMaterialTailwind();
            }
            window.__MTW_INIT__ = true;
        } catch (err) {
            // If offline, set a one‑time retry on 'online'
            if (!navigator.onLine) {
                const retry = async () => {
                    window.removeEventListener('online', retry);
                    initializing = null;
                    await safeInitMaterialTailwind(options);
                };
                window.addEventListener('online', retry);
            } else if (process.env.NODE_ENV === 'development') {
                console.warn('Material Tailwind init failed:', err);
            }
            throw err;
        } finally {
            if (!window.__MTW_INIT__) {
                // allow future attempts if not successful
                initializing = null;
            }
        }
    })();

    return initializing;
}