import { Button, CloseButton, TextInput } from '../../components';
import Switch from '@mui/material/Switch';
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'


function UploadBatchModal({ handleCloseModal }) {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        documentName: '',
        documentDescription: '',
        isPostDocument: false,
    });

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log("Accepted files:", acceptedFiles);
        setFile(acceptedFiles[0]);

    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    })

    const handleAddFile = () => {
        if (!formData.documentName || !formData.documentDescription || file === null) {
            setError("Please fill in all fields and select a file.");
            return;
        }

        if (file) {
            // Handle the file upload logic here
            console.log("File to be uploaded:", file);
            const fileEntry = {
                id: Date.now(),
                file: file,
                name: formData.documentName,
                description: formData.documentDescription,
                isPostDocument: formData.isPostDocument,
            }

            // add the file to the file list
            setFileList(prevFiles => [...prevFiles, fileEntry]);

            // Reset the file input
            setFile(null);
            setFormData({
                documentName: '',
                documentDescription: '',
                isPostDocument: false,
            });
        } else {
            console.error("No file selected");
        }
    }

    const removeFileFromList = (fileId) => {
        setFileList(prevFiles => prevFiles.filter(file => file.id !== fileId));
    }

    return (
        <>
            {/* Header - fixed at top */}
            <div className='flex justify-between items-center p-6 border-b border-mid-gray'>
                <h1 className="text-2xl font-bold text-[#312895]">Header</h1>
                <CloseButton onClick={handleCloseModal}></CloseButton>
            </div>

            {/* Content area - flexible, scrollable */}
            <div className='flex-1 p-6 overflow-y-auto'>
                <div
                    className='flex flex-col gap-4'>
                    <input {...getInputProps()} />
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className='w-full py-4 bg-gray-100 border border-mid-gray rounded flex justify-center cursor-pointer'>
                            {isDragActive ? "Drop the files here ..." : "Drag 'n' drop or click to select files"}
                        </div>
                    ) :
                        (
                            <div className='p-4 bg-background border border-primary rounded flex items-center justify-between text-primary'>
                                {file?.name || "Document Name"}
                                <div
                                    onClick={() => setFile(null)}
                                    className='aspect-square flex items-center justify-center cursor-pointer bg-primary rounded-full'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-background' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                </div>

                            </div>
                        )}
                    <TextInput
                        value={formData.documentName}
                        onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                        onClick={() => setError(null)}
                        placeholder="Document Name"
                    />
                    <textarea
                        rows="4"
                        value={formData.documentDescription}
                        onChange={(e) => setFormData({ ...formData, documentDescription: e.target.value })}
                        onClick={() => setError(null)}
                        className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Provide more details about the document..."
                    />
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <div className='flex justify-between items-start mt-4'>
                        <div className='flex items-center'>
                            <h2 className='text-gray-600'>Is post document?</h2>
                            <Switch
                                checked={formData.isPostDocument}
                                onChange={() => setFormData({ ...formData, isPostDocument: !formData.isPostDocument })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#312895',
                                        '& + .MuiSwitch-track': {
                                            backgroundColor: '#312895',
                                        },
                                    },
                                }}
                            />
                        </div>

                        <Button
                            style={"secondary"}
                        >
                            <div
                                onClick={handleAddFile}
                                className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='size-4' viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
                                Add File
                            </div>
                        </Button>
                    </div>
                </div>

                {/* list section */}
                <div className='mt-8 flex flex-col gap-4 border-t border-mid-gray pt-4'>
                    {fileList.length > 0 ? (
                        fileList.map((fileEntry) => (
                            <div key={fileEntry.id} className='p-4 w-full py-4 border border-mid-gray rounded flex items-center justify-between'>
                                {fileEntry.name || "Document Name"}
                                <h1 className='text-sm text-gray-600'>{fileEntry.isPostDocument ? 'Post Document' : 'Pre Document'}</h1>

                                <div
                                    onClick={() => removeFileFromList(fileEntry.id)}
                                    className='aspect-square flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-gray-600' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                </div>
                            </div>
                        ))
                    ) :
                        (
                            <div className='p-4 text-center text-gray-600'>
                                No files added yet.
                            </div>
                        )}
                </div>
            </div>

            {/* Footer button - fixed at bottom */}
            <div className='p-6 border-t border-mid-gray'>
                <Button className="w-full">
                    Upload Documents
                </Button>
            </div>
        </>
    );
}

export default UploadBatchModal;