import { Button } from "../../Components/ui/button";
import { CirclePlus } from "lucide-react";
import { Input } from "../../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddEditRecruiter from "./AddEditRecruiter";
import RecruiterCard from "./RecruiterCard";
import { fetchFilteredRecruiters } from "./Fetch";
import { toast } from "sonner";

const filterOptions = [
  { value: "fullName", label: "Full Name" },
  { value: "email", label: "Email" },
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
  const placeholder = searchState.option === "fullName" 
    ? "Recruiter's Full Name" 
    : "Recruiter's Email";

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

const EmptyState = ({ hasSearched }) => (
  <div className="col-span-full flex flex-col justify-center items-center h-64">
    <h1 className="text-2xl font-bigtitle text-green-800 mb-2">
      {hasSearched ? "No recruiters found" : "Start Your Search"}
    </h1>
    {!hasSearched && (
      <p className="text-gray-600 text-center">
        Enter search criteria and click "Search" to find recruiters
      </p>
    )}
  </div>
);

export default function RecruiterManager() {
  const [searchState, setSearchState] = useState({
    option: "fullName",
    value: "",
    isLoading: false,
    hasSearched: false,
  });

  const [recruiters, setRecruiters] = useState([]);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    selectedRecruiter: null,
  });

  // Handle search/filter functionality
  const handleSearch = async () => {
    if (!searchState.value.trim() && searchState.option !== "fullName") return;
    
    setSearchState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await toast.promise(
        fetchFilteredRecruiters(searchState.option, searchState.value),
        {
          loading: "Searching recruiters...",
          success: (res) => {
            if (res.status === 200) {
              setRecruiters(res.data);
              setSearchState(prev => ({ 
                ...prev, 
                isLoading: false, 
                hasSearched: true 
              }));
              return `Found ${res.data.length} recruiter(s)`;
            }
            throw new Error("Failed to search recruiters");
          },
          error: () => {
            setSearchState(prev => ({ ...prev, isLoading: false }));
            return "Failed to search recruiters";
          }
        }
      );
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Clear search and reset state
  const handleClearSearch = () => {
    setSearchState({
      option: "fullName",
      value: "",
      isLoading: false,
      hasSearched: false,
    });
    setRecruiters([]);
  };

  // Handle input changes
  const handleInputChange = (value) => {
    setSearchState(prev => ({ ...prev, value }));
  };

  // Handle filter option change
  const handleFilterChange = (option) => {
    setSearchState(prev => ({ option, value: "", isLoading: false, hasSearched: prev.hasSearched }));
  };

  // Dialog management
  const handleEditRecruiter = (recruiter) => {
    setDialogState({ isOpen: true, selectedRecruiter: recruiter });
  };

  const handleAddRecruiter = () => {
    setDialogState({ isOpen: true, selectedRecruiter: null });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, selectedRecruiter: null });
  };

  // Handle recruiter updates (add/edit)
  const handleRecruiterUpdated = (updatedRecruiter, isNew = false) => {
    if (isNew) {
      setRecruiters(prev => [...prev, updatedRecruiter]);
    } else {
      setRecruiters(prev => 
        prev.map(r => r.userId === updatedRecruiter.userId ? updatedRecruiter : r)
      );
    }
    handleCloseDialog();
  };

  // Handle recruiter deletion
  const handleRecruiterDeleted = (deletedUserId) => {
    setRecruiters(prev => prev.filter(r => r.userId !== deletedUserId));
  };

  // Handle keyboard events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-green-100 h-full p-4">
      <h1 className="text-5xl font-bigtitle text-green-800">
        Recruiter Management
      </h1>
      <p className="text-xl font-casualfont text-gray-500">
        Manage recruiters, track their profiles, and oversee recruitment activities
      </p>
      
      <div className="flex flex-col justify-center items-center w-full mt-3">
        <div className="flex justify-between bg-emerald-600 w-9/10 p-4">
          <h1 className="font-casualfont font-bold text-4xl text-white">
            Recruiters
          </h1>
          <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                className="text-emerald-600"
                onClick={handleAddRecruiter}
              >
                <CirclePlus />
                Add a Recruiter
              </Button>
            </DialogTrigger>
            <AddEditRecruiter 
              recruiter={dialogState.selectedRecruiter} 
              onSuccess={handleRecruiterUpdated}
            />
          </Dialog>
        </div>
        
        <div className="bg-green-50 w-9/10 p-4">
          <SearchControls
            searchState={searchState}
            onInputChange={handleInputChange}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            onKeyPress={handleKeyPress}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {!searchState.hasSearched ? (
              <EmptyState hasSearched={false} />
            ) : recruiters.length > 0 ? (
              recruiters.map((recruiter) => (
                <RecruiterCard
                  key={recruiter.userId}
                  recruiter={recruiter}
                  onEdit={handleEditRecruiter}
                  onDelete={() => handleRecruiterDeleted(recruiter.userId)}
                />
              ))
            ) : (
              <EmptyState hasSearched={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { SelectField };
