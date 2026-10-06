import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { GalleryMediaItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

function mapGalleryRow(row: any): GalleryMediaItem {
  let photos = [];
  if (Array.isArray(row.photos)) {
    photos = row.photos;
  } else if (typeof row.photos === 'string' && row.photos.trim().startsWith('[')) {
    try {
      photos = JSON.parse(row.photos);
    } catch {}
  }

  return {
    id: row.id,
    title: row.title || '',
    category: row.category || 'Vocational Skills',
    mediaUrl: row.media_url || '',
    mediaType: row.media_type || 'image',
    caption: row.caption || '',
    eventDate: row.event_date || '',
    year: Number(row.year) || 2024,
    region: row.region || 'Global',
    location: row.location || '',
    albumTitle: row.album_title || '',
    featured: Boolean(row.featured),
    orderIndex: Number(row.order_index) || 0,
    status: row.status || 'published',
    photos,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

let tableChecked = false;
async function ensureGalleryTable() {
  if (tableChecked) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Vocational Skills',
        media_url TEXT NOT NULL,
        media_type VARCHAR(20) DEFAULT 'image',
        caption TEXT,
        event_date VARCHAR(50),
        year INT DEFAULT 2024,
        region VARCHAR(50) DEFAULT 'Global',
        location VARCHAR(255),
        album_title VARCHAR(255),
        featured BOOLEAN DEFAULT FALSE,
        order_index INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'published',
        photos JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS photos JSONB DEFAULT '[]'::jsonb;`;
    tableChecked = true;
  } catch (err) {
    console.warn('Could not auto-verify gallery_items table:', err);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureGalleryTable();
    const resolvedParams = await Promise.resolve(params);
    const numId = Number(resolvedParams?.id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const rows = await sql`
      SELECT * FROM gallery_items WHERE id = ${numId} LIMIT 1;
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Gallery media not found' }, { status: 404 });
    }
    return NextResponse.json(mapGalleryRow(rows[0]));
  } catch (error: any) {
    console.error('Error retrieving gallery media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureGalleryTable();
    const resolvedParams = await Promise.resolve(params);
    const numId = Number(resolvedParams?.id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const data = await req.json();
    const title = data.title;
    const category = data.category;
    const mediaUrl = data.mediaUrl || (data.photos && data.photos[0]?.url);
    const mediaType = data.mediaType || 'image';
    const caption = data.caption || '';
    const eventDate = data.eventDate || '';
    const year = Number(data.year) || new Date().getFullYear();
    const region = data.region || 'Global';
    const location = data.location || '';
    const albumTitle = data.albumTitle || title;
    const featured = Boolean(data.featured);
    const orderIndex = Number(data.orderIndex) || 0;
    const status = data.status || 'published';
    const photosJson = JSON.stringify(data.photos || []);

    const rows = await sql`
      UPDATE gallery_items SET
        title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        media_url = COALESCE(${mediaUrl}, media_url),
        media_type = ${mediaType},
        caption = ${caption},
        event_date = ${eventDate},
        year = ${year},
        region = ${region},
        location = ${location},
        album_title = ${albumTitle},
        featured = ${featured},
        order_index = ${orderIndex},
        status = ${status},
        photos = ${photosJson}::jsonb,
        updated_at = NOW()
      WHERE id = ${numId}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(mapGalleryRow(rows[0]));
  } catch (error: any) {
    console.error('Error updating gallery media:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureGalleryTable();
    const resolvedParams = await Promise.resolve(params);
    const numId = Number(resolvedParams?.id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // First check if the item has an album_title or title, and delete all associated photos for this album
    const itemRows = await sql`
      SELECT id, album_title, title FROM gallery_items WHERE id = ${numId} LIMIT 1;
    `;

    if (itemRows.length > 0) {
      const albumTitle = itemRows[0].album_title?.trim();
      const title = itemRows[0].title?.trim();
      if (albumTitle) {
        await sql`
          DELETE FROM gallery_items 
          WHERE album_title = ${albumTitle} OR title = ${albumTitle} OR id = ${numId};
        `;
      } else if (title) {
        await sql`
          DELETE FROM gallery_items 
          WHERE album_title = ${title} OR title = ${title} OR id = ${numId};
        `;
      } else {
        await sql`DELETE FROM gallery_items WHERE id = ${numId};`;
      }
    } else {
      await sql`DELETE FROM gallery_items WHERE id = ${numId};`;
    }

    return NextResponse.json({ success: true, message: 'Gallery media deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
