import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification, TabSelector, ReusableTable, Button } from "../../components";
import RSOForm from "../../components/RSOForm";
import { AnimatePresence } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components'; 
import  useSearchQuery from "../../hooks/useSearchQuery";
import  {useRSO, useKeyBinding} from "../../hooks";
import { useNotification } from "../../utils";
import { useNavigate } from 'react-router-dom';


export default function MainRSO() {
  const { organizations, error, loading, fetchData, createRSO, updateRSO, deleteRSO, queryData } = useRSO();
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [orgList, setOrgList] = useState(organizations);
  const [activeTab, setActiveTab] = useState(0);
  const { notification, handleNotification } = useNotification();
  const [sort, setSort] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  console.log("Query Data: ", queryData);
}, [queryData]);


  const checkSpace = (str) => {
    if (str && str.length > 0) {
      return str.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space and trim
    }
    return str; // Return the original string if it's empty or undefined  
  };

  const rsoList = queryData?.rsos ?? [];
  console.log("RSO List:", rsoList);

  
    // Assuming 'organizations' is an array of organization objects
    const tableRow = rsoList.map((org) => ({
      id: org._id,
      RSO_name: checkSpace(org.RSO_name),
      RSO_acronym: org.RSO_acronym || '',
      RSO_description: org.RSO_description || '', // Added missing field
      RSO_tags: org.RSO_tags || [], // Convert tag objects to array of strings
      RSO_category: org.RSO_category || '',
      RSO_College: org.RSO_College || '',
      RSO_totalMembers: org.RSO_totalMembers || 0, // Added missing field
      RSO_status: org.RSO_status || false, // Added missing field
      RSO_picture: org.RSO_picture || '',
      picture: org.picture || '', // Added missing field
      RSO_memberCount: org.RSO_members ? org.RSO_members.length : org.RSO_totalMembers || 0,
      RSO_members: org.RSO_members || [],
      RSO_successRate: org.RSO_successRate || 0,
      RSO_popularityScoreCount: org.RSO_popularityScore > 0 ? org.RSO_popularityScore : 0,
      RSO_activities: org.RSO_activities || [],
      RSO_forms: org.RSO_forms || '',
      __v: org.__v || 0 // Added missing version field
    }));

    console.log("tableRow", tableRow);
    const allTags = tableRow.map((row) => row.RSO_tags);
console.log("All RSO Tags:", allTags);

      const tabs = [
          { label: "All" },
      { label: "Probationary", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/> </svg> },
          { label: "Professional", icon: <svg className="w-4 h-4 me-2  dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
              </svg>},
          { label: "Professional & Affiliates", icon: <svg className="w-4 h-4 me-2  dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
          </svg> },
          { label: "Special Interest", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/> </svg> },
      ];


