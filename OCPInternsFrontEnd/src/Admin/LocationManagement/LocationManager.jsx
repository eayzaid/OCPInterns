import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { Dialog, DialogTrigger } from "../../Components/ui/dialog";
import { CirclePlus, RefreshCw } from "lucide-react";
import LocationCard from "./LocationCard";
import AddEditLocation from "./AddEditLocation";
import { getFilteredLocations, deleteLocation } from "./Fetch";

const filterOptions = [
  { value: "departmentName", label: "Department Name" },
  { value: "subDepartment", label: "Sub-department" },
];

const SelectField = ({
  selectValues,
  onChange,
  placeholder,
  value,
  className,
}) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder || "Filter"} />
      </SelectTrigger>
      <SelectContent>
        {selectValues &&
          selectValues.map((element, idx) => (
            <SelectItem key={idx} value={element.value || element}>
              {element.label || element}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const SearchInput = ({ searchState, onInputChange, onKeyPress }) => {
  let placeholder = "Search locations...";
  if (searchState.option === "departmentName") {
    placeholder = "Department Name";
  } else if (searchState.option === "subDepartment") {
    placeholder = "Sub-department Name";
  }

  return (
    <Input
      className="flex-1"
      placeholder={placeholder}
      value={searchState.value}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyPress={onKeyPress}
    />
  );
};

const SearchControls = ({ 
  searchState, 
  onInputChange, 
  onFilterChange, 
  onSearch, 
  onClear, 
  onKeyPress 
}) => (
  <div className="flex justify-between gap-2 mb-4">
    <SearchInput 
      searchState={searchState}
      onInputChange={onInputChange}
      onKeyPress={onKeyPress}
    />

    <SelectField
      selectValues={filterOptions}
      value={searchState.option}
      onChange={onFilterChange}
    />
    
    <Button
      variant="secondary"
      className="bg-emerald-600 text-white hover:bg-emerald-800"
      onClick={onSearch}
      disabled={searchState.isLoading}
    >
      {searchState.isLoading ? "Searching..." : "Search"}
    </Button>
    
    {(searchState.value || searchState.hasSearched) && (
      <Button
        variant="outline"
        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        onClick={onClear}
      >
        Clear
      </Button>
    )}
  </div>
);

const EmptyState = ({ hasSearched, onAddLocation }) => (
  <div className="col-span-full flex flex-col justify-center items-center h-64">
    <h1 className="text-2xl font-bigtitle text-green-800 mb-2">
      {hasSearched ? "No locations found" : "Start Your Search"}
    </h1>
    {!hasSearched ? (
      <p className="text-gray-600 text-center">
        Enter search criteria and click "Search" to find locations
      </p>
    ) : (
      <p className="text-gray-600 text-center mb-4">
        Try adjusting your search criteria
      </p>
    )}
  </div>
);

const LocationManager = () => {
  const [searchState, setSearchState] = useState({
    option: "departmentName",
    value: "",
    isLoading: false,
    hasSearched: false,
  });

  const [locations, setLocations] = useState([]);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    selectedLocation: null,
  });

  // Remove the initial fetch - let users search instead
  // useEffect(() => {
  //   handleSearch(true);
  // }, []);
  const handleSearch = async () => {
    if (!searchState.value.trim()) return; // Don't search if empty
    
    setSearchState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await toast.promise(
        getFilteredLocations( 
          (searchState.option === "departmentName" ? searchState.value : null),
          (searchState.option !== "departmentName" ? searchState.value : null)
        ),
        {
          loading: "Searching locations...",
          success: (res) => {
            const filtered = res.locations || [];
            
            setLocations(filtered);
            setSearchState(prev => ({ 
              ...prev, 
              isLoading: false, 
              hasSearched: true 
            }));
            
            return `Found ${filtered.length} location(s)`;
          },
          error: () => {
            setSearchState(prev => ({ ...prev, isLoading: false }));
            setLocations([]);
            return "Failed to search locations";
          }
        }
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchState({
      option: "departmentName",
      value: "",
      isLoading: false,
      hasSearched: false,
    });
    setLocations([]); // Clear locations when clearing search
  };

  const handleInputChange = (value) => {
    setSearchState(prev => ({ ...prev, value }));
  };

  const handleFilterChange = (option) => {
    setSearchState(prev => ({ option, value: "", isLoading: false, hasSearched: prev.hasSearched }));
  };

  const handleEditLocation = (location) => {
    setDialogState({ isOpen: true, selectedLocation: location });
  };

  const handleAddLocation = () => {
    setDialogState({ isOpen: true, selectedLocation: null });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, selectedLocation: null });
  };

  const handleLocationUpdated = (updatedLocation, isNew = false) => {
    if (isNew) {
      setLocations(prev => [...prev, updatedLocation]);
    } else {
      setLocations(prev => 
        prev.map(loc => loc.departmentName === updatedLocation.departmentName ? updatedLocation : loc)
      );
    }
    handleCloseDialog();
  };

  const handleDeleteLocation = (departmentName) => {
    try {
    toast.promise(
        deleteLocation(departmentName),
        {
          loading: "Deleting location...",
          success: () => {
            setLocations(prev => prev.filter(loc => loc.departmentName !== departmentName));
            return "Location deleted successfully!";
          },
          error: (error) => error.message || "Failed to delete location",
        }
      );
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-green-100 h-full p-4">
      <h1 className="text-5xl font-bigtitle text-green-800">
        Location Management
      </h1>
      <p className="text-xl font-casualfont text-gray-500">
        Manage departments, sub-departments, and mentor assignments
      </p>
      
      <div className="flex flex-col justify-center items-center w-full mt-3">
        <div className="flex justify-between bg-emerald-600 w-9/10 p-4">
          <h1 className="font-casualfont font-bold text-4xl text-white">
            Locations
          </h1>
          <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                className="text-emerald-600"
                onClick={handleAddLocation}
              >
                <CirclePlus />
                Add a Location
              </Button>
            </DialogTrigger>
            <AddEditLocation 
              location={dialogState.selectedLocation} 
              onLocationSaved={(location) => handleLocationUpdated(location, !dialogState.selectedLocation)}
              isOpen={dialogState.isOpen}
              onClose={handleCloseDialog}
            />
          </Dialog>
        </div>
        
        <div className="bg-green-50 w-9/10 p-4">
          <SearchControls
            searchState={searchState}
            onInputChange={handleInputChange}
            onFilterChange={handleFilterChange}
            onSearch={() => handleSearch()}
            onClear={handleClearSearch}
            onKeyPress={handleKeyPress}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-self-center auto-rows-fr">
            {!searchState.hasSearched ? (
              <EmptyState hasSearched={false} onAddLocation={handleAddLocation} />
            ) : locations.length > 0 ? (
              locations.map((location) => (
                <LocationCard
                  key={location._id}
                  location={location}
                  onEdit={handleEditLocation}
                  onDelete={handleDeleteLocation}
                />
              ))
            ) : (
              <EmptyState hasSearched={true} onAddLocation={handleAddLocation} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
    