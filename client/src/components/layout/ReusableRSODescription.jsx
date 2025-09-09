import TagSelector from '../TagSelector';
import { useState } from 'react';
import { useTagSelector } from '../../hooks';
import { useLocation } from 'react-router-dom';

export default function ReusableRSODescription({ rsoDetailData }) {
    const location = useLocation();
    const showLink = true;
    const { user } = location.state || {};

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

    function getRecognitionStatusColor(status) {
        const value = String(status || '').toLowerCase();
        if (value === 'recognized') return 'bg-green-100 text-green-800';
        if (value === 'renewal') return 'bg-blue-100 text-blue-800';
        if (value === 'new_rso') return 'bg-purple-100 text-purple-800';
        if (value === 'pending') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    }

    return (
        <div>
            {/* Category and Tags */}
            <h2 className='text-sm font-light text-gray-600'>{rsoDetailData?.data?.RSO_snapshot?.category || "RSO Category"}</h2>
            <div className='mt-4'>
                <TagSelector
                    style={"view"}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsFocused={setIsFocused}
                    searchedData={searchedData}
                    handleTagClick={handleTagClick}
                    selectedTags={selectedTags}
                    apiTags={rsoDetailData?.data?.RSOid?.RSO_tags}
                />
            </div>

            {/* Stats Section */}
            <div className=" flex flex-wrap gap-4">
                {/* Members Count Card */}
                <div className="flex bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="w-2 bg-gradient-to-b from-[#312895] to-[#5a4ca8]"></div>
                    <div className="flex items-center p-4 gap-3">
                        <div className="flex items-center justify-center h-10 w-10 bg-[#312895] bg-opacity-10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-[#312895] size-5" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0c-14.7 0-26.7-11.9-26.7-26.7z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Members</p>
                            <p className="text-xl font-bold text-off-black">{user?.RSO_memberCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* profile details */}
            <div className='w-full flex items-center justify-center mt-4'>
                <div className='flex flex-col lg:flex-row items-start gap-4 w-full'>
                    {/* Description Card */}
                    <div className='h-auto w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm'>
                        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">Description</p>
                        <p className='text-sm text-gray-700'>{rsoDetailData?.data?.RSOid?.RSO_description || "No RSO description provided."}</p>
                    </div>



                    {/* Info Table */}
                    <div className="w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                        <table className="w-full border-separate border-spacing-y-2">
                            <tbody>
                                <tr>
                                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Status</td>
                                    <td className="text-sm py-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`capitalize inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRecognitionStatusColor(rsoDetailData?.data?.RSO_recognition_status?.status)}`}
                                            >
                                                {rsoDetailData?.data?.RSO_recognition_status?.status || 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1 w-1/3">Acronym</td>
                                    <td className="text-sm font-medium text-off-black py-1">{rsoDetailData?.data?.RSOid?.RSO_acronym || "RSO Acroynm"}</td>
                                </tr>
                                <tr>
                                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">College</td>
                                    <td className="text-sm font-medium text-off-black py-1">{rsoDetailData?.data?.RSOid?.RSO_College || "No College"}</td>
                                </tr>
                                {/* <tr>
                                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Forms</td>
                                    <td className="text-sm py-1">
                                        {showLink && rsoDetailData?.data?.RSOid?.RSO_forms ? (
                                            <a
                                                href={rsoDetailData?.data?.RSOid?.RSO_forms}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[#312895] hover:text-[#493ec4] transition-colors truncate max-w-[40px] sm:max-w-[400px]"
                                                title='Click to view the form'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-current shrink-0" viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                                                {user?.RSO_forms || "no forms found"}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 text-sm">No forms available</span>
                                        )}
                                    </td>
                                </tr> */}
                                <tr>
                                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Managed By</td>
                                    <td className="text-sm font-medium text-off-black py-1">
                                        {rsoDetailData?.data?.RSOid?.RSO_assignedUsers?.length > 0
                                            ? rsoDetailData.data.RSOid.RSO_assignedUsers.map((rsoUser, index) => (
                                                `${rsoUser.firstName} ${rsoUser.lastName}${index < rsoDetailData.data.RSOid.RSO_assignedUsers.length - 1 ? ', ' : ''}`
                                            ))
                                            : "No assigned users"
                                        }
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}