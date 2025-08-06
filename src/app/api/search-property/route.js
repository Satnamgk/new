import { NextResponse } from "next/server";

// src/app/api/search-property/route.js
export async function GET(request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');
    const searchsort = searchParams.get('searchsort') || 'address'; // default to 'address'
    console.log('input:',input, 'searchsort:',searchsort)
    // Validate required parameters
    if (!input) {
      return NextResponse.json(
        { message: 'Missing required "input" parameter' },
        { status: 400 }
      );
    }

    // Make request to PCPAO API
    // Note: The external API still requires POST, so we'll maintain that
    const response = await fetch('https://www.pcpao.gov/dal/quicksearch/searchProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'https://www.pcpao.gov',
        'Referer': 'https://www.pcpao.gov/quick-search'
      },
      body: new URLSearchParams({ input, searchsort })
    });

    if (!response.ok) {
      throw new Error(`PCPAO API responded with status ${response.status}`);
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json(
      { message: 'Error fetching property data', error: error.message },
      { status: 500 }
    );
  }
}
