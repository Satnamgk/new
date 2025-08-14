import { NextResponse } from "next/server";
import { parseHTML } from 'linkedom'; // Lightweight DOM parser for Node.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const firstItemArray = responseData.data[0];
    
      const combinedHtml = firstItemArray.join('');
    
      const { document } = parseHTML(combinedHtml);
      const allAnchorTags = document.querySelectorAll('a');
   
      const address = allAnchorTags[0].textContent;
      const url = allAnchorTags[0].href;
      const parcelId = allAnchorTags[1].textContent;
      console.log('first url: ', url, 'parcel Id: ', parcelId)

      const response = await prisma.details.create({
        data: {
          address,
          url,
          parcelId
        }
      });

      return NextResponse.json({ message: 'success!', data: response });

    }

  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}