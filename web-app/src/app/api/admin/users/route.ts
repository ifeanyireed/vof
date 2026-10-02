import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest, hashPassword } from '@/lib/server-auth';
import { AdminRole, AdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function mapAdminRow(row: any): AdminUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as AdminRole,
    avatarUrl: row.avatar_url || '',
    isActive: Boolean(row.is_active),
    lastLogin: row.last_login ? new Date(row.last_login).toISOString() : undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only Super Administrators can view the admin user roster.' },
        { status: 403 }
      );
    }

    const rows = await sql`
      SELECT id, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at
      FROM admin_users
      ORDER BY id ASC;
    `;

    return NextResponse.json(rows.map(mapAdminRow));
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only Super Administrators can create staff accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, password, fullName, role = 'admin', avatarUrl = '' } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const validRoles: AdminRole[] = [
      'super_admin',
      'admin',
      'finance_officer',
      'content_editor',
      'programs_coordinator',
    ];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM admin_users WHERE LOWER(email) = ${cleanEmail};
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An admin account with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const rows = await sql`
      INSERT INTO admin_users (email, password_hash, full_name, role, avatar_url, is_active)
      VALUES (${cleanEmail}, ${hashedPassword}, ${fullName.trim()}, ${role}, ${avatarUrl || ''}, true)
      RETURNING id, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at;
    `;

    return NextResponse.json(mapAdminRow(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only Super Administrators can update staff accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, role, isActive, fullName, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check target user
    const targetRows = await sql`SELECT id, email, role FROM admin_users WHERE id = ${id};`;
    if (targetRows.length === 0) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Prevent deactivating own account
    if (id === authUser.id && isActive === false) {
      return NextResponse.json(
        { error: 'You cannot deactivate your own Super Admin account.' },
        { status: 400 }
      );
    }

    // Prepare updates
    if (newPassword && newPassword.trim().length >= 6) {
      const hashed = hashPassword(newPassword.trim());
      await sql`
        UPDATE admin_users
        SET password_hash = ${hashed}, updated_at = NOW()
        WHERE id = ${id};
      `;
    }

    if (role) {
      await sql`
        UPDATE admin_users
        SET role = ${role}, updated_at = NOW()
        WHERE id = ${id};
      `;
    }

    if (typeof isActive === 'boolean') {
      await sql`
        UPDATE admin_users
        SET is_active = ${isActive}, updated_at = NOW()
        WHERE id = ${id};
      `;
    }

    if (fullName) {
      await sql`
        UPDATE admin_users
        SET full_name = ${fullName.trim()}, updated_at = NOW()
        WHERE id = ${id};
      `;
    }

    const updated = await sql`
      SELECT id, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at
      FROM admin_users
      WHERE id = ${id};
    `;

    return NextResponse.json(mapAdminRow(updated[0]));
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only Super Administrators can delete staff accounts.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    if (id === authUser.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own Super Admin account.' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM admin_users WHERE id = ${id};`;

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
