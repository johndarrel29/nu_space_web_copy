// UploadDocumentsModal.jsx
import React from "react";
import Button from "../ui/Button"; 
import CloseButton from "../ui/CloseButton"; 
import { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'

const UploadDocumentsModal = ({
  
  msg,
  handleCloseModal,
  handleFileChange,
  handleSubmit,
  removeFile,
}) => {
  const [files, setFiles] = React.useState([]);
  const onDrop = useCallback(acceptedFiles => {
    setFiles((prevFiles) => [
      ...prevFiles,
    ...acceptedFiles]);
  }, [setFiles]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#312895]">Upload Documents</h2>
        <CloseButton onClick={handleCloseModal} />
      </div>

      <div className="mb-4 p-4 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB] h-48 flex items-center justify-center">
        {/* dropzone icon */}


        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-8" viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                  <p>Drop the files here ...</p>
                </div>
            ) :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      </div>


      {files?.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex justify-between p-3 bg-[#312895]/5 rounded-lg">
              <p className="text-[#312895]">{file.name}</p>
              <p className="text-sm text-[#312895]/70">{(file.size / 1024).toFixed(2)} KB</p>
              <button onClick={() => removeFile(index)} className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-3">
        <Button style="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#312895] hover:bg-[#312895]/90 text-white"
          disabled={!files || files.length === 0}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadDocumentsModal;
