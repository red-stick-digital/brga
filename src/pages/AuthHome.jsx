import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useDirectory from '../hooks/useDirectory';
import DirectoryFilters from '../components/Directory/DirectoryFilters';
import DirectoryMemberCard from '../components/Directory/DirectoryMemberCard';

const AuthHome = () => {
    const { user } = useAuth();
    const {
        loading,
        error,
        members,
        homeGroups,
        searchQuery,
        setSearchQuery,
        selectedHomeGroup,
        setSelectedHomeGroup,
        showSponsorsOnly,
        setShowSponsorsOnly,
        sortBy,
        setSortBy,
        clearFilters,
        calculateSobriety,
        fetchDirectoryMembers
    } = useDirectory();

    // Refresh data on mount
    useEffect(() => {
        fetchDirectoryMembers();
    }, []);

    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 mb-4">
                <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M17 10a3 3 0 11-6 0 3 3 0 016 0zm-3-7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Found</h3>
            <p className="text-gray-500 mb-4">
                {searchQuery || selectedHomeGroup || showSponsorsOnly
                    ? "No members match your current filters. Try adjusting your search criteria."
                    : "No members have opted to be listed in the directory yet."
                }
            </p>
            {(searchQuery || selectedHomeGroup || showSponsorsOnly) && (
                <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );

    const LoadingState = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white shadow-md rounded-lg p-6 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.email}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        You're now logged in to the Baton Rouge GA member area.
                        Connect with fellow members in our recovery community.
                    </p>
                </div>

                {/* Member Directory Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Directory</h2>
                    <p className="text-gray-600 mb-6">
                        Connect with fellow members in the Baton Rouge area recovery community.
                        Contact members for sponsorship and support.
                    </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-blue-800">Privacy Notice</h3>
                            <div className="mt-1 text-sm text-blue-700">
                                <p>
                                    Only members who have chosen to be listed in the directory appear here.
                                    Contact information is not shared for privacy and safety reasons.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error Loading Directory</h3>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                                <button
                                    onClick={fetchDirectoryMembers}
                                    className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <DirectoryFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedHomeGroup={selectedHomeGroup}
                    setSelectedHomeGroup={setSelectedHomeGroup}
                    showSponsorsOnly={showSponsorsOnly}
                    setShowSponsorsOnly={setShowSponsorsOnly}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    homeGroups={homeGroups}
                    clearFilters={clearFilters}
                    memberCount={members.length}
                />

                {/* Member Cards */}
                {loading ? (
                    <LoadingState />
                ) : members.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member) => (
                            <DirectoryMemberCard
                                key={member.user_id}
                                member={member}
                                calculateSobriety={calculateSobriety}
                            />
                        ))}
                    </div>
                )}

                {/* Results Summary */}
                {!loading && members.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Showing {members.length} member{members.length !== 1 ? 's' : ''}
                        {(searchQuery || selectedHomeGroup || showSponsorsOnly) && ' matching your filters'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthHome;