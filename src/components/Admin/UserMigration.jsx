import React from 'react';
import { UserPlusIcon, ExclamationTriangleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const UserMigration = () => {
    // CSV template data for download
    const csvTemplate = `email,first_name,middle_initial,last_name,phone,clean_date,home_group_name,listed_in_directory,willing_to_sponsor
john.doe@email.com,John,,Doe,555-1234,2020-01-15,Monday Night Group,true,false
jane.smith@email.com,Jane,M,Smith,555-5678,2019-06-20,Tuesday Noon Group,false,true`;

    const downloadCSVTemplate = () => {
        const blob = new Blob([csvTemplate], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'user_migration_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserPlusIcon className="h-6 w-6 mr-2 text-blue-600" />
                    User Migration
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Import existing users from your previous site with full member profiles
                </p>
            </div>

            <div className="p-6">
                {/* Admin Notice */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-900">Admin Tool - Run Locally</h3>
                            <div className="mt-2 text-sm text-amber-800">
                                <p>User migration is handled via standalone scripts to optimize deployment performance.</p>
                                <p className="mt-2"><strong>Location:</strong> <code className="bg-amber-100 px-2 py-1 rounded">/scripts/admin-migration/</code></p>
                                <p className="mt-2">To migrate users:</p>
                                <ol className="mt-1 list-decimal list-inside space-y-1">
                                    <li>Run the migration scripts locally from your development environment</li>
                                    <li>Download the CSV template below for bulk imports</li>
                                    <li>Each migrated user will receive a temporary password via email</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CSV Template Download */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2 text-gray-600" />
                        CSV Template
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                        Use this template for bulk user imports. Required columns: <strong>email</strong>, <strong>first_name</strong>, <strong>last_name</strong>
                    </p>
                    <button
                        onClick={downloadCSVTemplate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm"
                    >
                        Download Template
                    </button>
                </div>

                {/* Information Panel */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Migration Script Information</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li><code className="bg-blue-100 px-1">migrate-user.js</code> - Add individual users manually</li>
                        <li><code className="bg-blue-100 px-1">migrate-users-bulk.js</code> - Import multiple users from CSV</li>
                    </ul>
                    <p className="text-xs text-blue-700 mt-3">
                        These scripts require Supabase credentials and the RESEND_API_KEY environment variable to be configured.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserMigration;