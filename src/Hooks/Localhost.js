import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const data = localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : initialValue;
    });

    const updateValue = (newValue) => {
        setValue(newValue);

        localStorage.setItem(
            key,
            JSON.stringify(newValue)
        );
    };

    return [value, updateValue];
}