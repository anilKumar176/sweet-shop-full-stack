import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { and, or, like, gte, lte, sql } from 'drizzle-orm';

// GET /api/sweets/search - Search for sweets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const conditions = [];

    if (name) {
      conditions.push(like(sweets.name, `%${name}%`));
    }

    if (category) {
      conditions.push(like(sweets.category, `%${category}%`));
    }

    if (minPrice) {
      conditions.push(gte(sweets.price, parseFloat(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(sweets.price, parseFloat(maxPrice)));
    }

    let results;
    
    if (conditions.length > 0) {
      results = await db
        .select()
        .from(sweets)
        .where(and(...conditions));
    } else {
      results = await db.select().from(sweets);
    }

    return NextResponse.json({
      sweets: results,
      count: results.length,
      filters: {
        name,
        category,
        minPrice,
        maxPrice,
      },
    });
  } catch (error) {
    console.error('Search sweets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
