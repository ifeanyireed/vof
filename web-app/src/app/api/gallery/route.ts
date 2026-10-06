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

export async function GET(req: NextRequest) {
  try {
    await ensureGalleryTable();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const region = searchParams.get('region');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const albumTitle = searchParams.get('albumTitle');

    const rows = await sql`
      SELECT id, title, category, media_url, COALESCE(media_type, 'image') AS media_type,
             COALESCE(caption, '') AS caption, COALESCE(event_date, '') AS event_date,
             COALESCE(year, 2024) AS year, COALESCE(region, 'Global') AS region,
             COALESCE(location, '') AS location, COALESCE(album_title, '') AS album_title,
             COALESCE(featured, FALSE) AS featured, COALESCE(order_index, 0) AS order_index,
             COALESCE(status, 'published') AS status,
             COALESCE(photos, '[]'::jsonb) AS photos, created_at, updated_at
      FROM gallery_items
      ORDER BY id DESC;
    `;

    let filtered = rows.map(mapGalleryRow);

    if (category && category !== 'All') {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (year && year !== 'All') {
      filtered = filtered.filter((item) => item.year.toString() === year);
    }
    if (region && region !== 'All' && region !== 'Global') {
      filtered = filtered.filter((item) => item.region === region || item.region === 'Global');
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((item) => item.status === status);
    }
    if (albumTitle) {
      filtered = filtered.filter(
        (item) =>
          (item.albumTitle && item.albumTitle.toLowerCase() === albumTitle.toLowerCase()) ||
          item.title.toLowerCase() === albumTitle.toLowerCase()
      );
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          (item.caption && item.caption.toLowerCase().includes(s)) ||
          (item.albumTitle && item.albumTitle.toLowerCase().includes(s)) ||
          (item.location && item.location.toLowerCase().includes(s))
      );
    }

    return NextResponse.json(filtered);
  } catch (error: any) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureGalleryTable();
    const data = await req.json();

    const title = data.title || 'Untitled Album';
    const category = data.category || 'Vocational Skills';
    const mediaUrl = data.mediaUrl || (data.photos && data.photos[0]?.url) || '';
    const mediaType = data.mediaType || 'image';
    const caption = data.caption || '';
    const eventDate = data.eventDate || new Date().toISOString().split('T')[0];
    const year = Number(data.year) || new Date().getFullYear();
    const region = data.region || 'Global';
    const location = data.location || '';
    const albumTitle = data.albumTitle || title;
    const featured = Boolean(data.featured);
    const orderIndex = Number(data.orderIndex) || 0;
    const status = data.status || 'published';
    const photosJson = JSON.stringify(data.photos || []);

    const rows = await sql`
      INSERT INTO gallery_items (
        title, category, media_url, media_type, caption, event_date,
        year, region, location, album_title, featured, order_index,
        status, photos, created_at, updated_at
      ) VALUES (
        ${title}, ${category}, ${mediaUrl}, ${mediaType}, ${caption}, ${eventDate},
        ${year}, ${region}, ${location}, ${albumTitle}, ${featured}, ${orderIndex},
        ${status}, ${photosJson}::jsonb, NOW(), NOW()
      )
      RETURNING *;
    `;

    return NextResponse.json(mapGalleryRow(rows[0]));
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureGalleryTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const albumTitle = searchParams.get('albumTitle');

    if (id) {
      const numId = Number(id);
      const itemRows = await sql`
        SELECT id, album_title, title FROM gallery_items WHERE id = ${numId} LIMIT 1;
      `;
      if (itemRows.length > 0) {
        const itemAlbum = itemRows[0].album_title?.trim() || itemRows[0].title?.trim();
        if (itemAlbum) {
          await sql`
            DELETE FROM gallery_items 
            WHERE album_title = ${itemAlbum} OR title = ${itemAlbum} OR id = ${numId};
          `;
        } else {
          await sql`DELETE FROM gallery_items WHERE id = ${numId};`;
        }
      } else {
        await sql`DELETE FROM gallery_items WHERE id = ${numId};`;
      }
      return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
    }

    if (albumTitle) {
      await sql`
        DELETE FROM gallery_items 
        WHERE album_title = ${albumTitle} OR title = ${albumTitle};
      `;
      return NextResponse.json({ success: true, message: `Album "${albumTitle}" deleted successfully` });
    }

    return NextResponse.json({ error: 'Missing id or albumTitle parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
