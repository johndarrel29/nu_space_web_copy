import searchIcon from "../../assets/icons/magnifying-glass-solid.svg";


function Searchbar({placeholder, searchQuery, setSearchQuery}) {
  return (
    <div className="relative w-full z-0">
      <img src={searchIcon} 
      alt="Search Icon" 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
      draggable="false"
      />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          className="p-2 rounded w-full bg-gray-200 pl-10 placeholder-gray-600 hover:bg-white border transition duration-300"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

    </div>

  );
}

export default Searchbar;