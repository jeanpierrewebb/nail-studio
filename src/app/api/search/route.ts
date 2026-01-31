import { NextRequest, NextResponse } from 'next/server';

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
): Promise<Response> {
  const delays = [500, 1000];
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      // Don't retry auth errors — they won't fix themselves
      if (response.status === 401) return response;

      // Rate limit or server error — worth retrying
      if (response.status === 429 || response.status >= 500) {
        lastResponse = response;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        return response;
      }

      // Other client errors — don't retry
      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
        continue;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error('All retries failed');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const count = searchParams.get('count') || '20';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 },
      );
    }

    const enhancedQuery = `${query} nail art nails manicure`;

    const apiKey = process.env.BRAVE_API_KEY;
    if (!apiKey) {
      console.error('BRAVE_API_KEY not set');
      return NextResponse.json(
        { error: 'Search service not configured. Please set BRAVE_API_KEY.', errorCode: 'NO_API_KEY' },
        { status: 500 },
      );
    }

    const response = await fetchWithRetry(
      `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(enhancedQuery)}&count=${count}&safesearch=strict`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Subscription-Token': apiKey,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brave API error: ${response.status}`, errorText);

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many searches! Please wait a moment and try again.', errorCode: 'RATE_LIMIT' },
          { status: 429 },
        );
      }

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Search API authentication failed. Check your API key.', errorCode: 'AUTH_FAILED' },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: 'Search is temporarily unavailable. Please try again in a minute.', errorCode: 'SERVER_ERROR' },
        { status: 502 },
      );
    }

    const data = await response.json();

    const transformedResults =
      data.results
        ?.map((result: any, index: number) => {
          const thumbnailUrl = result.thumbnail?.src || '';
          const fullUrl = result.properties?.url || '';

          return {
            id: `search-${Date.now()}-${index}`,
            imageUrl: thumbnailUrl || fullUrl,
            fullImageUrl: fullUrl,
            title: result.title || 'Nail Art Inspiration',
            description: '',
            source: result.source || 'Web',
            sourceUrl: result.url || '',
            saved: false,
            width: result.thumbnail?.width || result.properties?.width,
            height: result.thumbnail?.height || result.properties?.height,
          };
        })
        .filter((r: any) => r.imageUrl) || [];

    return NextResponse.json({
      results: transformedResults,
      query: query,
      total: transformedResults.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong with the search. Please try again.', errorCode: 'UNKNOWN' },
      { status: 500 },
    );
  }
}
