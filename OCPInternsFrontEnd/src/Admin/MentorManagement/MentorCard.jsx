import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../Components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, Edit, MapPin, Users, Delete } from "lucide-react";
import { Card, CardContent } from "../../Components/ui/card";
import { Badge } from "../../Components/ui/badge";
import { Button } from "../../Components/ui/button";
import AddEditMentor from "./AddEditMentor";
/*
Mentor : 
    mentorId 
    mentorFullName (fullName)
    menteeCount
    fields
*/

export default function MentorCard({ mentor, onEditing, onDelete }) {
  return (
    <Card
      key={mentor.mentorId}
      className="border-emerald-100 hover:shadow-lg transition-shadow w-full max-w-xs"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {mentor.mentorFullName}
              </h3>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={() => onEditing(mentor)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={() => onDelete(mentor)}>
                <Delete className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {mentor.departmentName}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            {mentor.menteeCount || 0} mentees
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {mentor.fields.map((skill, index) => (
              <Badge
                key={index}
                variant="secosndary"
                className="text-xs bg-emerald-100 text-emerald-700"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
