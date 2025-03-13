import { useState, useEffect } from "react";
import deleteIcon from "../../assets/icons/trash-solid-white.svg";

export default function InputModal({id, onClose, orgName, acronym, category, website, image, email, onConfirm, type}) {
  // Store input values in state
  const [name, setName] = useState("");
  const [presetImage, setPresetImage] = useState(image || "");
  const [userAcronym, setUserAcronym] = useState("");
  const [userType, setUserType] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userWebsite, setUserWebsite] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    console.log("Inside InputModal: received data:", { id, orgName, acronym, category, email, website, image, type });
  }, [id, orgName, acronym, category, email, website, image, type]); 
  
  // Use useEffect to update state when props change
  useEffect(() => {
    setName(orgName || "");
    setUserAcronym(acronym || "");
    setUserType(type || "");
    setUserEmail(email || "");
    setUserWebsite(website || "");
    setPresetImage(image || "");
  }, [orgName, acronym, category, email, website, image]); 
  
    console.log("Inside InputModal: received data:", { id, name, userAcronym, userType, userEmail, userWebsite });

  useEffect(() => {
    console.log("Selected type received in modal:", type); // Debugging
  }, [type]);

  const handleOpen = () => {
    onClose(); 
  };

  console.log("onConfirm exists?", typeof onConfirm === "function");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
    }
  };

  const handleConfirm = (action) => {
    const updatedData = {
      id: id || Date.now(), 
      orgName: name,
      acronym: userAcronym,
      category: userType,
      email: userEmail,
      website: userWebsite,
      image: userImage || presetImage, // Use uploaded or existing image
    };
  
    console.log(`Handling action: ${action}`, updatedData);
  
    if (action === "delete") {
      console.log("Deleting entry");
      onConfirm(id, null);
    } else if (action === "save") {
      console.log("Saving entry", updatedData);
      onConfirm(updatedData.id, updatedData); 
    }
  
    onClose();
  };
  
  

    return (
        <div>

        <div
        id="modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white  overflow-hidden  rounded-lg shadow-lg w-[90%] max-w-auto  p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold">{`About ${name}`}</h3>
            <button onClick={handleOpen} className="text-gray-500">
              ✖
            </button>
          </div>
        <div className="overflow-x-auto max-h-auto">
          <div className="p-4">
            
          <div className="flex items-center flex-col justify-center mb-4">
            <img className="w-64 h-64 bg-gray-500 rounded-full margin-auto border border-gray-400" src={userImage || image} alt="profile">             
            </img>
                    <div className="w-1/2">                       
                        <label className=" block mb-2 text-sm font-medium text-gray-900 border-none dark:text-white " for="file_input"></label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help"
                                 id="file_input"
                                 type="file"
                                 accept="image/*"
                                 onChange={handleImageChange}
                                 />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x800px).</p>
                    </div>
          </div>
          
            <div className="grid grid-cols-2 gap-4">
                   
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="mb-2 font-bold text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
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
            <div className="flex flex-col mb-4">
              <label htmlFor="type" className="mb-2 font-bold text-lg">
                Category
              </label>
              <input
                type="text"
                id="type"
                name="type"
                defaultValue={type}
                onChange={(e) => setUserType(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="type" className="mb-2 font-bold text-lg">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                defaultValue={email}
                onChange={(e) => setUserEmail(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="category" className="mb-2 font-bold text-lg">
                Link
              </label>
              <input
                type="text"
                id="website"
                name="website"
                defaultValue={website}
                onChange={(e) => setUserWebsite(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
          <div className="flex justify-end border-t pt-2">
            <button
              onClick={() => handleConfirm("delete")}
              className="cursor-pointer p-6 py-2 bg-[#FF2C2C] rounded-md h-10 text-white hover:bg-[#D12525] "
            >
              <div className="flex items-center gap-2">
                <img src={deleteIcon} alt="delete" className="size-4"/>
                Delete
              </div>
            </button>
            <button className="cursor-pointer px-4 py-2 bg-[#314095] text-white rounded-md ml-2 h-10 hover:bg-[#2E3C88] "
            onClick={() => handleConfirm("save")}
             >
              Save Changes
            </button>
          </div>
        </div>
          </div>         
          </div>
          </div>   
      </div>
     </div>

    );    
}