import { Separator } from "@/components/ui/separator";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../Components/ui/card";
import { formatValidStringToDate } from "../../Utils/FormatDate";


const Educations = ({ educations }) => {
  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {educations.map((edu, index) => (
            <div key={index} className="space-y-1">
              <div className="font-medium text-sm dark:text-white">
                {edu.schoolName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {edu.degree} in {edu.branch}
              </div>
              <div className="text-xs text-gray-500">
                {formatValidStringToDate(edu.startDate)} - {formatValidStringToDate(edu.endDate)}
              </div>
              {index < educations.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

const Experiences = ({ experiences }) => {
  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="space-y-1">
              <div className="font-medium dark:text-white">
                {exp.organizationName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {exp.jobType}
              </div>
              <div className="text-xs text-gray-500">
                {formatValidStringToDate(exp.startDate)} - {formatValidStringToDate(exp.endDate)}
              </div>
              {index < experiences.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

// Skills section (inlined individual skill rendering)
const Skills = ({ skills }) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl dark:text-white">Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((sk, idx) => (
            <div key={idx} className="flex gap-2 flex-wrap">
              <Button size="sm" variant="secondary">
                {sk.skill}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Languages section (inlined individual language rendering)
const Languages = ({ languages }) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl dark:text-white">Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.map((lang, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-start p-1">
              <Label className="text-md wrap-normal">{lang.languageName}</Label>
              <Label className="text-sm wrap-normal text-right text-gray-500">
                {lang.proficiencyLevel}
              </Label>
            </div>
            {idx < languages.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function ApplicationProfile({ application }) {
  return (
    <ScrollArea className="h-[41.5rem] rounded-sm border-green-700 shadow-2xl border-1">
      <div className={"flex flex-col gap-2 w-full  bg-green-200 p-4 text-white "+( !application ? "h-[41.5rem] justify-center items-center" : "h-full") }>
        {application ? (
          <>
            <div className="sticky top-0 bg-green-200 w-full p-4">
              <Label className="font-bigtitle text-4xl text-green-950 text-center flex justify-center items-center">
                {application.fullName}
              </Label>
            </div>
            {Array.isArray(application.education) && application.education.length > 0 && (
              <Educations educations={application.education} />
            )}
            {Array.isArray(application.experiences) && application.experiences.length > 0 && (
              <Experiences experiences={application.experiences} />
            )}
            {Array.isArray(application.skills) && application.skills.length > 0 && (
              <Skills skills={application.skills} />
            )}
            {Array.isArray(application.languages) && application.languages.length > 0 && (
              <Languages languages={application.languages} />
            )}
          </>
        ) : (
          <h1 className="font-bigtitle text-center text-4xl text-green-950">
            Select a Candidate
          </h1>
        )}
      </div>
    </ScrollArea>
  );
}
