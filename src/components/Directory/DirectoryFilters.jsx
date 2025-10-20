import React from 'react';

const DirectoryFilters = ({
    searchQuery,
    setSearchQuery,
    selectedHomeGroup,
    setSelectedHomeGroup,
    showSponsorsOnly,
    setShowSponsorsOnly,
    sortBy,
    setSortBy,
    homeGroups,
    clearFilters,
    memberCount
}) => {
    const sortOptions = [
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'clean_date', label: 'Longest Sober' },
        { value: 'joined_date', label: 'Newest Members' }
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:mb-0">
                    Member Directory
                    {memberCount !== undefined && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                            ({memberCount} member{memberCount !== 1 ? 's' : ''})
                        </span>
                    )}
                </h3>

                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    Clear All Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Members
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by name or group..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Home Group Filter */}
                <div>
                    <label htmlFor="homeGroup" className="block text-sm font-medium text-gray-700 mb-1">
                        Home Group
                    </label>
                    <select
                        id="homeGroup"
                        value={selectedHomeGroup}
                        onChange={(e) => setSelectedHomeGroup(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Groups</option>
                        {homeGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Options */}
                <div>
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sponsor Filter */}
                <div className="flex flex-col justify-end">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filters
                    </label>
                    <div className="flex items-center h-10">
                        <input
                            type="checkbox"
                            id="sponsorsOnly"
                            checked={showSponsorsOnly}
                            onChange={(e) => setShowSponsorsOnly(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sponsorsOnly" className="ml-2 text-sm text-gray-700">
                            Available sponsors only
                        </label>
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedHomeGroup || showSponsorsOnly) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Active filters:</span>

                        {searchQuery && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Search: "{searchQuery}"
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {selectedHomeGroup && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Group: {homeGroups.find(g => g.id === parseInt(selectedHomeGroup))?.name}
                                <button
                                    onClick={() => setSelectedHomeGroup('')}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {showSponsorsOnly && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Sponsors only
                                <button
                                    onClick={() => setShowSponsorsOnly(false)}
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectoryFilters;