import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Trigger animation on mount
    el.style.animation =
      "slideInFromRight 1s cubic-bezier(0.22, 1, 0.36, 1) forwards";
  }, []);

  // search logic
  const [searchQuery, setSearchQuery] = useState("");
  const handleOnChange = (e) => {
    setSearchQuery(e.target.value);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    router.push(`/search/${searchQuery || 'rivix'}`);
  };

  return (
      <form
        onSubmit={handleSubmit}
        ref={containerRef}
        className="search-wrapper w-full flex items-center relative"
      >
        <input
          onChange={handleOnChange}
          type="text"
          placeholder="Search - Rivix Signature Tee"
          className="search-input border border-gray-900 rounded-full py-2 w-full pl-5 pr-12 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 cursor-pointer bg-gray-900 h-full px-3 rounded-r-full"
        >
          <Search color="white" />
        </button>
      </form>
  );
};

export default SearchInput;
