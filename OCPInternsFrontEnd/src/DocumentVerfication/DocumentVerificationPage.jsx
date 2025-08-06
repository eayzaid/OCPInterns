import { useLayoutEffect, useState } from "react";
import DocumentVerified from "./DocumentVerified";
import FraudWarning from "./FraudWarning";
import { fetchDownload } from "./Fetch";
import { useParams } from "react-router";
import { LoadingComponent, ServerErrorComponent } from "./StatusComponents";

export default function DocumentVerificationPage() {
  const { documentId } = useParams();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useLayoutEffect(() => {
    const verifyDownload = async () => {
      const response = await fetchDownload(documentId);
      if (response.status >= 400 && response.status <= 499) {
        setApplication(null);
      } else if (response.status >= 500) {
        setError(true);
      } else {
        setApplication(response.data);
      }
      setIsLoading(false);
    };
    verifyDownload();
  }, []);

  return (
    <>
      {isLoading && <LoadingComponent />}
      {!isLoading && error && <ServerErrorComponent />}
      {!isLoading && application && <DocumentVerified application={application} />}
      {!isLoading && !application && <FraudWarning />}
    </>
  );
}
