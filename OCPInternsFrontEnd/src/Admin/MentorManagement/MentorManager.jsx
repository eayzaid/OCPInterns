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
import { useEffect, useState } from "react";
import { OCPMajorFields } from "../../../Data";
import {
  fetchDepartments,
  fetchMentors,
  deleteMentor,
} from "./Fetch.js";
import { useAuth } from "../../Hooks";
import MentorCard from "./MentorCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddEditMentor from "./AddEditMentor";
import { toast } from "sonner";

const filterOptions = [
  { value: "fullName", label: "Full Name" },
  { value: "department", label: "Department" },
  { value: "field", label: "Field" },
];

export const SelectField = ({
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

const EmptyState = ({ hasSearched }) => (
  <div className="col-span-full flex flex-col justify-center items-center h-64">
    <h1 className="text-2xl font-bigtitle text-green-800 mb-2">
      {hasSearched ? "No mentors found" : "Start Your Search"}
    </h1>
    {!hasSearched && (
      <p className="text-gray-600 text-center">
        Select filter criteria and click "Filter" to find mentors
      </p>
    )}
  </div>
);

export default function MentorManager() {
  const [select, setSelect] = useState({
    option: "fullName",
    value: "",
  });

  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { accessToken } = useAuth();

  //inital load departements
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchDepartments(accessToken);
      if (response.status === 200) {
        //add the department property to the mentors
        setDepartments(response.data.map((element) => element.departmentName));
      }
    };
    toast.promise(fetch, {
      loading: "Loading...",
      success: () => {
        return `Departments got fetch succesfully`;
      },
      error: `There was a problem during the fetching of departments`,
    });
  }, []);

  //fetch functions
  const fetchResults = async (path) => {
    const response = await fetchMentors(path);
    if (response.status === 200) return response.data;
    else {
      setMentors([]);
      alert("Problem during mentor fetch");
    }
  };

  //submit the filter options
  const onSubmit = () => {
    const submitHanlder = async () => {
      let fetchedMentors = null;
      if (!select.value || !select.option) throw new Error();
      switch (select.option) {
        case "department":
          fetchedMentors = await fetchResults(
            `?department=${encodeURIComponent(select.value)}`
          );
          setMentors(
            fetchedMentors[0].mentors.map((element) => ({
              departmentName: select.value,
              ...element,
            }))
          ); //just populate department by the selected one
          break;
        case "field":
          fetchedMentors = await fetchResults(
            `?field=${encodeURIComponent(select.value)}`
          );
          setMentors(fetchedMentors);
          break;
        case "fullName":
          fetchedMentors = await fetchResults(
            `?fullName=${encodeURIComponent(select.value)}`
          );
          setMentors(fetchedMentors);
          break;
        default:
          setMentors([]);
          throw new Error("set a fetching method");
      }
      setHasSearched(true); // Mark that a search has been performed
    };
    toast.promise(submitHanlder, {
      loading: "Loading...",
      success: () => {
        return "Succesfull Filtering";
      },
      error: {
        message: `There was a problem during the filtring of mentors`,
      },
    });
  };

  //delete a mentor
  const onDelete = (mentorId, mentorFullName) => {
    const mentorDelete = async () => {
      return deleteMentor(encodeURIComponent(mentorId));
    };

    toast.promise(mentorDelete, {
      loading: "Loading...",
      success: () => {
        setMentors(mentors.filter((mentor) => mentor.mentorId !== mentorId)); //filter the displayed mentor list internelly to reflect changes
        return `${mentorFullName} has been deleted`;
      },
      error: `There was a problem during the deletion of ${mentorFullName}`,
    });
  };

  return (
    <>
      <div className="bg-green-100 h-full p-4">
        <h1 className="text-5xl font-bigtitle text-green-800">
          Mentor Management
        </h1>
        <p className="text-xl font-casualfont text-gray-500">
          Manage mentors, track their profiles, and oversee mentorship programs
        </p>
        <div className="flex flex-col justify-center items-center w-full mt-3">
          <div className="flex justify-between bg-emerald-600 w-9/10 p-4">
            <h1 className="font-casualfont font-bold text-4xl text-white">
              Mentors
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="text-emerald-600">
                  <CirclePlus />
                  Add a Mentor
                </Button>
              </DialogTrigger>
              <AddEditMentor departments={departments} />
            </Dialog>
          </div>
          <div className="bg-green-50 w-9/10 p-4">
            <div className="flex justify-between gap-2 mb-4">
              {select.option !== "fullName" ? (
                <SelectField
                  className="flex-1"
                  selectValues={
                    select.option === "field" ? OCPMajorFields : departments
                  }
                  placeholder={
                    select.option === "field"
                      ? "Select Field"
                      : "Select Department"
                  }
                  value={select.value}
                  onChange={(value) => {
                    setSelect({ ...select, value: value });
                  }}
                />
              ) : (
                <Input
                  className="flex-1"
                  placeholder="Mentor's Full Name"
                  value={select.value}
                  onChange={(e) => {
                    setSelect({ ...select, value: e.target.value });
                  }}
                />
              )}
              <SelectField
                selectValues={filterOptions}
                value={select.option}
                onChange={(value) => {
                  setSelect({ option: value, value: "" }); // Reset value when option changes
                }}
              />
              <Button
                onClick={onSubmit}
                variant="secondary"
                className="bg-emerald-600 text-white hover:bg-emerald-800"
              >
                Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-self-center auto-rows-fr">
              <Dialog>
                {!hasSearched ? (
                  <EmptyState hasSearched={false} />
                ) : mentors.length > 0 ? (
                  mentors.map((mentor, idx) => (
                    <MentorCard
                      key={idx}
                      mentor={mentor}
                      onEditing={(mentor) => setMentor(mentor)}
                      onDelete={(mentor) =>
                        onDelete(mentor.mentorId, mentor.mentorFullName)
                      }
                    />
                  ))
                ) : (
                  <EmptyState hasSearched={true} />
                )}
                {mentor && (
                  <AddEditMentor 
                    mentor={mentor} 
                    departments={departments} 
                    onEditing={(mentor) => setMentors(mentors.map(
                      (element) => element.mentorId === mentor.mentorId ? mentor : element
                    ))} 
                  />
                )}
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
