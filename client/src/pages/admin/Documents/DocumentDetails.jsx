import { Button, TabSelector } from '../../../components';
import { useUserStoreWithAuth } from '../../../store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Switch from '@mui/material/Switch';

// TODO: Implement the functionality for the switches and forms
// connect the approve fetch to form
// figure out what to do with remarks tab

export default function DocumentDetails() {
    const { isUserRSORepresentative, isUserAdmin, isSuperAdmin, isCoordinator, isDirector, isAVP } = useUserStoreWithAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const { documentId, documentTitle, documentSize, documentType, url } = location.state || {};

    console.log("Document Details:", {
        documentId,
        documentTitle,
        documentSize,
        documentType,
        url
    });

    const tabs = [
        { label: "Action" },
        { label: "Details" },
        { label: "Remarks" }
    ]

    const [activeTab, setActiveTab] = useState(0);
    const [sendToDirector, setSendToDirector] = useState(false);
    const [isWatermarked, setIsWatermarked] = useState(false); // New state for watermark switch

    return (
        <div className="flex flex-col items-center justify-start w-full relative h-[600px] overflow-y-auto">
            {/* back navigation */}
            <div
                onClick={() => {
                    navigate(-1);
                }}
                className='absolute top-0 left-2 flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
                <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            </div>

            <div className="flex flex-col w-[800px] justify-center mb-4">
                {/* Document Detail */}
                <div
                    onClick={() => window.open(url, "_blank")}
                    className='w-full bg-white rounded border border-mid-gray p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 cursor-pointer hover:bg-gray-100'>
                    <div className='flex gap-3 sm:gap-4 items-center w-full'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='size-5 sm:size-6 fill-primary' viewBox="0 0 640 640"><path d="M304 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 272L376 272C336.2 272 304 239.8 304 200L304 112zM444.1 224L352 131.9L352 200C352 213.3 362.7 224 376 224L444.1 224zM128 128C128 92.7 156.7 64 192 64L325.5 64C342.5 64 358.8 70.7 370.8 82.7L493.3 205.3C505.3 217.3 512 233.6 512 250.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128z" /></svg>
                        </div>
                        <div className='flex flex-col max-w-full overflow-hidden'>
                            <h1 className='font-bold text-sm sm:text-base truncate'>{documentTitle || "Unknown Document"}</h1>
                            <div className='flex gap-2 items-center'>
                                <h2 className='text-gray-600 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]'>{documentType ?
                                    documentType.charAt(0).toUpperCase() + documentType.slice(1) : "Unknown Type"}</h2>
                                <div className='aspect-square h-1.5 sm:h-2 w-1.5 sm:w-2 bg-gray-400 rounded-full flex-shrink-0'></div>
                                <h2 className='text-gray-600 text-xs sm:text-sm'>{documentSize || "Unknown Size"} MB</h2>
                            </div>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-5 sm:size-6 mt-2 sm:mt-0 self-end sm:self-center' viewBox="0 0 640 640"><path d="M354.4 83.8C359.4 71.8 371.1 64 384 64L544 64C561.7 64 576 78.3 576 96L576 256C576 268.9 568.2 280.6 556.2 285.6C544.2 290.6 530.5 287.8 521.3 278.7L464 221.3L310.6 374.6C298.1 387.1 277.8 387.1 265.3 374.6C252.8 362.1 252.8 341.8 265.3 329.3L418.7 176L361.4 118.6C352.2 109.4 349.5 95.7 354.5 83.7zM64 240C64 195.8 99.8 160 144 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L144 224C135.2 224 128 231.2 128 240L128 496C128 504.8 135.2 512 144 512L400 512C408.8 512 416 504.8 416 496L416 416C416 398.3 430.3 384 448 384C465.7 384 480 398.3 480 416L480 496C480 540.2 444.2 576 400 576L144 576C99.8 576 64 540.2 64 496L64 240z" /></svg>
                </div>

                {/* Description */}
                <table className='w-1/2 border-collapse mt-8'>
                    <tr>
                        <td className='text-gray-600 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4' viewBox="0 0 640 640"><path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z" /></svg>
                            Submitted By
                        </td>
                        <td>
                            No User Found
                        </td>
                    </tr>
                    <tr>
                        <td className='text-gray-600 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4' viewBox="0 0 640 640"><path d="M96 280C96 213.7 149.7 160 216 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L216 224C185.1 224 160 249.1 160 280L160 288L224 288C259.3 288 288 316.7 288 352L288 416C288 451.3 259.3 480 224 480L160 480C124.7 480 96 451.3 96 416L96 280zM352 280C352 213.7 405.7 160 472 160L480 160C497.7 160 512 174.3 512 192C512 209.7 497.7 224 480 224L472 224C441.1 224 416 249.1 416 280L416 288L480 288C515.3 288 544 316.7 544 352L544 416C544 451.3 515.3 480 480 480L416 480C380.7 480 352 451.3 352 416L352 280z" /></svg>
                            Title
                        </td>
                        <td>
                            Untitled
                        </td>
                    </tr>
                    <tr>
                        <td className='text-gray-600 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4' viewBox="0 0 640 640"><path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 237.3C496 233.1 494.3 229 491.3 226L416 150.6L416 240C416 257.7 401.7 272 384 272L224 272C206.3 272 192 257.7 192 240L192 144L160 144zM240 144L240 224L368 224L368 144L240 144zM96 160C96 124.7 124.7 96 160 96L402.7 96C419.7 96 436 102.7 448 114.7L525.3 192C537.3 204 544 220.3 544 237.3L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM256 384C256 348.7 284.7 320 320 320C355.3 320 384 348.7 384 384C384 419.3 355.3 448 320 448C284.7 448 256 419.3 256 384z" /></svg>
                            Size
                        </td>
                        <td>
                            No Data
                        </td>
                    </tr>
                </table>

                <div className='mt-8 mb-4'>
                    <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}></TabSelector>
                </div>

                {activeTab === 0 && (
                    <div>
                        {/* add text area here */}
                        <textarea
                            rows="4"
                            name="RSO_description"
                            className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Add remarks on the document."
                        />
                        {/* send to director boolean */}
                        <div className="flex items-center mt-4 mb-4 ">
                            <table>
                                {/* director boolean row */}
                                <tr>
                                    <td>
                                        <h2 className='text-sm text-gray-600 mr-2'>Send to Director?</h2>
                                    </td>
                                    <td className='flex items-center gap-2'>
                                        <Switch
                                            checked={sendToDirector}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                console.log("Switch toggled", isChecked);
                                                setSendToDirector(isChecked);
                                                // Additional functionality can be added here
                                            }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#312895',
                                                    '& + .MuiSwitch-track': {
                                                        backgroundColor: '#312895',
                                                    },
                                                },
                                            }}
                                        />
                                        <div className={`text-sm px-2 py-1  rounded ${sendToDirector ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <h1 className={`text-sm ${sendToDirector ? 'text-green-800' : 'text-red-800'}`}>{sendToDirector ? 'Yes' : 'No'}</h1>
                                        </div>
                                    </td>
                                </tr>

                                {/* watermark boolean row */}
                                <tr>
                                    <td>
                                        <h2 className='text-sm text-gray-600 mr-2'>Is Watermarked?</h2>
                                    </td>
                                    <td className='flex items-center gap-2'>
                                        <Switch
                                            checked={isWatermarked}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                console.log("Watermark switch toggled", isChecked);
                                                setIsWatermarked(isChecked);
                                                // Additional functionality can be added here
                                            }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#312895',
                                                    '& + .MuiSwitch-track': {
                                                        backgroundColor: '#312895',
                                                    },
                                                },
                                            }}
                                        />
                                        <div className={`text-sm px-2 py-1  rounded ${isWatermarked ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <h1 className={`text-sm ${isWatermarked ? 'text-green-800' : 'text-red-800'}`}>{isWatermarked ? 'Yes' : 'No'}</h1>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div className='w-full flex justify-end gap-2 mt-4'>
                            <Button>
                                <div className='flex gap-2 items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 640 640"><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" /></svg>
                                    Approve
                                </div>
                            </Button>
                            <Button style={"secondary"}>
                                <div className='flex gap-2 items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='size-4' fill='current' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                    Decline
                                </div>
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 1 && (
                    <div>
                        <h2 className='text-sm text-gray-600'>Description</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                )}

                {activeTab === 2 && (
                    <div>
                        <h2>Remarks</h2>
                    </div>
                )}

                {!isUserAdmin && (
                    <>
                        <h1>Actions</h1>
                        <div className='w-full flex justify-start items-center mt-4'>
                            Actions
                        </div>
                        <div className='w-full rounded bg-mid-gray h-[100px]'>
                            input message actions
                        </div>
                        <div className='w-full flex justify-end items-center gap-4 mt-4'>
                            <Button style={"secondary"}>Reject</Button>
                            <Button>Approve</Button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
