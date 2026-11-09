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
        className="search-wrapper w-full flex items-center relative bg-gray-100"
      >
        <input
          onChange={handleOnChange}
          type="text"
          placeholder="Rivix Signature Tee"
          className="search-input md:border md:rounded-full py-2 w-full pl-5 pr-12 focus:outline-none placeholder:text-sm"
        />
        <button
          type="submit"
          disabled={!searchQuery}
          className="absolute right-0 cursor-pointer md:bg-gray-900 h-full px-3 md:rounded-r-full"
        >
          <Search color="white" size={20} className="md:block hidden" />
          <Search color="gray" size={20} className="block md:hidden" />
        </button>
      </form>
  );
};

export default SearchInput;
