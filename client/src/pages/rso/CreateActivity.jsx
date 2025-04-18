import { useNavigate } from "react-router-dom";
import { Button } from "../../components";

export default function CreateActivity() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-start bg-white rounded-lg shadow-md p-6 relative w-full">
            <Button 
                style={"secondary"}
                onClick={() => window.history.back()}
                className={"p-2 mb-6"}
            >
                <div className="flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-4" viewBox="0 0 512 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/></svg>
                    <h1>Go Back</h1>
                </div>
            </Button>

            <h1 className="text-2xl font-bold mb-6">Edit Activity</h1>

            <form className="w-full space-y-6">
                {/* Activity Banner */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Activity Banner</label>
                    <div className="w-full h-48 rounded-md bg-gradient-to-b from-mid-gray to-gray-500 flex items-center justify-center cursor-pointer">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-white mt-2">Click to upload banner image</p>
                        </div>
                    </div>
                </div>

                {/* Activity Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Activity Title</label>
                    <input 
                        type="text" 
                        defaultValue="The Event Conference" 
                        className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Date</label>
                        <input 
                            type="date" 
                            defaultValue="2023-10-14" 
                            className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Start Time</label>
                            <input 
                                type="time" 
                                defaultValue="04:00" 
                                className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">End Time</label>
                            <input 
                                type="time" 
                                defaultValue="07:00" 
                                className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Location</label>
                    <select 
                        className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="online"
                    >
                        <option value="online">Online</option>
                        <option value="physical">Physical Location</option>
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea 
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla, nunc a facilisis tincidunt, erat nisi convallis enim, nec efficitur enim nunc id ligula."
                        className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Upload Documents</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-mid-gray border-dashed rounded-lg cursor-pointer bg-light-gray hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, DOCX, or JPG (MAX. 10MB)</p>
                            </div>
                            <input type="file" className="hidden" multiple />
                        </label>
                    </div>
                </div>

                {/* Attendee Count */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Number of Attendees</label>
                    <input 
                        type="number" 
                        placeholder="Enter number of attendees" 
                        className="w-full p-2 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button 
                        style={"secondary"}
                        className="px-6 py-2"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="px-6 py-2"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}