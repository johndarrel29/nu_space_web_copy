import { Button, CloseButton, TextInput, ReusableDropdown } from '../../components';
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDocumentManagement } from '../../hooks';
import { useLocation } from 'react-router-dom';

// param now works for doc template
// if modal is deployed in document page, only show 'renewal_recognition', 'new_applicant_recognition'
// if modal is deployed in activities page, show 'off_campus_activities', 'on_campus_activities'

// learn more about forceful download of file so no redirects to the file URL necessary

function UploadBatchModal({ handleCloseModal, page }) {
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState([]);
    const { documentTemplate } = useDocumentManagement({
        documentFor: selectedTemplate
    });
    const [formData, setFormData] = useState({
        documentName: '',
        documentDescription: '',
    });

    // determine the initial page based on the page prop
    const currentPage = location.pathname;
    const isDocumentPage = currentPage.includes('/document') && !currentPage.includes('/documents');
    const isActivitiesPage = currentPage.startsWith('/documents') && !isDocumentPage;

    // store document template in its designated category
    const [data, setData] = useState([]);
    const [initialPage, setInitialPage] = useState("templates");

    // set initial filter based on the page location
    useEffect(() => {
        if (isDocumentPage) {
            setSelectedTemplate(["new_applicant_recognition", "renewal_recognition"]);
        } else if (isActivitiesPage) {
            setSelectedTemplate(["off_campus_activities", "on_campus_activities"]);
        } else {
            setSelectedTemplate(null);
        }
    }, [])


    useEffect(() => {
        if (documentTemplate && documentTemplate.documents) {
            setData(documentTemplate?.documents);
            console.log("Document Template:", documentTemplate?.documents);
        } else {
            setData({ documents: [] });
        }
    }, [documentTemplate, isDocumentPage]);

    const genDocOptions = [
        "All Templates",
        "New Applicant Recognition",
        "Renewal Recognition",
    ]

    const actDocOptions = [
        "All Templates",
        "Off Campus Activities",
        "On Campus Activities",
    ]

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
            }

            // add the file to the file list
            setFileList(prevFiles => [...prevFiles, fileEntry]);

            // Reset the file input
            setFile(null);
            setFormData({
                documentName: '',
                documentDescription: '',
            });
        } else {
            console.error("No file selected");
        }
    }

    const removeFileFromList = (fileId) => {
        setFileList(prevFiles => prevFiles.filter(file => file.id !== fileId));
    }

    const handleTemplateFilter = (option) => {
        console.log("Selected template option:", option);
        // use the option as parameter to filter the templates
        if (isDocumentPage) {
            if (option === "New Applicant Recognition") {
                setSelectedTemplate("new_applicant_recognition");
            } else if (option === "Renewal Recognition") {
                setSelectedTemplate("renewal_recognition");
            } else {
                setSelectedTemplate(["new_applicant_recognition", "renewal_recognition"]);
            }
        }

        // This logic is missing for activities page:
        if (isActivitiesPage) {
            if (option === "Off Campus Activities") {
                setSelectedTemplate("off_campus_activities");
            } else if (option === "On Campus Activities") {
                setSelectedTemplate("on_campus_activities");
            } else {
                setSelectedTemplate(["off_campus_activities", "on_campus_activities"]);
            }
        }
    }

    const downloadDocument = (document) => {
        try {
            console.log("Downloading document:", document);
            if (document.signedUrl) {
                window.open(document.signedUrl, '_blank');
            } else {
                console.error("No signed URL available for this document.");
            }
        } catch (error) {
            console.error("Error downloading document:", error);
        }

    }

    return (
        <>
            {/* Header - fixed at top */}
            <div className='flex justify-between items-center p-6 relative z-10'>
                <h1 className="text-2xl font-bold text-[#312895]">
                    {initialPage === "templates" ? "Download Template Documents" : initialPage === "upload" ? "Upload Documents" : "No Documents to Upload"}
                </h1>
                <CloseButton onClick={handleCloseModal}></CloseButton>
            </div>

            {initialPage === "templates" ? (

                <div className='flex flex-col items-center gap-2 mt-4 px-6 pb-6'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <h1 className='text-sm text-gray-600'>Templates</h1>
                        <ReusableDropdown
                            defaultValue={"All Templates"}
                            showAllOption={false}
                            options={isDocumentPage ? genDocOptions : isActivitiesPage ? actDocOptions : []}
                            onChange={
                                (e) => {
                                    handleTemplateFilter(e.target.value);
                                }
                            }
                        ></ReusableDropdown>
                    </div>
                    <div className='max-h-[25rem] min-h-[10rem] overflow-y-auto overflow-x-hidden w-full'>
                        {/* {console.log("Data:", data.map(doc => doc.documents))} */}
                        {data && data.length > 0 ? (
                            data.map((template, index) => (
                                template.documents?.map((document, index) => (
                                    <div
                                        key={document.id}
                                        onClick={() => downloadDocument(document)}
                                        title='download document'
                                        className='w-full justify-between items-center p-6 flex h-12 border border-mid-gray rounded cursor-pointer hover:bg-gray-100 mb-2'>
                                        <div
                                            className='flex items-center gap-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='size-4' fill="gray" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z" /></svg>
                                            <h1 className='truncate'>
                                                {document?.title || "Document Name"}
                                            </h1>
                                        </div>
                                        <p className='text-sm text-gray-600'>{document?.documentSize + ' MB' || ''}</p>
                                    </div>
                                ))
                            ))
                        ) : (
                            <div className='p-4 text-center text-gray-600'>
                                No templates available.
                            </div>
                        )}
                    </div>
                    <div className='w-full flex justify-end items-center mt-4'>
                        <Button
                            onClick={() => setInitialPage("upload")}
                            style={"secondary"}
                        >Next</Button>
                    </div>
                </div>
            ) :
                initialPage === "upload" ? (
                    <div className='px-6 pb-6'>
                        <div
                            onClick={() => setInitialPage("templates")}
                            className='mb-6 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512">
                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </div>
                        <div className='w-full flex flex-col md:flex-row justify-evenly items-start h-full overflow-hidden gap-8'>

                            <div
                                className='flex flex-col gap-4 w-full'>
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
                                <div className='flex justify-end items-start mt-4'>

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
                            <div className='flex flex-col gap-4 mb-4 w-full'>
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
                                <div className={`w-full flex justify-end items-center `}>
                                    <Button
                                        className={`w-full ${fileList.length > 0 ? '' : 'bg-gray-200 text-gray-500 cursor-pointer'}`}
                                        onClick={() => console.log("Upload documents clicked")}
                                        disabled={true}
                                    >
                                        Upload Documents
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className='w-full flex justify-center items-center h-full'>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold text-gray-700'>No documents to upload</h1>
                            <p className='text-gray-500'>Please select a document template to upload.</p>
                        </div>
                    </div>
                )
            }


        </>
    );
}

export default UploadBatchModal;