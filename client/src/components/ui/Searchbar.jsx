import { useRef, useEffect } from "react";
import { useKeyBinding } from "../../hooks";


function Searchbar({ placeholder, searchQuery, setSearchQuery, style, setShowSearch = () => { }, onFocus, onBlur }) {
  const inputRef = useRef(null);

  useKeyBinding({
    key: '/',
    callback: () => {
      inputRef.current?.focus();
      setShowSearch(true);
    },
    dependencies: [setShowSearch]
  });

  // Focus input when searchQuery changes
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [searchQuery]);



  const handleSearchModeChange =
    style === "secondary"
      ? "p-2 pl-10 rounded-md bg-textfield w-full border border-none text-gray-700 focus:outline-none focus:ring-1 focus:ring-off-black"
      : "p-2 pl-10 rounded-md bg-textfield w-full border border-mid-gray text-gray-700 focus:outline-none focus:ring-1 focus:ring-off-black";

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 fill-off-black"
        viewBox="0 0 512 512"
      >
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
      </svg>

      <input

        ref={inputRef} // Attach the ref to the input field
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        className={`${handleSearchModeChange} placeholder-dark-gray`}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="h-6 w-6 border border-gray-400 rounded flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2">
        /
      </div>
    </div>

  );
}

export default Searchbar;