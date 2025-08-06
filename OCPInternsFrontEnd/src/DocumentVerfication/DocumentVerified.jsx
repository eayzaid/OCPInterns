import { Shield, Calendar, User, FileText, CheckCircle, Clock } from 'lucide-react';

export default function DocumentVerified({ application }) {
  // Sample data clearly marked for replacement
  const verificationData = {
    documentIssueDate: new Date(application.createdAt).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }), 
    internshipStartDate: new Date(application.startDate).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }), 
    internshipEndDate: new Date(application.endDate).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }), 
    applicationId: application.applicationId, 
    internFullName: application.fullName, 
    verificationTimestamp: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6 border-t-4 border-blue-600">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Internship Admission Letter Verification
            </h1>
            <div className="flex items-center justify-center mt-2">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">Official Verification</span>
            </div>
          </div>
        </div>

        {/* Verification Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Document Issue Date */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block">Document Issue Date</label>
                <p className="text-lg font-semibold text-gray-900">{verificationData.documentIssueDate}</p>
              </div>
            </div>

            {/* Internship Start Date */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block">Internship Start Date</label>
                <p className="text-lg font-semibold text-gray-900">{verificationData.internshipStartDate}</p>
              </div>
            </div>

            {/* Internship End Date */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block">Internship End Date</label>
                <p className="text-lg font-semibold text-gray-900">{verificationData.internshipEndDate}</p>
              </div>
            </div>

            {/* Application ID */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block">Application ID</label>
                <p className="text-lg font-semibold text-gray-900 font-mono">{verificationData.applicationId}</p>
              </div>
            </div>

            {/* Intern Full Name */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block">Intern Full Name</label>
                <p className="text-lg font-semibold text-gray-900">{verificationData.internFullName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">Verified Document</span>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>Verified: {verificationData.verificationTimestamp}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              This verification page confirms the authenticity of the internship admission letter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

