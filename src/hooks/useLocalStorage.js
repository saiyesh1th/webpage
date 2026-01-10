import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Get from local storage then
    // parse stored json or if none return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    // Update storedValue if key changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            } else {
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.log(error);
            setStoredValue(initialValue);
        }
    }, [key]); // Only re-run if key changes. initialValue is omitted to avoid loops with unstable refs.

    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            setStoredValue(prevStoredValue => {
                const valueToStore = value instanceof Function ? value(prevStoredValue) : value;

                // Save to local storage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }

                return valueToStore;
            });
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
