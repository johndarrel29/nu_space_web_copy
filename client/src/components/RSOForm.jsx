import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import defaultPic from '../assets/images/default-profile.jpg';


export default function RSOForm({ addOrganization, onSubmit }) {
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        orgName: "",
        acronym: "",
        email: "",
        phone: "",
        website: "",
        type: "",
        description: "",
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Generate ID if not present
        const newOrg = {
            id: formData.id || Date.now(), 
            ...formData,
            image: image || "No image uploaded" 
        };
        
        // Debugging message to log all data
        console.log("Form Data to be sent:", newOrg);
    
        addOrganization(newOrg);

        onSubmit && onSubmit("Organization added successfully!");

        // Reset form data
        setFormData({
            orgName: "",
            acronym: "",
            email: "",
            phone: "",
            website: "",
            type: "",
            description: "",
        });

        setImage(null);

        // Reset file input using the ref
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        
        // Reset file input
        document.getElementById('file_input').value = '';
    };
    

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
    };

    return (
        <>
         <div className="flex items-center space-x-4 mb-6">

                {/* Image Preview */}                      
                    <div 
                    className="bg-gray-500 mx-auto flex-none size-20 aspect-square shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-20 hover:bg-gray-300 transition duration-300 cursor-pointer"
                    style={{
                        backgroundImage: image ? `url(${image})` : `url(${defaultPic})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        }}
                    >
                    </div>                   
                            <div>                       
                                <label className=" block mb-2 text-sm font-medium text-gray-900 border-none dark:text-white " >Upload Profile Picture</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-300cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                 aria-describedby="file_input_help"                                
                                 type="file"
                                 id="file_input"
                                 accept="image/*"
                                 ref={fileInputRef}
                                 onChange={handleImageChange}

                                 required/>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" >SVG, PNG, JPG or GIF (MAX. 800x800px).</p>
                            </div>               
                        </div>
                    
                    {/* User Information */}
                    <form onSubmit={handleSubmit} >
                        
                        {/* Organization Name */}
                            <div className='mb-4'>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Name</label>
                                <input type="text" name='orgName' 
                                id="file_input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Organization Name" required 
                                 onChange={handleChange}
                                 value={formData.orgName}/>
                            </div>
                        {/* Organization Acronym */}
                            <div className='mb-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Acronym</label>
                                <input type="text" name="acronym" 
                                id="file_input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Acronym" required 
                                 onChange={handleChange}
                                 value={formData.acronym}/>
                            </div>
                        {/* Email, Phone, Website, Type of Organization */}
                            <div className="grid gap-4 mb-4 md:grid-cols-2">
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="text" name="email"
                                id="file_input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="...@national-u.edu.ph" required 
                                 onChange={handleChange}
                                 value={formData.email}/>
                            </div>  
                            <div className='mb-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input type="tel" name="phone" 
                                id="file_input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required  onChange={handleChange}
                                value={formData.phone}/>
                            </div>
                            <div className='mb-4'>
                                <label for="website" name="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
                                <input type="url" 
                                name="website"
                                id="file_input"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://www.website.com" required 
                                 onChange={handleChange}
                                 value={formData.website}/>
                            </div>
                            <div className='mb-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Type of Organization
                                </label>
                                <select 
                                    id="file_input"                                   
                                    name='type' 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 placeholder-gray-300 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required  onChange={handleChange}
                                    value={formData.type}
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
                            <label for="large-input" name="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Simple Description</label>
                            <input type="text"  
                            id="file_input"
                            name="description"
                            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={handleChange}
                            value={formData.description}/>
                        </div>
                    {/* Password */}
                        <div className='mb-4'>
                            <label for="password" 
                            id="file_input"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required 
                            />
                        </div> 
                    {/* Confirm Password */}
                        <div className='mb-4'>
                            <label for="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="password" id="file_input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div> 
                    {/* Remember Me */}
                        <div className="flex items-start mb-6">
                            <div className="flex items-center h-5">
                            <input id="file_input" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                            </div>
                            <label for="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <Link htmlFor="#" className="text-[#314095] hover:underline dark:text-blue-500">terms and conditions</Link>.
                            </label>
                        </div>
                    {/* Submit Button */}
                        <button type="submit" className="text-white bg-[#314095] hover:bg-[#2E3C88]  focus:outline-none  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
        </>
        
    );
}