"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const SearchProperty = () => {
    const [input, setInput] = useState('3400 100TH');
    const [searchsort, setSearchsort] = useState('address');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const FetchProperties = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`api/search-property`, {
                params: {
                    input: input,
                    searchsort: searchsort
                }
            });
            setData(response.data);
            console.log('Response:', response.data.data);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Error: Failed');
            console.error('error:', err);
        } finally {
            setLoading(false);
        }
    };


  



    // Function to extract text from HTML strings
    const extractText = (html) => {
        if (!html) return '';
        // Create temporary element to parse HTML
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Function to extract href from anchor tags
    const extractLink = (html) => {
        if (!html) return null;
        const match = html.match(/href="([^"]*)"/);
        return match ? match[1] : null;
    };

    return (
        <div className="h-screen mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Fetch property details</h1>

            {/* Search Form */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 ">
                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Query
                </label>
                <div className="mb-4 flex ">

                    <input
                        id="search-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-lg p-2 border border-gray-300 rounded-md"
                        placeholder="Enter address, owner name, or parcel ID"
                    />
                    <button
                        onClick={FetchProperties}
                        disabled={loading}
                        className="bg-blue-600 ms-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                       
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="searchType"
                                value="address"
                                checked={searchsort === 'address'}
                                onChange={() => setSearchsort('address')}
                            />
                            <span className="ml-2">Address</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="searchType"
                                value="owner"
                                checked={searchsort === 'owner'}
                                onChange={() => setSearchsort('owner')}
                            />
                            <span className="ml-2">Owner</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="searchType"
                                value="parcel"
                                checked={searchsort === 'parcel'}
                                onChange={() => setSearchsort('parcel')}
                            />
                            <span className="ml-2">Parcel ID</span>
                        </label>
                    </div>
                </div>


            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Results Table */}
            {data && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">
                            Results ({data.recordsFiltered || 0} found)
                        </h2>
                    </div>

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner/Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcel ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdivision</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Map</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.data.map((row, index) => {
                                        const detailLink = extractLink(row[2]);
                                        const parcelLink = extractLink(row[4]);
                                        const mapLink = extractLink(row[10]);

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {detailLink ? (
                                                        <a href={detailLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                            {extractText(row[2])}
                                                        </a>
                                                    ) : extractText(row[2])}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {parcelLink ? (
                                                        <a href={parcelLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                            {extractText(row[4])}
                                                        </a>
                                                    ) : extractText(row[4])}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{extractText(row[5])}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{extractText(row[6])}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{extractText(row[7])}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{extractText(row[8])}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {mapLink && (
                                                        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                            View Map
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-4 text-gray-500">No properties found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchProperty;