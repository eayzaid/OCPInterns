import { Label } from "../../Components/ui/label";
import EducationForm from "./EducationFormHandler";
import ExperienceForm from "./ExperienceFormHandler";
import SkillForm from "./SkillFormHandler";
import LanguageForm from "./LanguageFormHandler";
import { Button } from "../../Components/ui/button";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GeneralInfo from "./GeneralInfo";
import { submitApplicaiton, checkCanSubmit } from "./Fetch";
import { useAuth } from "../../Hooks";
import { useNavigate } from "react-router";

export default function ApplicationSubmissionPage() {

  const [submit, setSubmit] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { accessToken, fullName } = useAuth();
  const navigate = useNavigate();

  const [application, setApplication] = useState({
    generalInfo: {},
    education: [],
    experiences: [],
    skills: [],
    languages: [],
  });

  const onSubmit = async () => {
    setSubmit(!submit); //for initiating the GENERALINFO form submission
  };

  //this check for user eligibility to submit an application before entring the website , if not , redirect to view
  useLayoutEffect(() => {
    const checkEligibility = async () => {
      const response = await checkCanSubmit(accessToken);
      if (response.status !== 200) {
        navigate("/candidate/view");
      }
    };
    checkEligibility();
  }, []);

  useEffect(() => {
    const submitApplicationRequest = async () => {
      const response = await submitApplicaiton(accessToken, {
        ...application,
        fullName,
      });
      if (response.status !== 200) {
        alert("Your application didn't submit succesfully");
      } else {
        navigate("/candidate/view");
      }
    };
    if(isValid) {
      submitApplicationRequest();
    }
  },[isValid]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-col gap-4 w-9/10 max-w-5xl p-4 border-1 border-white rounded-sm">
        <div>
          <Label className="text-white text-2xl lg:text-3xl mb-1">
            General informations about your Internship
          </Label>
          <div className="bg-gray-300 rounded-sm p-4">
            <GeneralInfo
              onAction={submit}
              setIsValid={setIsValid}
              setGeneralInfo={(toBeAdded) => {
                setApplication({ ...application, generalInfo: toBeAdded });
              }}
            />
          </div>
        </div>
        <div>
          <Label className="text-white text-2xl lg:text-3xl">
            Add your Education
          </Label>
          <div className="w-full h-auto flex flex-row flex-wrap gap-1 mt-2 p-2 rounded-xs bg-gray-500">
            {application.education.map((element, idx) => {
              return (
                <EducationForm
                  key={idx}
                  education={element}
                  addApplication={(updatedElement) =>
                    setApplication((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === idx ? updatedElement : item
                      ),
                    }))
                  }
                  deleteApplication={() =>
                    setApplication((prev) => ({
                      ...prev,
                      education: prev.education.filter((_, i) => i !== idx),
                    }))
                  }
                />
              );
            })}
            <EducationForm
              addApplication={(newElement) =>
                setApplication((prev) => ({
                  ...prev,
                  education: [...prev.education, newElement],
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-white text-2xl lg:text-3xl">
            Add your Experiences
          </Label>
          <div className="w-full h-auto flex flex-row flex-wrap gap-1 mt-2 p-2 rounded-xs bg-gray-500">
            {application.experiences.map((element, idx) => {
              return (
                <ExperienceForm
                  key={idx}
                  experience={element}
                  addApplication={(updatedElement) =>
                    setApplication((prev) => ({
                      ...prev,
                      experiences: prev.experiences.map((item, i) =>
                        i === idx ? updatedElement : item
                      ),
                    }))
                  }
                  deleteApplication={() =>
                    setApplication((prev) => ({
                      ...prev,
                      experiences: prev.experiences.filter((_, i) => i !== idx),
                    }))
                  }
                />
              );
            })}
            <ExperienceForm
              addApplication={(newElement) =>
                setApplication((prev) => ({
                  ...prev,
                  experiences: [...prev.experiences, newElement],
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-white text-2xl lg:text-3xl">
            Add your Skills
          </Label>
          <div className="w-full h-auto flex flex-row flex-wrap gap-1 mt-2 p-2 rounded-xs bg-gray-500">
            {application.skills.map((element, idx) => {
              return (
                <SkillForm
                  key={idx}
                  skill={element}
                  addApplication={(updatedElement) =>
                    setApplication((prev) => ({
                      ...prev,
                      skills: prev.skills.map((item, i) =>
                        i === idx ? updatedElement : item
                      ),
                    }))
                  }
                  deleteApplication={() =>
                    setApplication((prev) => ({
                      ...prev,
                      skills: prev.skills.filter((_, i) => i !== idx),
                    }))
                  }
                />
              );
            })}
            <SkillForm
              addApplication={(newElement) =>
                setApplication((prev) => ({
                  ...prev,
                  skills: [...prev.skills, newElement],
                }))
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-white text-2xl lg:text-3xl">
            Add your Languages
          </Label>
          <div className="w-full h-auto flex flex-row flex-wrap gap-1 mt-2 p-2 rounded-xs bg-gray-500">
            {application.languages.map((element, idx) => {
              return (
                <LanguageForm
                  key={idx}
                  language={element}
                  addApplication={(updatedElement) =>
                    setApplication((prev) => ({
                      ...prev,
                      languages: prev.languages.map((item, i) =>
                        i === idx ? updatedElement : item
                      ),
                    }))
                  }
                  deleteApplication={() =>
                    setApplication((prev) => ({
                      ...prev,
                      languages: prev.languages.filter((_, i) => i !== idx),
                    }))
                  }
                />
              );
            })}
            <LanguageForm
              addApplication={(newElement) =>
                setApplication((prev) => ({
                  ...prev,
                  languages: [...prev.languages, newElement],
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 flex-col md:flex-row ">
          <Button onClick={onSubmit} variant="secondary">
            Submit Application
          </Button>
          <Button variant="destructive">Reset</Button>
        </div>
      </div>
    </div>
  );
}
//{"+"} Add an Item
