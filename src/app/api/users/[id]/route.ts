import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/jwt';

const VALID_ROLES = ['super_admin', 'admin', 'user'];

async function authenticateSuperAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return { error: 'Authorization header is required', status: 401 };
    }

    if (!authHeader.startsWith('Bearer ')) {
      return { error: 'Invalid authorization format. Use Bearer token', status: 401 };
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return { error: 'Token is required', status: 401 };
    }

    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return { error: 'Invalid token', status: 401 };
    }

    if (decoded.role !== 'super_admin') {
      return { error: 'Access denied. Super admin role required', status: 403 };
    }

    return { user: decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token', status: 401 };
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateSuperAdmin(request);
    
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error, code: 'AUTH_ERROR' },
        { status: auth.status }
      );
    }

    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid user ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required', code: 'MISSING_ROLE' },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { 
          error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 
          code: 'INVALID_ROLE' 
        },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updatedUser = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    const { password, ...userWithoutPassword } = updatedUser[0];

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateSuperAdmin(request);
    
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error, code: 'AUTH_ERROR' },
        { status: auth.status }
      );
    }

    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid user ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userId = parseInt(id);
    const authenticatedUserId = auth.user.userId;

    if (userId === authenticatedUserId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account', code: 'CANNOT_DELETE_SELF' },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deletedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete user', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    const { password, ...deletedUserWithoutPassword } = deletedUser[0];

    return NextResponse.json(
      { 
        message: 'User deleted successfully',
        user: deletedUserWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}