// UploadDocumentsModal.jsx
import React from "react";
import Button from "../ui/Button"; 
import CloseButton from "../ui/CloseButton"; 

const UploadDocumentsModal = ({
  files,
  msg,
  handleCloseModal,
  handleFileChange,
  handleSubmit,
  removeFile,
  setFiles
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#312895]">Upload Documents</h2>
        <CloseButton onClick={handleCloseModal} />
      </div>

      <div className="file-upload-container">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#312895]/30 rounded-lg bg-[#312895]/5 hover:bg-[#312895]/10 cursor-pointer transition-colors"
        >
          <svg className="fill-[#312895] size-12 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
          </svg>
          <span className="text-[#312895] font-medium">Click to browse files here</span>
          <span className="text-sm text-[#312895]/70 mt-1">Supports: PDF, DOCX, XLSX (Max 10MB)</span>
        </label>
      </div>

      {files && files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-[#312895]/5 rounded-lg gap-2">
              <div className="flex-col items-start w-full">
                <div className="group block w-full">
                  <div className="flex items-start justify-between w-full text-left font-medium text-slate-800">
                    <div className="flex flex-col">
                      <p className="text-[#312895] font-medium truncate max-w-[300px]">{file.name}</p>
                      <p className="text-sm text-[#312895]/70">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div title="Add title and description" className="flex gap-2 hover:underline hover:decoration-primary cursor-pointer">
                      <h1 className="text-sm text-[#312895]/70 hidden">Add title and description</h1>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </div>
                  </div>
                  <div className="overflow-hidden transition-all duration-300 border-b border-slate-200 pl-1 pr-1">
                    <textarea
                      rows="4"
                      name="description"
                      value={files[index].description || ""}
                      onChange={(e) => {
                        const updated = [...files];
                        updated[index].description = e.target.value;
                        setFiles(updated);
                      }}
                      className="mt-2 w-full p-2 border border-[#312895]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#312895]/50"
                      placeholder="File description"
                    />
                  </div>
                </div>
              </div>
              <button onClick={() => removeFile(index)} className="text-[#312895] hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {msg && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${msg.includes("failed") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {msg}
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
