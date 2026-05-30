import { useState } from 'react';

const useUploadImageForItem = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return {
        selectedFile,
        handleFileChange
    };
};