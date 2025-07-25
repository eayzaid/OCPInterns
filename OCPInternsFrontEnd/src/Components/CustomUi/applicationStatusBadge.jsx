import { Badge } from "../ui/badge";
import { BadgeCheck, Ban, Clock, Files } from "lucide-react";

export default function StatusBadge({ status }) {
    const buttonInfos = {
        logo: null,
        buttonInnerText: "",
        buttonColor: "",
    };

    switch (status) {
        case "pending":
            buttonInfos.buttonColor = "bg-gray-400";
            buttonInfos.buttonInnerText = "Pending";
            buttonInfos.logo = <Clock className="w-4 h-4 mr-1 inline" />;
            break;
        case "accepted":
            buttonInfos.buttonColor = "bg-green-600";
            buttonInfos.buttonInnerText = "Accepted";
            buttonInfos.logo = <BadgeCheck className="w-4 h-4 mr-1 inline" />;
            break;
        case "refused":
            buttonInfos.buttonColor = "bg-red-600";
            buttonInfos.buttonInnerText = "Refused";
            buttonInfos.logo = <Ban className="w-4 h-4 mr-1 inline" />;
            break;
        case "pfs": // pending files submission
            buttonInfos.buttonColor = "bg-purple-900";
            buttonInfos.buttonInnerText = "Pending Files Submission";
            buttonInfos.logo = <Files className="w-4 h-4 mr-1 inline" />;
            break;
        default:
            buttonInfos.buttonColor = "";
            buttonInfos.buttonInnerText = "Unknown";
            buttonInfos.logo = null;
    }

    return (
        <Badge size="sm" className={`${buttonInfos.buttonColor} flex items-center`}>
            {buttonInfos.logo}
            {buttonInfos.buttonInnerText}
        </Badge>
    );
}
