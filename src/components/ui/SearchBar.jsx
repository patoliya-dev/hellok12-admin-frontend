import React, { useState, useEffect } from "react";
import Input from "./Input";
import Icon from "./Icon";

const SearchBar = ({ onSearch, placeholder = "Search" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon name="Search" size={18} className="text-muted-foreground" />
      </div>

      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
