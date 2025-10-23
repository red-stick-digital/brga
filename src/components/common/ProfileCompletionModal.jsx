import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * ProfileCompletionModal Component
 * 
 * Modal that appears after login if user's profile is incomplete.
 * Prompts user to complete their profile with required information.
 * 
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback when modal is closed/dismissed
 */
const ProfileCompletionModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleCompleteProfile = () => {
        onClose();
        navigate('/member/profile');
    };

    const handleDismiss = () => {
        onClose();
        navigate('/authhome');
    };

    return (
        <Dialog open={isOpen} onClose={handleDismiss} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <UserCircleIcon className="h-16 w-16 text-blue-500" />
                    </div>

                    {/* Title */}
                    <DialogTitle className="text-2xl font-bold text-center text-gray-900 mb-4">
                        Complete Your Profile
                    </DialogTitle>

                    {/* Description */}
                    <div className="mb-6 text-center">
                        <p className="text-gray-700 mb-3">
                            Welcome! To get the most out of your membership, please complete your profile.
                        </p>
                        <p className="text-sm text-gray-600">
                            We need the following information:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left mx-auto max-w-xs">
                            <li>• First Name</li>
                            <li>• Last Name or Initial</li>
                            <li>• Email</li>
                            <li>• Clean Date</li>
                            <li>• Home Group</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={handleCompleteProfile}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
                        >
                            Complete My Profile
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition-colors"
                        >
                            I'll Do This Later
                        </button>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        This reminder will appear each time you log in until your profile is complete.
                    </p>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ProfileCompletionModal;
