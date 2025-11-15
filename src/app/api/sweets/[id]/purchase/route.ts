import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { requireAuth } from '@/lib/auth-middleware';
import { eq } from 'drizzle-orm';

// POST /api/sweets/:id/purchase - Purchase a sweet
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const user = requireAuth(request);

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity = 1 } = body;

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Check if sweet exists
    const existingSweet = await db
      .select()
      .from(sweets)
      .where(eq(sweets.id, id))
      .limit(1);

    if (existingSweet.length === 0) {
      return NextResponse.json(
        { error: 'Sweet not found' },
        { status: 404 }
      );
    }

    const sweet = existingSweet[0];

    // Check if enough quantity available
    if (sweet.quantity < quantity) {
      return NextResponse.json(
        { error: `Insufficient quantity. Only ${sweet.quantity} available` },
        { status: 400 }
      );
    }

    // Decrease quantity
    const updatedSweet = await db
      .update(sweets)
      .set({
        quantity: sweet.quantity - quantity,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sweets.id, id))
      .returning();

    return NextResponse.json({
      message: 'Purchase successful',
      sweet: updatedSweet[0],
      purchased: quantity,
      totalCost: (sweet.price * quantity).toFixed(2),
    });
  } catch (error: any) {
    console.error('Purchase sweet error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
