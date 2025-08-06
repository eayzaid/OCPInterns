import { AlertTriangle, Shield, FileX } from 'lucide-react';

const FraudWarning = () => {
  return (
    <div className="flex justify-center items-center max-w-md mx-auto mt-6 h-dvh">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-red-600 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-red-900 leading-tight">
            Document Not Legitimate
          </h2>
          <div className="flex items-center justify-center mt-2">
            <FileX className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-sm text-red-600 font-medium">Verification Failed</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-red-100 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Fraud Warning
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">
              This document appears to be fraudulent or has been tampered with. The QR code verification has failed to authenticate this internship admission letter.
            </p>
          </div>

          <div className="bg-red-100 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Legal Consequences
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>Warning:</strong> Misuse of QR codes and fraudulent documents can lead to serious legal consequences including:
            </p>
            <ul className="text-sm text-red-800 mt-2 space-y-1 ml-4">
              <li>• Document forgery charges</li>
              <li>• Identity fraud prosecution</li>
              <li>• Academic misconduct penalties</li>
              <li>• Criminal liability</li>
            </ul>
          </div>

          <div className="bg-red-100 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">
              What to Do Next
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">
              If you believe this is an error, please contact the issuing organization immediately with the original document for manual verification.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-red-200 text-center">
          <p className="text-xs text-red-600">
            Report suspected fraud to the appropriate authorities
          </p>
        </div>
      </div>
    </div>
  );
};

export default FraudWarning;