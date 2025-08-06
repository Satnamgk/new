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

    // Extract first <a> tag links from each array in response.data
    if (responseData.data && Array.isArray(responseData.data)) {
      const firstAnchorLinks = [];

      responseData.data.forEach((itemArray) => {
        if (Array.isArray(itemArray)) {
          // Find the first HTML string containing an <a> tag
          const htmlWithAnchor = itemArray.find((htmlString) => 
            typeof htmlString === 'string' && htmlString.includes('<a')
          );

          if (htmlWithAnchor) {
            const { document } = parseHTML(htmlWithAnchor);
            const firstAnchor = document.querySelector('a');

            if (firstAnchor && firstAnchor.href) {
              firstAnchorLinks.push(firstAnchor.href);
              console.log('Found link:', firstAnchor.href); // Log each link
            }
          }
        }
      });

      console.log('All first <a> tag links:', firstAnchorLinks); // Log all links
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