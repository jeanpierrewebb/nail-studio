import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const count = searchParams.get('count') || '20';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Add nail art specific terms to improve results
    const enhancedQuery = `${query} nail art nails manicure`;

    // Use BRAVE_API_KEY (set in .env.local)
    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      console.error('BRAVE_API_KEY not set');
      return NextResponse.json(
        { error: 'Search service not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(enhancedQuery)}&count=${count}&safesearch=strict`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brave API error: ${response.status}`, errorText);
      throw new Error(`Brave API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the Brave Image Search response to our format
    // Brave returns: results[].properties.url (full image), results[].thumbnail.src, results[].title, results[].url (page), results[].source
    const transformedResults = data.results?.map((result: any, index: number) => ({
      id: `search-${Date.now()}-${index}`,
      imageUrl: result.properties?.url || result.thumbnail?.src || '',
      title: result.title || 'Nail Art Inspiration',
      description: '',
      source: result.source || 'Web',
      sourceUrl: result.url || '',
      saved: false,
      width: result.properties?.width,
      height: result.properties?.height,
    })).filter((r: any) => r.imageUrl) || [];

    return NextResponse.json({
      results: transformedResults,
      query: query,
      total: transformedResults.length,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search for images' },
      { status: 500 }
    );
  }
}
