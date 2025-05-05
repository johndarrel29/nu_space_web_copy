import React, { useState } from "react";
import InputModal from "../modals/InputModal";
import { AnimatePresence } from "framer-motion";
import { handleShortenName } from "../../utils/handleShortenName";
import DefaultPicture from "../../assets/images/default-profile.jpg";


//Error on passing data for category, tag, and college. (error for dropdowns and tags)

export default function RSOTable({ data = [], searchQuery, onUpdate, updateRSO, deleteRSO }) {
    const safeSearchQuery = searchQuery || '';
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    /**
     * Filters data based on the search query.
     * Matches RSO_name or RSO_acronym.
     */
    const searchedData = data.filter(org =>
        (org.RSO_name || '').toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
        (org.RSO_acronym || '').toLowerCase().includes(safeSearchQuery.toLowerCase())
    );

    const records = searchedData;

    /**
     * Handles showing the modal with the selected organization's data.
     * @param {Object} org - The selected organization.
     */
    const showModalInfo = (org) => {
        console.log("Selected data: ", org);
        setShowModal(true);
        setSelectedUser(org);
    };

    /**
     * Handles closing the modal and resetting the selected user.
     */
    const handleCloseModal = () => {
        console.log("Modal closed");
        setShowModal(false);
        setSelectedUser(null);
    };

    /**
     * Handles confirming updates or deletions for an organization.
     * @param {string} id - The ID of the organization.
     * @param {Object} updatedData - The updated data for the organization.
     */
    // const handleConfirm = async (id, updatedData) => {
    //     console.log("Confirming data", id, updatedData);

    //     if (!updatedData) {
    //         // Delete the organization if no updated data is provided
    //         await deleteRSO(id);
    //         onUpdate(data.filter(org => org._id !== id));
    //         return;
    //     }

    //     console.log("Saving or updating entry", updatedData);

    //     // Update the organization if it exists, otherwise add a new entry
    //     await updateRSO(id, updatedData);
    //     const updatedRecords = data.some(org => org._id === id)
    //         ? data.map(org => org._id === id ? { ...org, ...updatedData } : org)
    //         : [...data, updatedData];

    //     onUpdate(updatedRecords);
    // };
    const handleConfirm = async (id, updatedData) => {
        console.log("Confirming data", id, updatedData);
    
        if (!updatedData) {
            await deleteRSO(id);
            onUpdate(data.filter(org => org._id !== id));
            return;
        }


    // Check if tags are present and properly formatted; if not, use the selected user's tags
    const updatedTags = updatedData.RSO_tags && updatedData.RSO_tags.length > 0
    ? updatedData.RSO_tags.filter(tag => {
        if (typeof tag === 'string') return tag.trim() !== '';
        if (typeof tag === 'object' && tag !== null && tag.name) return tag.name.trim() !== '';
        return false;
    })
    : selectedUser.RSO_tags.map(tag => tag.tag);


    // Map frontend field names to match backend expectations
    const sanitizedData = {
        _id: id,
        RSO_name: updatedData.RSO_name,
        RSO_acronym: updatedData.RSO_acronym,
        RSO_category: updatedData.RSO_category,
        RSO_description: updatedData.RSO_description,
        RSO_College: updatedData.RSO_College,
        RSO_picture: updatedData.RSO_image || null,
        RSO_status: updatedData.RSO_status ? 1 : 0,
        RSO_tags: updatedTags, // Ensure correct tag format
    };
        console.log("Updated data", updatedData);
        console.log("Saving or updating entry", sanitizedData);
    
        await updateRSO(id, sanitizedData);
    
        const updatedRecords = data.some(org => org._id === id)
            ? data.map(org => org._id === id ? { ...org, ...sanitizedData } : org)
            : [...data, sanitizedData];
    
        onUpdate(updatedRecords);
    };
    
    return (
        <>
        {/* Table to display RSO records */}
        <table className="w-full">
            <tbody>
                {records.map((org, index) => {
                    
                    return (                       
                    <tr
                        key={index}
                        className="mb-4"
                        onClick={() => showModalInfo(org)}
                    >
                        <td className="pt-2   cursor-pointer mt-2">
                            <div className="hover:bg-gray-300 border border-mid-gray rounded-lg flex flex-row p-4 justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={org.RSO_picture || DefaultPicture}
                                        alt={org.RSO_name}
                                        width="50"
                                        height="50"
                                        className="mx-auto flex size-12 shrink-0 items-center justify-center border border-gray-300 rounded-full sm:mx-0 sm:size-10"
                                    />
                                    <div className="grid grid-col-1">
                                        <div>
                                            <h1 className="text-lg font-semibold">
                                                {handleShortenName(org.RSO_name)}
                                            </h1>
                                        </div>
                                        <div>
                                            {org.RSO_College}
                                        </div>
                                    </div>
                                </div>
                                
                                
                                <div>
                                    <h1 className="text-gray-600 text-sm">
                                        {org.RSO_category}
                                    </h1>
                                </div>
                            </div>
                        </td>
                    </tr>
                );
            }
                )}
            </tbody>
        </table>

        {/* Modal for editing or viewing organization details */}
        <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
        >
            {showModal && selectedUser && (
                <InputModal
                    onClose={handleCloseModal}
                    id={selectedUser?._id}
                    acronym={selectedUser.RSO_acronym}
                    image={selectedUser.RSO_picture}
                    name={selectedUser.RSO_name}
                    category={selectedUser.RSO_category}
                    description={selectedUser.RSO_description}
                    college={selectedUser.RSO_College}
                    status={selectedUser.RSO_status}
                    tags={selectedUser.RSO_tags.map(tag => tag.tag)}
                    onConfirm={handleConfirm}
                />
            )}
        </AnimatePresence>
        </>
    );
}