//   const tabs = [
//     { label: "RSOs"},
//     { label: "Create RSO", 
//     icon: 
//   <svg className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>  
//   }
// ];


  useEffect(() => {
    setOrgList(organizations);
  }, [organizations]);

  const filteredOrgs = () => {
    // If no actions have been taken by the user, return the default tableRow (all organizations)
    if (activeTab === 0 && searchQuery === "" && sort === "All") {
      return tableRow; // Return the default table row (organizations)
    }
  
    // Filter organizations based on active tab and search query
    let filteredList = tableRow.filter((org) => {
      const matchesTab = activeTab === 0 || org.RSO_category === tabs[activeTab].label;
      const matchesSearch = org.RSO_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  
    // Sort based on the selected sort option
    if (sort === "A-Z") {
      filteredList = filteredList.sort((a, b) => a.RSO_name.localeCompare(b.RSO_name));
      console.log("A-Z", filteredList);
    } else if (sort === "Most Popular") {
      filteredList.sort((a, b) => {
        const aScore = a.RSO_popularityScoreCount || 0; // Fallback to 0 if no score
        const bScore = b.RSO_popularityScoreCount || 0;
        return bScore - aScore; // Descending order
      });
      console.log("Most Popular", filteredList);
    }
  
    // Map the filtered and sorted results to the same format as tableRow
    return filteredList.map((org) => ({
      id: org._id,
      RSO_name: checkSpace(org.RSO_name), // Added checkSpace function
      RSO_acronym: org.RSO_acronym || '',
      RSO_description: org.RSO_description || '', // Added missing field
      RSO_tags: org.RSO_tags?.map(tag => tag.tag) || [], // Convert tag objects to array of strings
      RSO_category: org.RSO_category || '',
      RSO_College: org.RSO_College || '',
      RSO_totalMembers: org.RSO_totalMembers || 0, // Added missing field
      RSO_status: org.RSO_status || false, // Added missing field
      RSO_picture: org.RSO_picture || '',
      RSO_memberCount: org.RSO_members ? org.RSO_members.length : org.RSO_totalMembers || 0, // Fallback to totalMembers
      RSO_members: org.RSO_members || [], // Added missing field
      RSO_successRate: org.RSO_successRate || 0,
      RSO_popularityScoreCount: org.RSO_popularityScore > 0 ? org.RSO_popularityScore : 0,
      RSO_activities: org.RSO_activities || [],
      RSO_forms: org.RSO_forms || '',
      __v: org.__v || 0 // Added missing version field
    }));
  };
  

  // useEffect(() => {
  //   setOrgList(filteredOrgs());
  // }, [organizations, activeTab, searchQuery, sort]);


  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectedUser = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
    navigate('rso-details', { state: { user } }); 
  };

  const handleSubmit = async (data) => {
    try {
      await createRSO(data);
      handleNotification("RSO created successfully!");
      setActiveTab(0); // Switch to the RSO list tab after creation
    } catch (error) {
      console.error("Error creating RSO:", error);
      handleNotification("Error creating RSO. Please try again.");
    }
  }
  const handleUpdate = async (id, data) => {
    try {
      await updateRSO(id, data);
      handleNotification("RSO updated successfully!");
    } catch (error) {
      console.error("Error updating RSO:", error);
      handleNotification("Error updating RSO. Please try again.");
    }
  };

  const handleCreate = () => {
    navigate("rso-action", {
      state: { 
        mode: "create",
      },
    });
    console.log("Selected user:", selectedUser);
  }

    useKeyBinding(
    {key: "c", 
        callback: () => {
          handleCreate();
        },
        dependencies: [handleCreate]

    });


  return (
    <>
      <div className="flex justify-between items-center">
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Button className={"px-4"} onClick={handleCreate}>
          <div className="flex items-center gap-2">
            <h1>Create RSO</h1>
            <div className="h-6 w-6 border border-gray-200 rounded flex items-center justify-center font-light active:bg-primary-rso active:text-white transition duration-200 ease-in-out">
              c
            </div>
          </div>
          
          </Button>         
      </div>
          <ReusableTable 
            options={["All", "A-Z", "Most Popular"]}
            showAllOption={false}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            columnNumber={3}
            tableHeading={[
                { id: 1, name: "RSO Name", key: "RSO_name" },
                { id: 2, name: "RSO Category", key: "RSO_category" }, 
            ]}
            tableRow={filteredOrgs()}
            onClick={handleSelectedUser}
            error={error}
            isLoading={loading}
            >
            {/* {loading && <CardSkeleton/>} */}
          </ReusableTable>
    </>
  );
}


{/* <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
{activeTab === 1 ? (
<>
<div className="h-full mt-4">
  <RSOForm createRSO={createRSO} onSubmit={handleSubmit} />
</div>
</>

) : (
<>
<div className="bg-card-bg sticky top-0 z-10 mt-4">
  <Searchbar placeholder="Search an Organization" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
</div>
<div className="h-full">
{loading && <Skeleton count={6} height={60}/>}
{error && handleSubmit(error)}
  <RSOTable 
    data={organizations} 
    searchQuery={searchQuery} 
    onUpdate={setOrgList} 
    updateRSO={updateRSO} 
    deleteRSO={deleteRSO} 
  />
</div>
</>


)}
</div>
<AnimatePresence
initial={false}
exitBeforeEnter={true}
onExitComplete={() => null}
>
{notification && (
  <Notification notification={notification} />
)}
</AnimatePresence> */}