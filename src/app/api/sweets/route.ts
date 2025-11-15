import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';

// GET /api/sweets - Get all sweets
export async function GET(request: NextRequest) {
  try {
    const allSweets = await db.select().from(sweets);
    
    return NextResponse.json({
      sweets: allSweets,
      count: allSweets.length,
    });
  } catch (error) {
    console.error('Get sweets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/sweets - Add a new sweet (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const user = requireAdmin(request);

    const body = await request.json();
    const { name, category, price, quantity, description, imageUrl } = body;

    // Validate input
    if (!name || !category || price === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: 'Name, category, price, and quantity are required' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Create sweet
    const newSweet = await db
      .insert(sweets)
      .values({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description: description || null,
        imageUrl: imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Sweet created successfully',
        sweet: newSweet[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create sweet error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
