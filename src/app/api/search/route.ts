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

    const response = await fetch(
      `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(enhancedQuery)}&count=${count}&safesearch=moderate`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': process.env.BRAVE_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to our format
    const transformedResults = data.results?.map((result: any, index: number) => ({
      id: `search-${Date.now()}-${index}`,
      imageUrl: result.src?.original || result.src?.large || result.src?.medium || result.thumbnail?.src,
      title: result.title || 'Nail Art Inspiration',
      description: result.description || '',
      source: 'Brave Search',
      sourceUrl: result.url || result.page_url || '',
      saved: false,
      width: result.properties?.width,
      height: result.properties?.height,
    })) || [];

    return NextResponse.json({
      results: transformedResults,
      query: query,
      total: data.results?.length || 0,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search for images' },
      { status: 500 }
    );
  }
}