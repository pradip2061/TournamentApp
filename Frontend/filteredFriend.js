// src/contexts/FilteredFriendsContext.js
import React, {createContext, useContext, useState} from 'react';

const FilteredFriendsContext = createContext();

export const FilteredFriendsProvider = ({children}) => {
  const [filteredFriends, setFilteredFriends] = useState([]);

  return (
    <FilteredFriendsContext.Provider
      value={{filteredFriends, setFilteredFriends}}>
      {children}
    </FilteredFriendsContext.Provider>
  );
};

// Custom hook for easier access
export const useFilteredFriends = () => useContext(FilteredFriendsContext);
