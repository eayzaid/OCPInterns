import React from 'react';
import { Loader2, ServerCrash, RefreshCw, AlertCircle } from 'lucide-react';

// Loading Component
export const LoadingComponent = () => {
  return (
    <div className="h-dvh flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-600 p-4 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Verifying Document
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we authenticate your internship admission letter...
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Scanning QR Code</span>
                <div className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Validating Document</span>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Retrieving Information</span>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This process typically takes a few seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Server Error Component
export const ServerErrorComponent = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="h-dvh flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 p-4 rounded-full">
                <ServerCrash className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Server Error
            </h1>
            <p className="text-gray-600 mb-6">
              We're experiencing technical difficulties. Please try again in a few moments.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-red-900 text-sm mb-1">
                    Unable to Verify Document
                  </h3>
                  <p className="text-sm text-red-800">
                    Our verification servers are temporarily unavailable. This may be due to:
                  </p>
                  <ul className="text-sm text-red-800 mt-2 space-y-1 ml-4">
                    <li>• Server maintenance</li>
                    <li>• Network connectivity issues</li>
                    <li>• High verification traffic</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleRetry}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                If the problem persists, please contact support
              </p>
              <p className="text-xs text-gray-400">
                Error Code: VER_SERVER_500
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};