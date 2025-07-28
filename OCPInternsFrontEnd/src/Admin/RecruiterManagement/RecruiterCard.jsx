import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/ui/avatar";
import { Mail, Edit2, Trash2, User } from "lucide-react";
import { Badge } from "../../Components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../Components/ui/alert-dialog";
import { deleteRecruiter } from "./Fetch";
import { toast } from "sonner";

export default function RecruiterCard({ recruiter, onEdit, onDelete }) {

  const handleDelete = async () => {
    try {
      toast.promise(deleteRecruiter(recruiter.userId), {
        loading: "Deleting recruiter...",
        success: "Recruiter deleted successfully",
        error: "Failed to delete recruiter",
      });
      onDelete(); // Refresh the list
    } catch (error) {
      console.error("Error deleting recruiter:", error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src=""
              alt={`${recruiter.firstName} ${recruiter.lastName}`}
            />
            <AvatarFallback className="bg-green-100 text-green-800">
              {getInitials(recruiter.firstName, recruiter.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 break-words leading-tight">
              {recruiter.firstName} {recruiter.lastName}
            </CardTitle>
            <Badge
              variant="secondary"
              className="mt-1 bg-blue-100 text-blue-800"
            >
              <User className="h-3 w-3 mr-1" />
              Recruiter
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Email */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="truncate">{recruiter.email}</span>
          </div>

          {/* User ID */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <span className="font-medium">ID:</span>
            <span className="font-mono text-xs">{recruiter.userId}</span>
          </div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex justify-between pt-3 border-t border-gray-100 mt-auto">
            
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(recruiter)}
            className="flex items-center space-x-1 hover:bg-green-50 hover:border-green-300"
          >
            <Edit2 className="h-3 w-3" />
            <span>Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Recruiter</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {recruiter.firstName}{" "}
                  {recruiter.lastName}? This action cannot be undone and will
                  permanently remove their account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        
        </div>
      </CardContent>
    </Card>
  );
}
