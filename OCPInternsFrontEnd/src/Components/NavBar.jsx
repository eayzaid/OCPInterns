import { Link } from "react-router";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "../Components/ui/button";
import { Label } from "../Components/ui/label";
import { useAuth } from "../Hooks";

export default function SideBar() {

  const { logout } = useAuth();
  
  const onClickLogout = async()=>{
    await logout();
  }

  return (
    <div className="h-20 bg-green-600 flex justify-between items-center p-4 text-white">
      <Link to="/candidate">
        <h1 className="font-bold font-bigtitle text-2xl lg:text-4xl w-32">
          OCPInterns
        </h1>
      </Link>
      <div className="text-2xl">
        <Popover>
          <PopoverTrigger>
            <div>
              <i className="fa-sharp fa-regular fa-circle-user"></i>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-1">
              <Label className="text-3xl font-bigtitle">Welcome Ayman</Label>
              <Link to="/auth"><Button onClick={onClickLogout} className="w-full" variant="destructive">Logout</Button></Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
