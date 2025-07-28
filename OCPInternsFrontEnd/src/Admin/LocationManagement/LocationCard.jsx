import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { EditIcon, Trash2Icon, MapPinIcon, UsersIcon } from "lucide-react";

const LocationCard = ({ location, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the department "${location.departmentName}"?`)) {
      onDelete(location.departmentName);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl font-bold text-gray-900">
              {location.departmentName}
            </CardTitle>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(location)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
            >
              <EditIcon className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2Icon className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sub-departments */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Sub-departments ({location.sousDepartments?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {location.sousDepartments && location.sousDepartments.length > 0 ? (
              location.sousDepartments.map((subDept, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  {subDept}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 text-sm italic">No sub-departments</span>
            )}
          </div>
        </div>

        {/* Mentors */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <UsersIcon className="h-3 w-3 text-blue-500" />
            Mentors ({location.mentorCount || 0})
          </h4>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
