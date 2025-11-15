import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { requireAdmin } from '@/lib/auth-middleware';
import { eq } from 'drizzle-orm';

// POST /api/sweets/:id/restock - Restock a sweet (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication
    const user = requireAdmin(request);

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
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

    // Increase quantity
    const updatedSweet = await db
      .update(sweets)
      .set({
        quantity: sweet.quantity + parseInt(quantity),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sweets.id, id))
      .returning();

    return NextResponse.json({
      message: 'Restock successful',
      sweet: updatedSweet[0],
      restocked: parseInt(quantity),
    });
  } catch (error: any) {
    console.error('Restock sweet error:', error);
    
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
