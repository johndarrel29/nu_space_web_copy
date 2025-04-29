import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Backdrop, CloseButton } from "../../components";
import TagSelector from "../TagSelector";
import deleteIcon from "../../assets/icons/trash-solid-white.svg";
import { handleShortenName } from "../../utils/handleShortenName";
import { DropIn } from "../../animations/DropIn";
import { useTagSelector } from "../../hooks";

//find a way to import category_RSO from server side;

export default function InputModal({
  onClose,
  id,
  acronym,
  image,
  name,
  category,
  description,
  college,
  status,
  tags,
  onConfirm,
}) {
  // State for form inputs
  const [userName, setUserName] = useState("");
  const [presetImage, setPresetImage] = useState(image || "");
  const [userImage, setUserImage] = useState("");
  const [userAcronym, setUserAcronym] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userCollege, setUserCollege] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userTags, setUserTags] = useState("");
  const [showSearch, setShowSearch] = useState([]);

  const {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    searchedData,
    handleTagClick
  } = useTagSelector();

  useEffect(() => {
    console.log("Current search query:", searchQuery);
  }, [searchQuery]);

  // Log received props for debugging
  useEffect(() => {
    console.log("Inside InputModal: received data:", {
      id,
      acronym,
      image,
      name,
      category,
      description,
      college,
      status,
      tags,
    });
  }, [id, acronym, image, name, category, description, college, status, tags]);

  // Update state when props change
  useEffect(() => {
    console.log("tags on modal open:", tags);
    setUserName(name || "");
    setUserAcronym(acronym || "");
    setUserImage(image || "");
    setUserCollege(college || "");
    setUserStatus(String(status) === "true");

    setUserTags(Array.isArray(tags) 
    ? tags.filter(tag => tag && tag.tag).map(tag => tag.tag).join(", ") 
    : ""
  );
    setUserCategory(category || "");
    setUserDescription(description || "");
  }, [acronym, image, name, category, description, college, status, tags]);

  // Debugging for category
  useEffect(() => {
    console.log("Selected type received in modal:", category);
  }, [category]);

    // Debugging for college
    useEffect(() => {
      console.log("Selected type received in modal:", college);
    }, [college]);
  

  const handleOpen = () => {
    onClose();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  };

  const handleConfirm = (action) => {
    console.log("Confirming action:", action);
    

    const updatedData = {
      RSO_id: id,
      RSO_name: userName,
      RSO_acronym: userAcronym,
      RSO_category: userCategory,
      RSO_description: userDescription,
      RSO_College: userCollege,
      RSO_status: userStatus === "true" || userStatus === true,
      RSO_tags: selectedTags.map(tag => tag.trim()),

      RSO_image: userImage || presetImage,
    };
    console.log("User data:", updatedData);

    if (action === "delete") {
      onConfirm(id, null);
    } else if (action === "save") {
      onConfirm(updatedData.RSO_id, updatedData);
    }

    onClose();
  };

  useEffect(() => {
    console.log("User status:", userStatus);
  }, [userStatus]);

  return (
    <>
      <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[800px] p-6"
          variants={DropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl font-semibold text-gray-800">
              Edit Organization: {handleShortenName(userName)}
            </h3>
            <CloseButton onClick={handleOpen} />
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[70vh] py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      className="w-32 h-32 rounded-lg object-cover border border-gray-300"
                      src={userImage || image}
                      alt="Organization"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Recommended size: 800x800px
                  </p>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acronym</label>
                    <input
                      type="text"
                      value={userAcronym}
                      onChange={(e) => setUserAcronym(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={userCategory}
                      onChange={(e) => setUserCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                          <option value="">Select a category</option>
                          <option value="Probationary">Probationary</option>
                          <option value="Professional & Affiliates">Professional & Affiliates</option>
                          <option value="Professional">Professional</option>
                          <option value="Special Interest">Special Interest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Tags */}
                <div>
                  <TagSelector
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setShowSearch={setShowSearch}
                    setIsFocused={setIsFocused}
                    searchedData={searchedData}
                    handleTagClick={handleTagClick}
                    selectedTags={selectedTags}
                    apiTags={tags}
                  />
                </div>

                {/* College */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <select
                    value={userCollege}
                    onChange={(e) => setUserCollege(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select college</option>
                    <option value="CAH">CAH</option>
                    <option value="COA">COA</option>
                    <option value="COA">COE</option>
                    <option value="CBA">CBA</option>
                    <option value="CCIT">CCIT</option>
                    <option value="CEAS">CEAS</option>
                    <option value="CTHM">CTHM</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="4"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => handleConfirm("delete")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <img src={deleteIcon} alt="delete" className="h-4 w-4" />
              Delete Organization
            </button>
            <div className="space-x-3">
              <button
                onClick={handleOpen}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm("save")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </Backdrop>
    </>
  );
}