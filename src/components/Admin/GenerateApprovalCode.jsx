import React, { useState } from 'react';
import useApprovalCodes from '../../hooks/useApprovalCodes';

const GenerateApprovalCode = ({ onCodesGenerated }) => {
    const { generateCodes, loading, error } = useApprovalCodes();
    const [count, setCount] = useState(1);
    const [expirationDays, setExpirationDays] = useState(30);
    const [generatedCodes, setGeneratedCodes] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async () => {
        const result = await generateCodes(count, expirationDays);

        if (result.success) {
            setGeneratedCodes(result.codes);
            setShowResults(true);
            // Notify parent component that new codes were generated
            if (onCodesGenerated) {
                onCodesGenerated(result.codes);
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Could add a toast notification here
        });
    };

    const copyAllCodes = () => {
        const codeList = generatedCodes.map(code => code.code).join('\n');
        copyToClipboard(codeList);
    };

    const downloadCodes = () => {
        const codeList = generatedCodes.map(code =>
            `${code.code} (Expires: ${new Date(code.expires_at).toLocaleDateString()})`
        ).join('\n');

        const blob = new Blob([codeList], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `approval-codes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const resetForm = () => {
        setShowResults(false);
        setGeneratedCodes([]);
        setCount(1);
        setExpirationDays(30);
    };

    if (showResults) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-green-600">
                        Successfully Generated {generatedCodes.length} Code(s)
                    </h3>
                    <button
                        onClick={resetForm}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Generate More
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={copyAllCodes}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                            Copy All Codes
                        </button>
                        <button
                            onClick={downloadCodes}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                            Download List
                        </button>
                    </div>

                    {/* Generated Codes List */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-3">Generated Codes:</h4>
                        <div className="space-y-2">
                            {generatedCodes.map((code, index) => (
                                <div key={code.id} className="flex justify-between items-center bg-white p-3 rounded border">
                                    <div>
                                        <div className="font-mono text-lg text-blue-600">{code.code}</div>
                                        <div className="text-sm text-gray-500">
                                            Expires: {new Date(code.expires_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(code.code)}
                                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        Copy
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Usage Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Distribution Instructions:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Share these codes with prospective members</li>
                            <li>• Each code can only be used once</li>
                            <li>• Codes expire in {expirationDays} days</li>
                            <li>• Members enter the code during signup</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Generate Approval Codes</h3>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Number of Codes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Codes to Generate
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                    />
                    <p className="text-sm text-gray-500 mt-1">Maximum: 50 codes per batch</p>
                </div>

                {/* Expiration Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration (Days)
                    </label>
                    <select
                        value={expirationDays}
                        onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days (default)</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                        Codes will expire on {new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                </div>

                {/* Generate Button */}
                <div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Generating...' : `Generate ${count} Code${count !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">How Approval Codes Work:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Three-word format (e.g., "apple-banana-cherry")</li>
                    <li>• Each code can only be used once</li>
                    <li>• New members enter the code during signup</li>
                    <li>• Used codes automatically link to the member's account</li>
                    <li>• Expired codes cannot be used for signup</li>
                </ul>
            </div>
        </div>
    );
};

export default GenerateApprovalCode;