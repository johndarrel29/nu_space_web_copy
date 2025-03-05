import searchIcon from "../../assets/icons/magnifying-glass-solid.svg";


function Searchbar({placeholder, searchQuery, setSearchQuery}) {
  return (
    <div className="relative w-full">
      <img src={searchIcon} 
      alt="Search Icon" 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
      draggable="false"
      />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          className="border p-2 rounded w-full border-black pl-10"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

    </div>

  );
}

export default Searchbar;