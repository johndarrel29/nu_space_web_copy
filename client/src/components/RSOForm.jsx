import { useState } from 'react';


export default function RSOForm({ addOrganization }) {
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
         <div className="flex items-center space-x-4">
                        
                    <div 
                    className="bg-gray-500 mx-auto flex-none size-20 aspect-square shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-20 hover:bg-gray-300 transition duration-300 cursor-pointer"
                    style={{
                        backgroundImage: image ? `url(${image})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        }}
                    ></div>
        
                            <div>                       
                                <label className=" block mb-2 text-sm font-medium text-gray-900 border-none dark:text-white " for="file_input">Upload Profile Picture</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-300cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                 aria-describedby="file_input_help"
                                 id="file_input"
                                 type="file"
                                 accept="image/*"
                                 onChange={handleImageChange}/>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                            </div>               
                        </div>
                    <form onSubmit={handleSubmit} >
                        
                            <div>
                                <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Name</label>
                                <input type="text" name='OrgName' id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required 
                                 onChange={handleChange}/>
                            </div>
                            <div>
                                <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Acronym</label>
                                <input type="text" name="acronym" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required 
                                 onChange={handleChange}/>
                            </div>
                            <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label for="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="text" name="email" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Flowbite" required 
                                 onChange={handleChange}/>
                            </div>  
                            <div>
                                <label for="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                <input type="tel" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required  onChange={handleChange}/>
                            </div>
                            <div>
                                <label for="website" name="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website URL</label>
                                <input type="url" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required 
                                 onChange={handleChange}/>
                            </div>
                            <div>
                                <label htmlFor="organizationType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Type of Organization
                                </label>
                                <select 
                                    id="organizationType"
                                    name='type' 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required  onChange={handleChange}
                                >
                                    <option value="" >Select an organization type</option>
                                    <option value="probationary">Probationary</option>
                                    <option value="professional and affiliates">Professional & Affiliates</option>
                                    <option value="professional">Professional</option>
                                    <option value="special interest">Special Interest</option>
        
                                </select>
                                </div>
                        </div>
                        <div className="mb-6">
                            <label for="large-input" name="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Simple Description</label>
                            <input type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  onChange={handleChange}/>
                        </div>
                        <div className="mb-6">
                            <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div> 
                        <div className="mb-6">
                            <label for="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                        </div> 
                        <div className="flex items-start mb-6">
                            <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                            </div>
                            <label for="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
        </>
        
    );
}