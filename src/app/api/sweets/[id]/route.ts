import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sweets } from '@/db/schema';
import { requireAdmin } from '@/lib/auth-middleware';
import { eq } from 'drizzle-orm';

// PUT /api/sweets/:id - Update a sweet (Admin only)
export async function PUT(
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
    const { name, category, price, quantity, description, imageUrl } = body;

    // Validate input
    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    if (quantity !== undefined && quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
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

    // Update sweet
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updatedSweet = await db
      .update(sweets)
      .set(updateData)
      .where(eq(sweets.id, id))
      .returning();

    return NextResponse.json({
      message: 'Sweet updated successfully',
      sweet: updatedSweet[0],
    });
  } catch (error: any) {
    console.error('Update sweet error:', error);
    
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

// DELETE /api/sweets/:id - Delete a sweet (Admin only)
export async function DELETE(
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

    // Delete sweet
    await db.delete(sweets).where(eq(sweets.id, id));

    return NextResponse.json({
      message: 'Sweet deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete sweet error:', error);
    
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
