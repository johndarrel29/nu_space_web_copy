import searchIcon from "../../assets/icons/magnifying-glass-solid.svg";


function Searchbar({placeholder, searchQuery, setSearchQuery}) {
  return (
    <div className="relative ">
      <img src={searchIcon} 
      alt="Search Icon" 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
      draggable="false"
      />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          className="p-2 pl-10 rounded-md bg-textfield w-full border border-mid-gray text-gray-700"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

    </div>

  );
}

export default Searchbar;