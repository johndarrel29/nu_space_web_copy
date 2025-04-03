import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultPic from '../assets/images/default-profile.jpg';
import { Searchbar, SearchResultsList } from '../components';
import  useSearchQuery  from "../hooks/useSearchQuery";

//And all other suggestions made by the GPT

//there's tags already present for each rso, find a way to display them in the modal 

//Future Idea: Create a table for the whole RSO instead of the history form displaying all of them

export default function RSOForm({ createRSO, onSubmit }) {
    const { searchQuery, setSearchQuery } = useSearchQuery(); 
    const [showSearch, setShowSearch] = useState([]);
    const [ tags, setTags ] = useState([]);
    const safeSearchQuery = searchQuery || '';
    const [selectedTags, setSelectedTags] = useState([]);

    // State for RSO picture and form data
    const [RSO_picture, setRSOPicture] = useState(null);
    const [formData, setFormData] = useState({
        RSO_name: "",
        RSO_acronym: "",
        RSO_category: "",
        RSO_tags: "",
        RSO_College: "",
        RSO_status: "",
        RSO_description: "",
    });


    useEffect(() => {
        async function fetchTags() {
            const token = localStorage.getItem("token");
            console.log("Stored token:", token);
      
            const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

            const headers = {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
              };

            try {
                console.log("Fetching tags from:", process.env.REACT_APP_FETCH_TAGS_URL);
                const response = await fetch(`${process.env.REACT_APP_FETCH_TAGS_URL}`, {
                    method: "GET",
                    headers,
                  });
          
                const data = await response.json();
                setTags(data.tags.map(tagObj => tagObj.tag)); 
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        }
        fetchTags();
    }, []);
   
    const searchedData = tags.filter(tag =>
        searchQuery && tag.toLowerCase().includes(safeSearchQuery.toLowerCase())
    );

    console.log("Searched Data:", searchedData);
    console.log("Tags:", tags);

    
    useEffect(() => {
        console.log("Current search query:", searchQuery);
    }, [searchQuery]);

    


    const fileInputRef = useRef(null);

    /**
     * Handles changes in form inputs and updates the state.
     * @param {Object} e - The event object.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Handles form submission.
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        // Generate ID if not present and prepare the new organization data
        const newOrg = {
            id: formData.id || Date.now(),
            ...formData,
            RSO_tags: selectedTags,
            RSO_picture: RSO_picture || "No RSO_picture uploaded"
        };

        console.log("Form Data to be sent:", newOrg);

        // Call the createRSO function passed as a prop
        await createRSO(newOrg);

        // Reset form data and picture
        setFormData({
            RSO_name: "",
            RSO_acronym: "",
            RSO_category: "",
            RSO_tags: "",
            RSO_College: "",
            RSO_status: "",
            RSO_description: "",
        });
        setRSOPicture(null);
        setSelectedTags([]);
        setSearchQuery("");

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Call the onSubmit callback if provided
        onSubmit && onSubmit("Organization added successfully!");
    };

    /**
     * Handles image file selection and updates the RSO picture state.
     * @param {Object} event - The event object.
     */
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setRSOPicture(imageUrl);
        }
    };

    function handleTagClick(tag) {
        console.log("Tag clicked:", tag);
    
        // If the tag is already selected, remove it; otherwise, add it
        setSelectedTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
        //empty the search query
        setSearchQuery("");
        
    }
    
    

    return (
        <>
            {/* Image Upload Section */}
            <div className="flex items-center space-x-4 mb-6">
                <div
                    className="bg-mid-gray border border-mid-gray mx-auto flex-none size-20 aspect-square shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-20 hover:bg-gray-300 transition duration-300 cursor-pointer"
                    style={{
                        backgroundImage: RSO_picture ? `url(${RSO_picture})` : `url(${defaultPic})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
                <div>
                    <label className="block mb-2 text-sm font-medium rounded-lg text-gray-900 border-none dark:text-white">Upload Profile Picture</label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-mid-gray cursor-pointer rounded-sm bg-textfield dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-describedby="file_input_help"
                        type="file"
                        id="file_input"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">SVG, PNG, JPG or GIF (MAX. 800x800px).</p>
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                {/* Organization Name */}
                <div className='mb-4'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Name</label>
                    <input
                        type="text"
                        name='RSO_name'
                        className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Organization Name"
                        required
                        onChange={handleChange}
                        value={formData.RSO_name}
                    />
                </div>

                {/* Organization Acronym */}
                <div className='mb-4'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Acronym</label>
                    <input
                        type="text"
                        name="RSO_acronym"
                        className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Acronym"
                        required
                        onChange={handleChange}
                        value={formData.RSO_acronym}
                    />
                </div>

                {/* Tag */}
                <div className=' mb-4'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tag</label>
                    <div className='p-2 pl-4 pr-4'>
                        <div className=' relative'>
                            <Searchbar
                            placeholder="Search a tag"
                            style="secondary"
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery} 
                            setShowSearch={setShowSearch}
                            />

                        <SearchResultsList 
                        showSearch={searchedData} 
                        searchQuery={searchQuery} 
                        handleTagClick={handleTagClick}
                        />    

                        </div>

                    {/* tag table */}
                    <div className='w-full p-2 mt-2 bg-white border border-mid-gray rounded-lg'>
                        
                        <div className='grid grid-cols-4 items-center justify-center space-y-2'>
                            {/* tag */}

                            { selectedTags.length > 0 ? 
                            selectedTags.map((tag, index) => (
                                <span key={index} className="flex items-center justify-center  bg-blue-100 text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded-[50px] dark:bg-gray-700 dark:text-primary border border-primary">
                                <div className='flex flex-row items-center space-x-2 p-1 '>
                                    <h1 className='text-sm text-dark-gray text-primary'>{tag}</h1>
                                    <div
                                    onClick={() => handleTagClick(tag)}
                                    className='cursor-pointer hover:bg-gray-200 rounded-full p-1'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-primary size-4" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                    </div>
                                </div>
                            </span>
                            )
                        ) : (
                                <h1 className='text-sm text-dark-gray'><em>No tags selected.</em></h1>
                        )}

                            
                        </div>                       
                    </div>
                    </div>



                </div>

                {/* Status Checkbox */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <div className='flex flex-row'>
                        <input
                            id="default-checkbox-true"
                            type="radio"
                            checked={formData.RSO_status === true}
                            onChange={() => setFormData({ ...formData, RSO_status: true })}
                            className="w-4 h-4 text-blue-600 bg-blue-600 border-blue-600 rounded-sm"
                        />
                        <label htmlFor="default-checkbox-true" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">True</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="default-checkbox-false"
                            type="radio"
                            checked={formData.RSO_status === false}
                            onChange={() => setFormData({ ...formData, RSO_status: false })}
                            className="w-4 h-4 text-blue-600 bg-blue-600 border-blue-600 rounded-sm"
                        />
                        <label htmlFor="default-checkbox-false" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">False</label>
                    </div>
                </div>

                {/* Grid for RSO Colleges & Organization Type */}
                <div className="grid gap-4 mb-4 md:grid-cols-2">
                    <div className='mb-4'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Colleges</label>
                        <select
                            name='RSO_College'
                            className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-lg focus:ring-blue-500 placeholder-gray-300 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            onChange={handleChange}
                            value={formData.RSO_College}
                        >
                            <option value="" disabled className='text-gray-300'>Select College</option>
                            <option value="CAH">CAH</option>
                            <option value="CA">CA</option>
                            <option value="CBA">CBA</option>
                            <option value="CCIT">CCIT</option>
                            <option value="CEAS">CEAS</option>
                            <option value="CE">CE</option>
                            <option value="CTHM">CTHM</option>
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type of Organization</label>
                        <select
                            name='RSO_category'
                            className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-lg focus:ring-blue-500 placeholder-gray-300 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            onChange={handleChange}
                            value={formData.RSO_category}
                        >
                            <option value="" disabled className='text-gray-300'>Select an organization type</option>
                            <option value="Probationary">Probationary</option>
                            <option value="Professional and Affiliates">Professional & Affiliates</option>
                            <option value="Professional">Professional</option>
                            <option value="Special Interest">Special Interest</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className='mb-4'>
                    <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Simple Description</label>
                    <textarea
                        type="text"
                        rows="4"
                        name="RSO_description"
                        className="block w-full p-4 text-gray-900 border border-mid-gray rounded-lg bg-textfield text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={handleChange}
                        value={formData.RSO_description}
                    />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input
                            id="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-mid-gray rounded-sm bg-textfield focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I agree with the <Link to="#" className="text-[#314095] hover:underline dark:text-blue-500">terms and conditions</Link>.
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="text-white bg-[#314095] hover:bg-[#2E3C88] focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary"
                >
                    Submit
                </button>
            </form>
        </>
    );
}