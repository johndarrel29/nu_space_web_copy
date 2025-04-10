import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Backdrop, CloseButton } from "../../components";
import  TagSelector  from "../TagSelector";
import deleteIcon from "../../assets/icons/trash-solid-white.svg";
import { handleShortenName } from "../../utils/handleShortenName";
import  { DropIn }  from "../../animations/DropIn";
import { useTagSelector } from "../../hooks"

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
    setUserName(name || "");
    setUserAcronym(acronym || "");
    setUserImage(image || "");
    setUserCollege(college || "");
    setUserStatus(status === true || status === "true" ? true : status === false || status === "false" ? false : status);
    setUserTags(Array.isArray(tags) ? tags.map(tag => tag.tag).join(", ") : "");
    setUserCategory(category || "");
    setUserDescription(description || "");
  }, [acronym, image, name, category, description, college, status, tags]);

  // Debugging for category
  useEffect(() => {
    console.log("Selected type received in modal:", category);
  }, [category]);

  /**
   * Handles closing the modal.
   */
  const handleOpen = () => {
    onClose();
  };


  /**
   * Handles image file selection and updates the user image state.
   * @param {Object} event - The file input event.
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  };

  /**
   * Handles confirming updates or deletions for the organization.
   * @param {string} action - The action to perform ("delete" or "save").
   */
  const handleConfirm = (action) => {
    const updatedData = {
      RSO_id: id,
      RSO_name: userName,
      RSO_acronym: userAcronym,
      RSO_category: userCategory,
      RSO_description: userDescription,
      RSO_college: userCollege,
      RSO_status: userStatus === "true" || userStatus === true,
      RSO_tags: userTags.split(',').map(tag => tag.trim()), // Ensure tags are an array
      RSO_image: userImage || presetImage,
    };

    if (action === "delete") {
      onConfirm(id, null); // Delete the organization
    } else if (action === "save") {
      onConfirm(updatedData.RSO_id, updatedData); // Save or update the organization
    }

    onClose(); // Close the modal
  };

  useEffect(() => {
    console.log("User status:", userStatus);
  }, [userStatus]);

  return (
    <>
      {/* Backdrop */}
      <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Modal */}
        <motion.div
          className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
          variants={DropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold">
              {"About" + " " + handleShortenName(userName)}
            </h3>
            <CloseButton onClick={handleOpen}/>
          </div>

          {/* Modal Content */}
          <div className="overflow-x-auto max-h-[80vh]">
            <div className="p-4">
              {/* Image Upload Section */}
              <div className="flex items-center flex-col justify-center mb-4">
                <img
                  className="w-40 h-40 bg-gray-500 rounded-full margin-auto border border-gray-400"
                  src={userImage || image}
                  alt="profile"
                />
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 border-none dark:text-white"
                    htmlFor="file_input"
                  ></label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                    SVG, PNG, JPG or GIF (MAX. 800x800px).
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              {/* RSO Name */}
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-2 font-bold text-lg">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={name}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border py-2 px-3 text-grey-darkest"
                />
              </div>

              {/* Acronym */}
              <div className="flex flex-col mb-4">
                <label htmlFor="acronym" className="mb-2 font-bold text-lg">
                  Acronym
                </label>
                <input
                  type="text"
                  id="acronym"
                  name="acronym"
                  defaultValue={acronym}
                  onChange={(e) => setUserAcronym(e.target.value)}
                  className="border py-2 px-3 text-grey-darkest"
                />
              </div>

              {/* Category and Tags */}
              
                {/* Category */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="type" className="mb-2 font-bold text-lg">
                    Category
                  </label>
                  <select
                    type="text"
                    id="category"
                    name="category"
                    className="block w-full py-3 text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    defaultValue={category}
                    onChange={(e) => setUserCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled className="text-gray-300">
                      Select an organization type
                    </option>
                    <option value="Probationary">Probationary</option>
                    <option value="Professional and Affiliates">Professional & Affiliates</option>
                    <option value="Professional">Professional</option>
                    <option value="Special Interest">Special Interest</option>
                  </select>
                </div>

                {/* Tags */}
                 {/* <div className="flex flex-col mb-4">
                  <label htmlFor="type" className="mb-2 font-bold text-lg">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    defaultValue={tags}
                    onChange={(e) => setUserTags(e.target.value)}
                    className="border py-2 px-3 text-grey-darkest"
                  />
                </div>  */}

              {/* Tags Management */}
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

              {/* Colleges */}
              <div className="mb-4">
                <label className="mb-4 font-bold text-lg">Colleges</label>
                <select
                  id="file_input"
                  name="RSO_college"
                  className="block w-full py-3 text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  required
                  onChange={(e) => setUserCollege(e.target.value)}
                  defaultValue={college}
                >
                  <option value="" disabled className="text-gray-300">
                    Select College
                  </option>
                  <option value="CAH">CAH</option>
                  <option value="CA">CA</option>
                  <option value="CBA">CBA</option>
                  <option value="CCIT">CCIT</option>
                  <option value="CEAS">CEAS</option>
                  <option value="CE">CE</option>
                  <option value="CTHM">CTHM</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col mb-4">
                <label htmlFor="category" className="mb-2 font-bold text-lg">
                  Description
                </label>
                <textarea
                  type="description"
                  rows="4"
                  id="description"
                  name="description"
                  defaultValue={description}
                  onChange={(e) => setUserDescription(e.target.value)}
                  className="border py-2 px-3 text-grey-darkest"
                />
              </div>

              {/* Status Checkbox */}
              <div className="mb-4">
                <label className="mb-2 font-bold text-lg">Status</label>
                <div className="flex flex-row">
                  <input
                    id="status-true"
                    type="radio"
                    checked={userStatus === true}
                    onChange={() => setUserStatus(true)}
                    className="w-4 h-4 text-blue-600 bg-blue-600 border-blue-600 rounded-sm"
                  />
                  <label htmlFor="status-true" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    True
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="status-false"
                    type="radio"
                    checked={userStatus === false}
                    onChange={() => setUserStatus(false)}
                    className="w-4 h-4 text-blue-600 bg-blue-600 border-blue-600 rounded-sm"
                  />
                  <label htmlFor="status-false" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    False
                  </label>
                </div>
              </div>

              {/* Save and Delete Buttons */}
              <div className="flex justify-end border-t pt-2">
                <button
                  onClick={() => handleConfirm("delete")}
                  className="cursor-pointer p-6 py-2 bg-[#FF2C2C] rounded-md h-10 text-white hover:bg-[#D12525]"
                >
                  <div className="flex items-center gap-2">
                    <img src={deleteIcon} alt="delete" className="size-4" />
                    Delete
                  </div>
                </button>
                <button
                  className="cursor-pointer px-4 py-2 bg-[#314095] text-white rounded-md ml-2 h-10 hover:bg-[#2E3C88]"
                  onClick={() => handleConfirm("save")}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Backdrop>
    </>
  );
}