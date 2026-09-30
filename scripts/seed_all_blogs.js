const https = require('https');
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_LouPIU72xaSO@ep-broad-moon-b5bq0zrt-pooler.c-7.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(DATABASE_URL);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function cleanHtmlText(html) {
  if (!html) return '';
  return html
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseMonth(str) {
  const m = (str || '').toLowerCase();
  if (m.includes('jan')) return { month: 'FEB', full: 'January' }; // keep short
  if (m.includes('feb')) return { month: 'FEB', full: 'February' };
  if (m.includes('mar')) return { month: 'MAR', full: 'March' };
  if (m.includes('apr')) return { month: 'APR', full: 'April' };
  if (m.includes('may')) return { month: 'MAY', full: 'May' };
  if (m.includes('jun')) return { month: 'JUN', full: 'June' };
  if (m.includes('jul')) return { month: 'JUL', full: 'July' };
  if (m.includes('aug')) return { month: 'AUG', full: 'August' };
  if (m.includes('sep')) return { month: 'SEP', full: 'September' };
  if (m.includes('oct')) return { month: 'OCT', full: 'October' };
  if (m.includes('nov')) return { month: 'NOV', full: 'November' };
  if (m.includes('dec')) return { month: 'DEC', full: 'December' };
  return { month: 'OCT', full: 'October' };
}

function generateTags(title, content, category) {
  const text = (title + ' ' + content + ' ' + category).toLowerCase();
  const tags = new Set();

  if (text.includes('outreach') || text.includes('visit') || text.includes('community')) tags.add('Outreach');
  if (text.includes('youth') || text.includes('empower') || text.includes('vocational') || text.includes('competition'))
    tags.add('Youth Empowerment');
  if (text.includes('scholarship') || text.includes('student') || text.includes('jamb') || text.includes('education') || text.includes('school'))
    tags.add('Education');
  if (text.includes('women') || text.includes('mother') || text.includes('maternal') || text.includes('dignity') || text.includes('girl'))
    tags.add('Women Empowerment');
  if (text.includes('food') || text.includes('relief') || text.includes('feeding') || text.includes('displaced') || text.includes('hunger'))
    tags.add('Food Relief');
  if (text.includes('charity') || text.includes('giving') || text.includes('donate') || text.includes('donation') || text.includes('kindness'))
    tags.add('Charity & Giving');
  if (text.includes('nigeria') || text.includes('imo') || text.includes('owerri') || text.includes('abia') || text.includes('mbaitoli') || text.includes('obinze'))
    tags.add('Nigeria');
  if (text.includes('rwanda') || text.includes('kigali')) tags.add('Rwanda');
  if (text.includes('audit') || text.includes('tax') || text.includes('compliance') || text.includes('governance'))
    tags.add('Transparency & Audit');
  if (text.includes('easter')) tags.add('Easter');
  if (text.includes('valentine')) tags.add('Valentines Outreach');
  if (text.includes('competition') || text.includes('contest') || text.includes('online competition'))
    tags.add('Online Competition');
  if (text.includes('church') || text.includes('service') || text.includes('faith') || text.includes('st. francis'))
    tags.add('Community Service');

  if (tags.size === 0) tags.add('Foundation News');
  return Array.from(tags);
}

async function run() {
  console.log('--- 1. Ensuring Categories Exist ---');
  const categoriesToSeed = [
    { name: 'Community Outreach', slug: 'community-outreach', description: 'Direct humanitarian field missions, food distribution, and community support.', color: '#558b1a' },
    { name: 'Education Support', slug: 'education-support', description: 'Academic scholarships, tuition support, and student exam registrations.', color: '#2563eb' },
    { name: 'Women Empowerment', slug: 'women-empowerment', description: 'Maternal health orientation, young pregnant mothers care, and dignity initiatives.', color: '#7c3aed' },
    { name: 'Vocational Skills', slug: 'vocational-skills', description: 'Practical trade apprenticeships, tailoring, catering, and digital training at VOIE Center.', color: '#d97706' },
    { name: 'Transparency & Audit', slug: 'transparency-audit', description: 'Official financial audits, governance disclosures, and foundation compliance reports.', color: '#0891b2' },
    { name: 'Youth Empowerment', slug: 'youth-empowerment', description: 'Youth mentorship, leadership development, and capacity building programs.', color: '#ea580c' },
    { name: 'Charity & Giving', slug: 'charity-giving', description: 'Inspirational messages, philanthropy insights, and donor stewardship reflections.', color: '#e11d48' },
    { name: 'Healthcare & Relief', slug: 'healthcare-relief', description: 'Medical outreach, welfare interventions, and emergency community aid.', color: '#059669' },
    { name: 'Online Competition', slug: 'online-competition', description: 'Youth creative challenges, essay competitions, and talent showcase programs.', color: '#9333ea' },
    { name: 'Startup Business', slug: 'startup-business', description: 'Micro-enterprise starter packs, vocational graduation endowments, and entrepreneurship.', color: '#ca8a04' }
  ];

  for (const cat of categoriesToSeed) {
    await sql`
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.color})
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color;
    `;
  }
  console.log('Categories ready.');

  const catRows = await sql`SELECT id, name, slug FROM blog_categories`;
  const catMap = new Map();
  catRows.forEach((c) => {
    catMap.set(c.name.toLowerCase(), c.id);
    catMap.set(c.slug.toLowerCase(), c.id);
  });

  console.log('--- 2. Ensuring Tags Exist ---');
  const initialTags = [
    'Outreach', 'Youth Empowerment', 'Education', 'Women Empowerment', 'Food Relief',
    'Charity & Giving', 'Nigeria', 'Rwanda', 'Transparency & Audit', 'Easter',
    'Valentines Outreach', 'Online Competition', 'Community Service', 'Foundation News'
  ];
  for (const t of initialTags) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await sql`
      INSERT INTO blog_tags (name, slug)
      VALUES (${t}, ${slug})
      ON CONFLICT (slug) DO NOTHING;
    `;
  }
  console.log('Tags ready.');

  console.log('--- 3. Scraping All Posts from vonf.org (Pages 1-16) ---');
  const allPostLinks = [];
  const seenUrls = new Set();

  for (let page = 1; page <= 16; page++) {
    const pageUrl = page === 1 ? 'https://vonf.org/blog' : `https://vonf.org/blog?page=${page}`;
    const pageHtml = await fetchUrl(pageUrl);
    const regex = /<h4 class="title"><a href="([^"]+)">([^<]+)<\/a><\/h4>/g;
    let match;

    while ((match = regex.exec(pageHtml)) !== null) {
      const link = match[1].trim();
      const rawTitle = match[2].trim();
      if (!seenUrls.has(link)) {
        seenUrls.add(link);
        allPostLinks.push({ page, link, rawTitle });
      }
    }
  }
  console.log(`Found ${allPostLinks.length} unique blog posts to seed.`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < allPostLinks.length; i++) {
    const { link, rawTitle, page } = allPostLinks[i];
    const rawSlug = link.replace(/^https?:\/\/[^\/]+\/blog\//, '').replace(/\/$/, '');

    try {
      const postHtml = await fetchUrl(link);

      // Title
      const titleMatch = postHtml.match(/<h2 class="title">([^<]+)<\/h2>/) || postHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const title = titleMatch
        ? titleMatch[1].trim().replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"')
        : rawTitle.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

      // Image
      const imgMatch = postHtml.match(/<div class="thumb">\s*<img src="([^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1].trim() : 'https://vonf.org/hero.jpeg';

      // Date
      const dateMatch = postHtml.match(/<i class="fas fa-calendar-alt"><\/i>\s*([^<\n]+)/);
      const rawDate = dateMatch ? dateMatch[1].trim() : '15 May 2026';
      const dateParts = rawDate.split(' ');
      const day = dateParts[0] || '15';
      const monthInfo = parseMonth(dateParts[1] || 'May');
      const year = dateParts[2] || '2026';
      const dateDisplay = `${monthInfo.full} ${day}, ${year}`;

      // Author
      const authorMatch = postHtml.match(/<i class="fas fa-user"><\/i>\s*([^<\n]+)/);
      let author = authorMatch ? authorMatch[1].trim() : 'VOF Outreach Team';
      if (author.toLowerCase() === 'admin') author = 'VOF Outreach Team';

      // Category
      const catMatch = postHtml.match(/<a href="https:\/\/vonf\.org\/blog-category\/[^"]+">([^<]+)<\/a>/);
      let category = catMatch ? catMatch[1].trim() : 'Community Outreach';
      if (category === 'Outreach') category = 'Community Outreach';
      if (category === 'online competition') category = 'Online Competition';

      const categoryId = catMap.get(category.toLowerCase()) || catMap.get('community-outreach') || 1;

      // Content
      const contentMatch = postHtml.match(/<div class="content-area mt-4">([\s\S]*?)<\/div>\s*<div class="blog-details-footer">/);
      const content = contentMatch
        ? cleanHtmlText(contentMatch[1])
        : `Official report and community impact update from the Veronica Onyeneke Foundation.\n\nRead more details about our ongoing humanitarian missions, scholarships, and vocational trades on vonf.org.`;

      // Excerpt
      const paras = content.split('\n\n').filter((p) => p.trim().length > 20);
      let excerpt = paras[0] || content.slice(0, 180);
      if (excerpt.length > 220) excerpt = excerpt.slice(0, 217) + '...';

      // Tags
      const tags = generateTags(title, content, category);

      // Register any new tag into blog_tags
      for (const t of tags) {
        const tSlug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await sql`
          INSERT INTO blog_tags (name, slug)
          VALUES (${t}, ${tSlug})
          ON CONFLICT (slug) DO NOTHING;
        `;
      }

      // Read time & Likes
      const words = content.split(/\s+/).length;
      const readTime = `${Math.max(2, Math.ceil(words / 180))} min read`;
      const likes = 2000 + Math.floor(Math.random() * 3200);

      const defaultAvatar = '/team/charles-onyeneke.jpg';
      const defaultRegion = 'NIGERIA';

      await sql`
        INSERT INTO blogs (
          slug, title, excerpt, content, category, category_id, tags,
          region, image_url, author_name, author_avatar, read_time,
          date_display, day, month, likes, status
        ) VALUES (
          ${rawSlug}, ${title}, ${excerpt}, ${content}, ${category}, ${categoryId}, ${tags},
          ${defaultRegion}, ${imageUrl}, ${author}, ${defaultAvatar}, ${readTime},
          ${dateDisplay}, ${day}, ${monthInfo.month}, ${likes}, 'published'
        )
        ON CONFLICT (slug) DO UPDATE
        SET title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            category = EXCLUDED.category,
            category_id = EXCLUDED.category_id,
            tags = EXCLUDED.tags,
            image_url = CASE WHEN blogs.image_url IS NULL OR blogs.image_url = '' THEN EXCLUDED.image_url ELSE blogs.image_url END,
            date_display = EXCLUDED.date_display,
            day = EXCLUDED.day,
            month = EXCLUDED.month,
            updated_at = NOW();
      `;

      insertedCount++;
      console.log(`[${i + 1}/${allPostLinks.length}] Seeded: "${title.slice(0, 45)}..." (slug: ${rawSlug})`);
    } catch (err) {
      console.error(`Error processing post ${rawSlug}:`, err.message);
    }
  }

  console.log('--- 4. Populating blog_post_tags join table ---');
  const allBlogs = await sql`SELECT id, tags FROM blogs`;
  const allTags = await sql`SELECT id, name FROM blog_tags`;
  const tagNameToId = new Map(allTags.map((t) => [t.name.toLowerCase(), t.id]));

  for (const b of allBlogs) {
    if (b.tags && Array.isArray(b.tags)) {
      for (const tName of b.tags) {
        const tId = tagNameToId.get(tName.toLowerCase());
        if (tId) {
          await sql`
            INSERT INTO blog_post_tags (post_id, tag_id)
            VALUES (${b.id}, ${tId})
            ON CONFLICT (post_id, tag_id) DO NOTHING;
          `;
        }
      }
    }
  }

  const finalBlogsCount = await sql`SELECT count(*) FROM blogs`;
  const finalCatCount = await sql`SELECT count(*) FROM blog_categories`;
  const finalTagCount = await sql`SELECT count(*) FROM blog_tags`;

  console.log('\n=========================================');
  console.log('DATABASE SEEDING SUCCESS!');
  console.log(`Total Blogs in Database: ${finalBlogsCount[0].count}`);
  console.log(`Total Blog Categories:   ${finalCatCount[0].count}`);
  console.log(`Total Blog Tags:         ${finalTagCount[0].count}`);
  console.log('=========================================');
}

run().catch((e) => {
  console.error('Fatal execution error:', e);
  process.exit(1);
});
