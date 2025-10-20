import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentArrowDownIcon, UserPlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const UserMigration = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [csvFile, setCsvFile] = useState(null);
    const [importResults, setImportResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [manualForm, setManualForm] = useState({
        email: '',
        full_name: '',
        phone: '',
        clean_date: '',
        home_group_name: '',
        listed_in_directory: false,
        willing_to_sponsor: false
    });
    const [manualResults, setManualResults] = useState([]);

    // CSV template data for download
    const csvTemplate = `email,full_name,phone,clean_date,home_group_name,listed_in_directory,willing_to_sponsor
john.doe@email.com,John Doe,555-1234,2020-01-15,Monday Night Group,true,false
jane.smith@email.com,Jane Smith,555-5678,2019-06-20,Tuesday Noon Group,false,true`;

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

    const handleManualFormChange = (field, value) => {
        setManualForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addManualUser = async () => {
        if (!manualForm.email || !manualForm.full_name) {
            alert('Email and Full Name are required fields');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch('/api/migrate-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users: [manualForm],
                    migration_type: 'manual'
                })
            });

            const result = await response.json();

            if (result.success) {
                setManualResults(prev => [...prev, {
                    ...manualForm,
                    status: 'success',
                    message: 'User migrated successfully',
                    temp_password: result.temp_password
                }]);

                // Reset form
                setManualForm({
                    email: '',
                    full_name: '',
                    phone: '',
                    clean_date: '',
                    home_group_name: '',
                    listed_in_directory: false,
                    willing_to_sponsor: false
                });
            } else {
                setManualResults(prev => [...prev, {
                    ...manualForm,
                    status: 'error',
                    message: result.error || 'Failed to migrate user'
                }]);
            }
        } catch (error) {
            console.error('Manual migration error:', error);
            setManualResults(prev => [...prev, {
                ...manualForm,
                status: 'error',
                message: 'Network error occurred'
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCSVUpload = async () => {
        if (!csvFile) {
            alert('Please select a CSV file first');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('csv', csvFile);
        formData.append('migration_type', 'bulk');

        try {
            const response = await fetch('/api/migrate-users-bulk', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            setImportResults(result);
        } catch (error) {
            console.error('CSV upload error:', error);
            setImportResults({
                success: false,
                error: 'Network error occurred',
                results: []
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const clearResults = () => {
        setImportResults(null);
        setManualResults([]);
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

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`${activeTab === 'manual'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm`}
                    >
                        Manual Entry
                    </button>
                    <button
                        onClick={() => setActiveTab('bulk')}
                        className={`${activeTab === 'bulk'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm`}
                    >
                        Bulk Import (CSV)
                    </button>
                </nav>
            </div>

            <div className="p-6">
                {/* Manual Entry Tab */}
                {activeTab === 'manual' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Migration Process</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>Each migrated user will:</p>
                                        <ul className="mt-1 list-disc list-inside">
                                            <li>Be created with a temporary password</li>
                                            <li>Receive an email with login instructions</li>
                                            <li>Have "approved" status (full access)</li>
                                            <li>Be assigned to their specified home group</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    value={manualForm.email}
                                    onChange={(e) => handleManualFormChange('email', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="john.doe@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    type="text"
                                    value={manualForm.full_name}
                                    onChange={(e) => handleManualFormChange('full_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    value={manualForm.phone}
                                    onChange={(e) => handleManualFormChange('phone', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="555-1234"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Clean Date</label>
                                <input
                                    type="date"
                                    value={manualForm.clean_date}
                                    onChange={(e) => handleManualFormChange('clean_date', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Home Group Name</label>
                                <input
                                    type="text"
                                    value={manualForm.home_group_name}
                                    onChange={(e) => handleManualFormChange('home_group_name', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Monday Night Group"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={manualForm.listed_in_directory}
                                    onChange={(e) => handleManualFormChange('listed_in_directory', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">List in member directory</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={manualForm.willing_to_sponsor}
                                    onChange={(e) => handleManualFormChange('willing_to_sponsor', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Willing to sponsor</span>
                            </label>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={addManualUser}
                                disabled={isProcessing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium"
                            >
                                {isProcessing ? 'Processing...' : 'Add User'}
                            </button>

                            {manualResults.length > 0 && (
                                <button
                                    onClick={clearResults}
                                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md"
                                >
                                    Clear Results
                                </button>
                            )}
                        </div>

                        {/* Manual Results */}
                        {manualResults.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-3">Migration Results</h4>
                                <div className="space-y-2">
                                    {manualResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg flex items-start ${result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                                                }`}
                                        >
                                            {result.status === 'success' ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="ml-3">
                                                <p className={`text-sm font-medium ${result.status === 'success' ? 'text-green-800' : 'text-red-800'
                                                    }`}>
                                                    {result.email} - {result.full_name}
                                                </p>
                                                <p className={`text-sm ${result.status === 'success' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {result.message}
                                                </p>
                                                {result.temp_password && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Temp password: <code className="bg-green-100 px-1 rounded">{result.temp_password}</code>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bulk Import Tab */}
                {activeTab === 'bulk' && (
                    <div className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">CSV Format Instructions</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Your CSV should include these columns (email and full_name are required):
                            </p>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                <li><strong>email</strong> - User's email address (required)</li>
                                <li><strong>full_name</strong> - Full name (required)</li>
                                <li><strong>phone</strong> - Phone number (optional)</li>
                                <li><strong>clean_date</strong> - Clean date in YYYY-MM-DD format (optional)</li>
                                <li><strong>home_group_name</strong> - Name of their home group (optional)</li>
                                <li><strong>listed_in_directory</strong> - true/false (optional, defaults to false)</li>
                                <li><strong>willing_to_sponsor</strong> - true/false (optional, defaults to false)</li>
                            </ul>
                        </div>

                        {/* Template Download */}
                        <div className="flex justify-center">
                            <button
                                onClick={downloadCSVTemplate}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                Download CSV Template
                            </button>
                        </div>

                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <div className="text-center">
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="csv-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                            Choose CSV file to upload
                                        </span>
                                        <input
                                            id="csv-upload"
                                            type="file"
                                            accept=".csv"
                                            className="sr-only"
                                            onChange={(e) => setCsvFile(e.target.files[0])}
                                        />
                                        <span className="mt-1 block text-xs text-gray-500">
                                            CSV files only
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {csvFile && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-blue-800">Selected file:</p>
                                <p className="text-sm text-blue-600">{csvFile.name}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleCSVUpload}
                                disabled={!csvFile || isProcessing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium"
                            >
                                {isProcessing ? 'Processing...' : 'Import Users'}
                            </button>

                            {importResults && (
                                <button
                                    onClick={clearResults}
                                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md"
                                >
                                    Clear Results
                                </button>
                            )}
                        </div>

                        {/* Import Results */}
                        {importResults && (
                            <div className="mt-6">
                                <div className={`p-4 rounded-lg ${importResults.success ? 'bg-green-50' : 'bg-red-50'
                                    }`}>
                                    <h4 className={`text-md font-medium ${importResults.success ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        Import {importResults.success ? 'Successful' : 'Failed'}
                                    </h4>

                                    {importResults.summary && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p>Successful: {importResults.summary.successful}</p>
                                            <p>Failed: {importResults.summary.failed}</p>
                                            <p>Total: {importResults.summary.total}</p>
                                        </div>
                                    )}

                                    {importResults.error && (
                                        <p className="mt-2 text-sm text-red-600">{importResults.error}</p>
                                    )}
                                </div>

                                {importResults.results && importResults.results.length > 0 && (
                                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                        {importResults.results.map((result, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg flex items-start ${result.success ? 'bg-green-50' : 'bg-red-50'
                                                    }`}
                                            >
                                                {result.success ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                ) : (
                                                    <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                )}
                                                <div className="ml-3">
                                                    <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'
                                                        }`}>
                                                        {result.email} - {result.full_name}
                                                    </p>
                                                    <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {result.message}
                                                    </p>
                                                    {result.temp_password && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Temp password: <code className="bg-green-100 px-1 rounded">{result.temp_password}</code>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMigration;