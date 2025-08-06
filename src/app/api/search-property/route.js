import { NextResponse } from "next/server";
import { parseHTML } from 'linkedom'; // Lightweight DOM parser for Node.js

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');
    const searchsort = searchParams.get('searchsort') || 'address';

    if (!input) {
      return NextResponse.json(
        { message: 'Missing required "input" parameter' },
        { status: 400 }
      );
    }

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

    if (responseData.data && Array.isArray(responseData.data)) {
  const firstAnchorLinks = [];
  
  // 1. Get the first array of HTML strings
  const firstItemArray = responseData.data[0]; // ← No nested `.data` here
  
  // 2. Find the first HTML string containing an `<a>` tag
  const htmlWithAnchor = firstItemArray.find((htmlString) => 
    typeof htmlString === 'string' && htmlString.includes('<a')
  );
  
  // 3. Parse the HTML and extract the link
  if (htmlWithAnchor) {
    const { document } = parseHTML(htmlWithAnchor);
    const firstAnchor = document.querySelector('a');
    
    if (firstAnchor && firstAnchor.href) {
      firstAnchorLinks.push(firstAnchor.href);
      console.log('First link:', firstAnchor.href);
    }
  }
}

    // Return the original response (unchanged)
    return NextResponse.json(responseData);

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}