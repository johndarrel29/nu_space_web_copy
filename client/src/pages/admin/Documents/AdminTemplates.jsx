import { Button } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAdminDocuments } from '../../../hooks';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../../animations/DropIn";
import { Backdrop, CloseButton, TextInput, ReusableDropdown } from '../../../components';

// TODO: make the drag file working
// TODO: map the data

export default function AdminTemplates() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    // New states for upload modal
    const [uploadStep, setUploadStep] = useState(1); // 1 for document type selection, 2 for file upload
    const [documentType, setDocumentType] = useState("");
    const [uploadFiles, setUploadFiles] = useState([]);
    const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("");
    const [filters, setFilters] = useState({
        documentType: "",
        templatePage: 1,
        templateLimit: 10,
        templateSearch: ""
    });

    const {
        documentTemplate,
        documentTemplateLoading,
        documentTemplateError,
        documentTemplateQueryError,
        refetchDocumentTemplate,
        isDocumentTemplateRefetching,
    } = useAdminDocuments(filters);

    useEffect(() => {
        if (documentTemplateError) {
            console.error("Error fetching document template:", documentTemplateError);
        }
    }, [documentTemplateError]);

    console.log("Document Template:", documentTemplate?.documents?.flatMap(doc => doc.documents || []));
    const flattenedDocuments = documentTemplate?.documents?.flatMap(doc => doc.documents || []) || [];

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteTemplate = () => {
        // TODO: Implement delete template functionality
        console.log("Deleting template:", selectedTemplate);
        setShowDeleteModal(false);
        setSelectedTemplate(null);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        console.log("Category filter changed to:", e.target.value);
        // Here you would typically update your filters state or trigger a refetch
    };

    const handleDeleteCategoryChange = (e) => {
        setSelectedTemplateCategory(e.target.value);
        console.log("Category filter changed to:", e.target.value);
        // Here you would typically update your filters state or trigger a refetch
    };

    // Handle opening the upload modal
    const handleUploadClick = () => {
        setUploadStep(1);
        setDocumentType("");
        setUploadFiles([]);
        setShowUploadModal(true);
    };

    // Handle document type selection
    const handleDocumentTypeSelect = (type) => {
        setDocumentType(type);
        console.log("Selected document type:", type);
    };

    // Handle upload files selection
    const handleUploadFilesChange = (files) => {
        setUploadFiles(files);
        console.log("Files selected for upload:", files);
    };

    // Handle upload submission
    const handleUploadSubmit = () => {
        console.log("Uploading files of type:", documentType);
        console.log("Files to upload:", uploadFiles);
        setShowUploadModal(false);
        setUploadStep(1);
        setDocumentType("");
        setUploadFiles([]);
    };

    // Dropzone configuration
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        console.log('File received:', acceptedFiles[0]);
    }, []);

    // Dropzone for upload modal
    const uploadDropzone = useDropzone({
        onDrop: (acceptedFiles) => {
            // Create a formatted log of all files
            const fileDetails = acceptedFiles.map(file => ({
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                type: file.type
            }));

            console.table(fileDetails);
            handleUploadFilesChange(acceptedFiles);
        },
        multiple: true,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const handleDocumentTypeName = (type) => {
        if (type === "new_applicant_recognition") return "New Applicant Recognition";
        if (type === "off_campus_activities") return "Off-Campus Activities";
        if (type === "renewal_recognition") return "Renewal Recognition";
        return;
    }

    const handleDeleteDocument = (id) => {
        console.log("Deleting template with id:", id);
    };

    return (
        <div className="flex flex-col items-center justify-start w-full relative">
            {/* Back navigation button */}
            <div
                onClick={handleBackClick}
                className="absolute top-0 left-2 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-gray-600 size-4 group-hover:fill-off-black"
                    viewBox="0 0 448 512"
                >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </div>

            <div className="flex flex-col w-[800px] justify-center ">
                <div className="mb-6">
                    <Button onClick={handleUploadClick}>
                        <div className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='fill-white size-4' viewBox="0 0 640 640"><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z" /></svg>
                            Upload Files
                        </div>
                    </Button>
                </div>

                {/* Header section */}
                <div className="flex justify-between items-end mb-4">
                    <h1>All Templates</h1>
                    <div className='flex gap-4'>
                        {/* Static dropdown filter replacing the filter button */}
                        <div className='flex items-center gap-2'>
                            <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">Filter by:</label>
                            <select
                                id="category-filter"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                            >
                                {documentTemplate?.documents?.map((option) => (
                                    <option key={option._id} value={option._id}>
                                        {handleDocumentTypeName(option.documentFor)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button style="secondary" onClick={handleDeleteClick}>
                            <div className='flex gap-2 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
                                Delete Template
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Template item */}
                {flattenedDocuments.map((doc, index) => (
                    <div
                        key={doc.id}
                        className="w-full bg-white rounded border border-mid-gray p-4 flex justify-between items-center gap-4 cursor-pointer hover:bg-gray-100 mb-4"
                        onClick={() => setSelectedTemplate(doc)}
                    >
                        <div className="flex items-center justify-between w-full px-4">
                            <div className='flex gap-8 items-center'>
                                <p>{index + 1}</p>
                                <div className="flex flex-col">
                                    <h1 className="font-bold truncate max-w-[30rem]">{doc.title}</h1>
                                    <div className='flex gap-2 items-center'>
                                        <h2 className="text-gray-600 text-sm">Activity Document</h2>
                                        <div className='aspect-square rounded-full bg-gray-400 h-1 w-1'></div>
                                        <h1 className="text-gray-600 text-sm">{doc.documentSize} MB</h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => handleDeleteDocument(doc._id)}
                                className='rounded-full aspect-square h-8 flex items-center justify-center bg-white hover group'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-gray-800' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Template Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <>
                        <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
                        <motion.div
                            className="fixed inset-0 z-50 w-screen overflow-auto flex items-center justify-center"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl border border-gray-100">
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='text-sm font-semibold'>Delete Template</h2>
                                    <CloseButton onClick={() => setShowDeleteModal(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">Delete Template from:</label>
                                    <select
                                        id="category-filter"
                                        value={selectedTemplateCategory}
                                        onChange={handleDeleteCategoryChange}
                                        className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                    >
                                        {documentTemplate?.documents?.map((option) => (
                                            <option key={option._id} value={option._id}>
                                                {handleDocumentTypeName(option.documentFor)}
                                            </option>
                                        ))}
                                    </select>

                                    <div className='flex justify-end mt-4 gap-2'>
                                        <Button
                                            style="secondary"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            style="danger"
                                            onClick={handleDeleteTemplate}
                                        >
                                            Delete Template
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Upload Files Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <>
                        <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
                        <motion.div
                            className="fixed inset-0 z-50 w-screen overflow-auto flex items-center justify-center"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <div className="bg-white rounded-lg p-6 w-2/5 shadow-xl border border-gray-100">
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='text-sm font-semibold'>
                                        {uploadStep === 1 ? 'Select Document Type' : 'Upload Files'}
                                    </h2>
                                    <CloseButton onClick={() => setShowUploadModal(false)} />
                                </div>

                                {/* Step 1: Document Type Selection */}
                                {uploadStep === 1 && (
                                    <div className='flex flex-col gap-4'>
                                        <p className='text-sm text-gray-500 mb-2'>
                                            Please select the type of document you want to upload:
                                        </p>
                                        <div className='grid grid-cols-2 gap-3'>
                                            {documentTemplate?.documents.map((type) => (
                                                <div
                                                    key={type._id}
                                                    className={`p-4 border rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${documentType === type._id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                                                    onClick={() => handleDocumentTypeSelect(type._id)}
                                                >
                                                    <div className='w-12 h-12 mb-2 flex items-center justify-center bg-blue-100 rounded-full'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className='size-6 fill-primary' viewBox="0 0 384 512">
                                                            <path d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z" />
                                                        </svg>
                                                    </div>
                                                    <span className='font-medium text-sm'>{handleDocumentTypeName(type.documentFor)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className='flex justify-end mt-4 gap-2'>
                                            <Button
                                                style="secondary"
                                                onClick={() => setShowUploadModal(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => setUploadStep(2)}
                                                disabled={!documentType}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: File Upload */}
                                {uploadStep === 2 && (
                                    <div className='flex flex-col gap-4'>
                                        <p className='text-sm text-gray-500 mb-2'>
                                            Upload your {handleDocumentTypeName(documentTemplate?.documents.find(type => type._id === documentType)?.documentFor) || 'N/A'} template files:
                                        </p>

                                        <div
                                            {...uploadDropzone.getRootProps()}
                                            className='border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary'
                                        >
                                            <input {...uploadDropzone.getInputProps()} />
                                            <svg xmlns="http://www.w3.org/2000/svg" className='size-10 fill-gray-400 mb-3' viewBox="0 0 512 512">
                                                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64z" />
                                            </svg>
                                            {uploadFiles.length > 0 ? (
                                                <div>
                                                    <p className='text-primary font-medium'>{uploadFiles.length} file(s) selected</p>
                                                    <ul className='text-sm text-gray-500 mt-2'>
                                                        {uploadFiles.map((file, index) => (
                                                            <li key={index} className='truncate max-w-xs'>
                                                                {file.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className='text-center'>
                                                    <p className='font-medium'>Drag & drop files here, or click to select files</p>
                                                    <p className='text-sm text-gray-500 mt-1'>
                                                        Supports: PDF, DOC, DOCX
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex justify-between mt-4'>
                                            <Button
                                                style="secondary"
                                                onClick={() => setUploadStep(1)}
                                            >
                                                Back
                                            </Button>
                                            <div className='flex gap-2'>
                                                <Button
                                                    style="secondary"
                                                    onClick={() => setShowUploadModal(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleUploadSubmit}
                                                    disabled={uploadFiles.length === 0}
                                                >
                                                    Upload
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}