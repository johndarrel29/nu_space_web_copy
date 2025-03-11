import react, { useState, useEffect } from "react";

export default function InputModal({id, onClose, orgName, acronym, category, link, image, email, onConfirm, selectedType}) {
  // Store input values in state
  const [name, setName] = useState("");
  const [presetImage, setPresetImage] = useState(image || "");
  const [userAcronym, setUserAcronym] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLink, setUserLink] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    console.log("Inside InputModal: received data:", { id, orgName, acronym, category, email, link, image, selectedType });
  }, [id, orgName, acronym, category, email, link, image, selectedType]); // ✅ No more props reference
  
  // Use useEffect to update state when props change
  useEffect(() => {
    setName(orgName || "");
    setUserAcronym(acronym || "");
    setUserCategory(category || "");
    setUserEmail(email || "");
    setUserLink(link || "");
    setPresetImage(image || "");
  }, [orgName, acronym, category, email, link, image]); 
  
    console.log("Inside InputModal: received data:", { id, name, userAcronym, userCategory, userEmail, userLink });

  useEffect(() => {
    console.log("Selected type received in modal:", selectedType); // Debugging
  }, [selectedType]);

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
      id: id || Date.now(), // ✅ Generate a new ID if missing
      orgName: name,
      acronym: userAcronym,
      category: userCategory,
      email: userEmail,
      link: userLink,
      image: userImage || presetImage, // Use uploaded or existing image
    };
  
    console.log(`Handling action: ${action}`, updatedData);
  
    if (action === "delete") {
      console.log("Deleting entry");
      onConfirm(id, null);
    } else if (action === "save") {
      console.log("Saving entry", updatedData);
      onConfirm(updatedData.id, updatedData); // ✅ Pass updated data with ID
    }
  
    onClose(); // ✅ Close modal after action
  };
  
  

    return (
        <div>

        <div
        id="modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white  overflow-hidden  rounded-lg shadow-lg w-[90%] max-w-lg  p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold">Modal Title</h3>
            <button onClick={handleOpen} className="text-gray-500">
              ✖
            </button>
          </div>
        <div className="overflow-x-auto max-h-[400px]">
          <div className="p-4">
          <img className="w-32 h-32 bg-blue-500 rounded-full margin-auto" src={userImage || image} alt="profile"
            >             
            </img>
                    <div>                       
                        <label className=" block mb-2 text-sm font-medium text-gray-900 border-none dark:text-white " for="file_input">Upload file</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help"
                                 id="file_input"
                                 type="file"
                                 accept="image/*"
                                 onChange={handleImageChange}/>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                    </div>         
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
              <label htmlFor="category" className="mb-2 font-bold text-lg">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                defaultValue={category}
                onChange={(e) => setUserCategory(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="category" className="mb-2 font-bold text-lg">
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
                id="link"
                name="link"
                defaultValue={link}
                onChange={(e) => setUserLink(e.target.value)}
                className="border py-2 px-3 text-grey-darkest"
              />
            </div>
          <div className="flex justify-end border-t pt-2">
            <button
              onClick={() => handleConfirm("delete")}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Delete
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md ml-2"
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

    );    
}