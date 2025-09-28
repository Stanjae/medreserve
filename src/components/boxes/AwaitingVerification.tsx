'use client'
import { IconArrowLeft, IconInfoCircle, IconMail } from "@tabler/icons-react";
import { CheckIcon } from "@mantine/core";
import useLogout from "@/hooks/useLogout";

export default function AwaitingVerification() {
    const { logoutPatient } = useLogout();
  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <IconMail className="w-10 h-10 text-blue-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Account Under Review
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center px-4">
            Your account registration has been submitted successfully. Our admin
            team will review and verify your account shortly. You will receive
            an email notification once your account has been approved and
            activated.
          </p>

          {/* Info Alert */}
          <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <IconInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  What happens next?
                </p>
                <p className="text-xs text-blue-700">
                  Our team typically reviews new accounts within 24-48 hours
                  during business days. You &apos; ll be notified via email once your
                  account status is updated.
                </p>
              </div>
            </div>
          </div>

          {/* Success message for resent email */}
      
            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckIcon className="w-4 h-4 text-green-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Follow-up Request Sent!
                  </p>
                  <p className="text-xs text-green-700">
                    We &apos; ve notified our admin team to prioritize your account
                    review.
                  </p>
                </div>
              </div>
            </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">

            <button
              onClick={logoutPatient}
              className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>

          {/* Additional Help */}
          <p className="text-xs text-gray-500 text-center">
            Have questions about the verification process?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={(e) => {
                e.preventDefault();
                alert("Opening support page...");
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
