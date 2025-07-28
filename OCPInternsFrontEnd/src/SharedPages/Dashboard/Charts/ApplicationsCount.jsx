import { Separator } from "../../../Components/ui/separator";
import { getApplicationsCount } from "../Fetch";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

export const Loading = ({ color="#FFFFFF" }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <FadeLoader color={color} />
    </div>
  );
};

export default function ApplicationCount() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    const fetchCount = async () => {
      const response = await getApplicationsCount();
      if (response.status === 200) setCount(response.data);
    };
    fetchCount();
  }, []);
  return (
    <div className="flex flex-col gap-2 bg-green-400 text-green-50 p-2 rounded  max-w-80">
      <div className="text-center font-bigtitle font-bold text-4xl">
        Applications
      </div>
      <Separator />
      {!count && <Loading />}
      {count && (
        <div className="h-24 flex gap-2">
          <div className="space-y-2 font-bigtitle">
            <h1 className="text-center text-3xl">Submitted</h1>
            <p className="text-center text-2xl">{count.total}</p>
          </div>
          <Separator orientation="vertical" />
          <div className="space-y-2 font-bigtitle">
            <h1 className="text-center text-3xl">Reviewed</h1>
            <p className="text-center text-2xl">{count.reviewed}</p>
          </div>
        </div>
      )}
    </div>
  );
}
