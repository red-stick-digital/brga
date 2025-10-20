import React, { useState, useEffect } from 'react';
import useApprovals from '../hooks/useApprovals';
import ApprovalCodesList from '../components/Admin/ApprovalCodesList';
import GenerateApprovalCode from '../components/Admin/GenerateApprovalCode';
import PendingMembersList from '../components/Admin/PendingMembersList';
import EmailTestPanel from '../components/Admin/EmailTestPanel';

const AdminDashboard = () => {
    const { fetchMemberStats } = useApprovals();
    const [activeTab, setActiveTab] = useState('codes');
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Load member stats on component mount
    useEffect(() => {
        const loadStats = async () => {
            setStatsLoading(true);
            const result = await fetchMemberStats();
            if (result.success) {
                setStats(result.stats);
            }
            setStatsLoading(false);
        };

        loadStats();
    }, []);

    const tabs = [
        { id: 'codes', label: 'Approval Codes', count: null },
        { id: 'generate', label: 'Generate Codes', count: null },
        { id: 'pending', label: 'Pending Members', count: stats?.pending },
        { id: 'rejected', label: 'Rejected Members', count: stats?.rejected },
        { id: 'email', label: 'Email Testing', count: null },
    ];

    const handleCodesGenerated = () => {
        // Refresh the approval codes list when new codes are generated
        if (activeTab === 'codes') {
            window.location.reload(); // Simple refresh for now
        } else {
            setActiveTab('codes');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Manage approval codes and member approvals
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {statsLoading ? (
                        // Loading skeletons
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="text-sm font-medium text-gray-500">Total Members</div>
                                <div className="text-3xl font-bold text-gray-900">{stats?.total || 0}</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="text-sm font-medium text-gray-500">Pending Approval</div>
                                <div className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="text-sm font-medium text-gray-500">Approved Members</div>
                                <div className="text-3xl font-bold text-green-600">{stats?.approved || 0}</div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="text-sm font-medium text-gray-500">Rejected</div>
                                <div className="text-3xl font-bold text-red-600">{stats?.rejected || 0}</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                                {tab.count !== null && tab.count > 0 && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'codes' && (
                        <ApprovalCodesList />
                    )}

                    {activeTab === 'generate' && (
                        <GenerateApprovalCode onCodesGenerated={handleCodesGenerated} />
                    )}

                    {activeTab === 'pending' && (
                        <PendingMembersList />
                    )}

                    {activeTab === 'rejected' && (
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Rejected Members
                            </h3>
                            <div className="text-center text-gray-500 py-8">
                                Rejected members functionality coming soon...
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <EmailTestPanel />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;