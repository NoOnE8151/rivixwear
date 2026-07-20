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
    <>
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(32px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .search-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #b8965a;
          box-shadow: 0 0 0 3px rgba(184, 150, 90, 0.12);
        }

        .search-wrapper {
          opacity: 0;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        ref={containerRef}
        className="search-wrapper w-full flex items-center relative"
      >
        <input
          onChange={handleOnChange}
          type="text"
          placeholder="Search - Rivix Signature Tee"
          className="search-input border border-element-border rounded-2xl py-2 w-full pl-5 pr-12 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 cursor-pointer bg-background-muted h-full px-3 rounded-r-2xl"
        >
          <Search />
        </button>
      </form>
    </>
  );
};

export default SearchInput;
