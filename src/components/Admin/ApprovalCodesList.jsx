import React, { useState, useEffect } from 'react';
import useApprovalCodes from '../../hooks/useApprovalCodes';

const ApprovalCodesList = () => {
    const { codes, loading, error, fetchCodes, deleteCodes } = useApprovalCodes();
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [selectedCodes, setSelectedCodes] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Load codes on component mount
    useEffect(() => {
        fetchCodes(filters);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSelectCode = (codeId) => {
        setSelectedCodes(prev =>
            prev.includes(codeId)
                ? prev.filter(id => id !== codeId)
                : [...prev, codeId]
        );
    };

    const handleSelectAll = () => {
        const unusedCodes = codes.filter(code => !code.used_by).map(code => code.id);
        setSelectedCodes(selectedCodes.length === unusedCodes.length ? [] : unusedCodes);
    };

    const handleDeleteSelected = async () => {
        if (selectedCodes.length === 0) return;

        const result = await deleteCodes(selectedCodes);
        if (result.success) {
            setSelectedCodes([]);
            setShowDeleteConfirm(false);
            fetchCodes(filters); // Refresh the list
        }
    };

    const getStatusBadge = (code) => {
        const now = new Date();
        const expiresAt = new Date(code.expires_at);

        if (code.used_by) {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Used
                </span>
            );
        } else if (now > expiresAt) {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Expired
                </span>
            );
        } else {
            return (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Available
                </span>
            );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && codes.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-800">Approval Codes</h3>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Codes</option>
                            <option value="unused">Available</option>
                            <option value="used">Used</option>
                            <option value="expired">Expired</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search codes or emails..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCodes.length > 0 && (
                    <div className="mt-4 flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {selectedCodes.length} selected
                        </span>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700">
                    {error}
                </div>
            )}

            {codes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    No approval codes found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <input
                                        type="checkbox"
                                        checked={selectedCodes.length > 0 && selectedCodes.length === codes.filter(code => !code.used_by).length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used By</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {codes.map((code) => (
                                <tr key={code.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {!code.used_by && (
                                            <input
                                                type="checkbox"
                                                checked={selectedCodes.includes(code.id)}
                                                onChange={() => handleSelectCode(code.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-sm">{code.code}</td>
                                    <td className="px-4 py-3">{getStatusBadge(code)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {formatDate(code.created_at)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {formatDate(code.expires_at)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {code.used_by_user?.email || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {code.used_at ? formatDate(code.used_at) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-mx">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete {selectedCodes.length} selected approval code(s)?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalCodesList;