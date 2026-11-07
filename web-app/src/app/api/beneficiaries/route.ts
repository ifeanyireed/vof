import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const INITIAL_SEEDED_BENEFICIARIES = [
  {
    fullName: 'Chiamaka Eze',
    category: 'Primary',
    institution: 'Community Primary School, Mbieri',
    classLevel: 'Primary 4',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Chiamaka is a diligent primary pupil whose basic education, school uniforms, and instructional textbooks are fully sponsored under the Veronica Onyeneke Basic Education Grant. She consistently ranks top of her class in mathematics and reading.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233535/vof/IMG04.jpg',
    location: 'Mbieri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
    sortOrder: 1,
  },
  {
    fullName: 'Uchechukwu Nnamdi',
    category: 'Primary',
    institution: "St. Jude's Model Primary School, Owerri",
    classLevel: 'Primary 5',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Supported with complete academic tuition, textbooks, backpack, and nutritional aid through our Primary Scholars Fund.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233536/vof/IMG02.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Male',
    featured: false,
    sortOrder: 2,
  },
  {
    fullName: 'Favour Kalu',
    category: 'Primary',
    institution: 'Holy Rosary Primary School, Mbieri',
    classLevel: 'Primary 6',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Preparing for Common Entrance Examinations into federal secondary school under full VOF scholarship mentorship.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233535/vof/IMG04.jpg',
    location: 'Mbieri, Imo State, Nigeria',
    gender: 'Female',
    featured: false,
    sortOrder: 3,
  },
  {
    fullName: 'Precious Opara',
    category: 'Secondary',
    institution: "Saint Paul's Secondary School, Owerri",
    classLevel: 'SS 2',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Precious aspires to study software engineering. Her full senior secondary school tuition, computer lab fees, and upcoming WAEC/JAMB exam registrations are completely funded by the Foundation.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233537/vof/IMG06.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
    sortOrder: 4,
  },
  {
    fullName: 'Somtochukwu Amadi',
    category: 'Secondary',
    institution: 'Comprehensive Secondary School, Iho Dimeze',
    classLevel: 'SS 1',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Passionate young scientist and mathematics prodigy supported with full boarding school scholarship, science textbooks, and lab gear.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233536/vof/IMG02.jpg',
    location: 'Iho Dimeze, Imo State, Nigeria',
    gender: 'Male',
    featured: false,
    sortOrder: 5,
  },
  {
    fullName: 'Emeka Emmanuel',
    category: 'Secondary',
    institution: 'Federal Government College, Okigwe',
    classLevel: 'SS 3',
    yearAwarded: '2022',
    awardStatus: 'Active',
    bioStory:
      'Senior secondary scholar preparing for 2025 WAEC and JAMB UTME. VOF covers 100% of exam registration, mock tests, and STEM coaching.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233544/vof/blog/vocational-skills-empowerment.jpg',
    location: 'Okigwe, Imo State, Nigeria',
    gender: 'Male',
    featured: false,
    sortOrder: 6,
  },
  {
    fullName: 'Blessing Okoro',
    category: 'Tertiary',
    institution: 'Federal University of Technology, Owerri (FUTO)',
    classLevel: '300 Level - Mechanical Engineering',
    yearAwarded: '2022',
    awardStatus: 'Active',
    bioStory:
      'Recipient of the Veronica Onyeneke Tertiary Merit Bursary. Blessing maintains a First-Class GPA in Mechanical Engineering, conducting research on clean rural renewable energy solutions.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233539/vof/IMG03.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
    sortOrder: 7,
  },
  {
    fullName: 'Cynthia Chioma Nwosu',
    category: 'Tertiary',
    institution: 'Imo State University (IMSU)',
    classLevel: '200 Level - Medicine & Surgery',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Aspiring pediatrician awarded the VOF Healthcare & Maternal Health Academic Fellowship, covering tuition, medical textbooks, and clinical anatomy kit.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233537/vof/IMG06.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
    sortOrder: 8,
  },
  {
    fullName: 'Ebubechukwu Stanley',
    category: 'Tertiary',
    institution: 'University of Nigeria, Nsukka (UNN)',
    classLevel: '400 Level - Computer Science',
    yearAwarded: '2021',
    awardStatus: 'Active',
    bioStory:
      'Specializing in artificial intelligence and cybersecurity. Recipient of university bursary grant, engineering laptop, and research publication stipend.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233544/vof/blog/vocational-skills-empowerment.jpg',
    location: 'Nsukka, Enugu State / Imo State',
    gender: 'Male',
    featured: false,
    sortOrder: 9,
  },
  {
    fullName: 'Ngozi Juliet Anokwute',
    category: 'Skills',
    institution: 'VOIE Vocational Training Center, Owerri',
    classLevel: 'Fashion Design & Haute Couture',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Trained in industrial garment construction, pattern drafting, and entrepreneurial fashion design at VOIE. Recipient of complete starter sewing machine kit upon graduation.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233536/vof/IMG01.jpg',
    location: 'Owerri North, Imo State',
    gender: 'Female',
    featured: true,
    sortOrder: 10,
  },
  {
    fullName: 'Chukwuebuka Obi',
    category: 'Skills',
    institution: 'VOIE ICT & Innovation Hub, Owerri',
    classLevel: 'Computer Systems, Hardware & ICT',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Completed a 6-month intensive ICT technician and digital literacy curriculum sponsored by VOF. Now runs a registered neighborhood tech repair and printing center.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233544/vof/blog/vocational-skills-empowerment.jpg',
    location: 'Mbieri, Imo State',
    gender: 'Male',
    featured: true,
    sortOrder: 11,
  },
  {
    fullName: 'Chinonso Sandra Madu',
    category: 'Skills',
    institution: 'VOIE Cosmetology & Esthetics Academy',
    classLevel: 'Professional Cosmetology & Hair Artistry',
    yearAwarded: '2024',
    awardStatus: 'Ongoing',
    bioStory:
      'Specializing in professional hair styling, scalp treatments, and beauty therapy under VOF full sponsorship covering course fees, salon practice kits, and startup mentorship.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233535/vof/IMG04.jpg',
    location: 'Imo State, Nigeria',
    gender: 'Female',
    featured: false,
    sortOrder: 12,
  },
  {
    fullName: 'Kelechi Divine Igwe',
    category: 'Skills',
    institution: 'VOIE Clean Tech & Energy Lab',
    classLevel: 'Solar PV Installation & Electrical Wiring',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Trained in renewable solar inverter design, battery storage, and residential microgrid installation under VOF Clean Energy Youth Initiative.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233536/vof/IMG02.jpg',
    location: 'Owerri, Imo State',
    gender: 'Male',
    featured: true,
    sortOrder: 13,
  },
  {
    fullName: 'Maryjane Onyinyechi',
    category: 'Skills',
    institution: 'VOIE Culinary & Baking Arts Institute',
    classLevel: 'Catering, Confectionery & Pastry Arts',
    yearAwarded: '2024',
    awardStatus: 'Ongoing',
    bioStory:
      'Young mother acquiring commercial baking and catering skills, funded with professional bakeware starter kit, food safety certification, and small-batch seed capital.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233539/vof/IMG03.jpg',
    location: 'Mbieri, Imo State',
    gender: 'Female',
    featured: false,
    sortOrder: 14,
  },
];

let isTableInitialized = false;

async function ensureBeneficiariesTable() {
  if (isTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS scholarship_beneficiaries (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        class_level VARCHAR(100) NOT NULL,
        year_awarded VARCHAR(50) NOT NULL,
        award_status VARCHAR(50) NOT NULL DEFAULT 'Active',
        bio_story TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        location VARCHAR(255) DEFAULT 'Imo State, Nigeria',
        gender VARCHAR(50) DEFAULT 'Not specified',
        featured BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const countRes = await sql`SELECT COUNT(*)::int AS count FROM scholarship_beneficiaries;`;
    if (countRes && countRes[0] && countRes[0].count === 0) {
      for (const item of INITIAL_SEEDED_BENEFICIARIES) {
        await sql`
          INSERT INTO scholarship_beneficiaries (
            full_name, category, institution, class_level, year_awarded,
            award_status, bio_story, image_url, location, gender,
            featured, sort_order, created_at, updated_at
          ) VALUES (
            ${item.fullName},
            ${item.category},
            ${item.institution},
            ${item.classLevel},
            ${item.yearAwarded},
            ${item.awardStatus},
            ${item.bioStory},
            ${item.imageUrl},
            ${item.location},
            ${item.gender},
            ${item.featured},
            ${item.sortOrder},
            NOW(),
            NOW()
          );
        `;
      }
    }
    isTableInitialized = true;
  } catch (err) {
    console.warn('ensureBeneficiariesTable notice:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  try {
    await ensureBeneficiariesTable();

    let rows;
    if (category && category !== 'All' && status && status !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE (LOWER(category) = LOWER(${category}) OR (LOWER(${category}) = 'skills' AND LOWER(category) LIKE '%skill%'))
          AND LOWER(award_status) = LOWER(${status})
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else if (category && category !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE (LOWER(category) = LOWER(${category}) OR (LOWER(${category}) = 'skills' AND LOWER(category) LIKE '%skill%'))
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else if (status && status !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE LOWER(award_status) = LOWER(${status})
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    }

    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
  } catch (error: any) {
    console.warn('Database query notice, using structured fallback:', error?.message);
  }

  // Resilient fallback with dynamic in-memory filtering
  let filtered = INITIAL_SEEDED_BENEFICIARIES.map((item, idx) => ({
    id: idx + 1,
    ...item,
  }));

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (b) =>
        b.category.toLowerCase() === category.toLowerCase() ||
        (category.toLowerCase() === 'skills' && b.category.toLowerCase().includes('skill'))
    );
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((b) => b.awardStatus.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    await ensureBeneficiariesTable();
    const b = await req.json();

    if (!b.fullName || !b.category || !b.institution || !b.classLevel || !b.yearAwarded) {
      return NextResponse.json(
        { error: 'Full name, category, institution, class level, and year awarded are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO scholarship_beneficiaries (
        full_name, category, institution, class_level, year_awarded,
        award_status, bio_story, image_url, location, gender,
        featured, sort_order, created_at, updated_at
      ) VALUES (
        ${b.fullName.trim()},
        ${b.category.trim()},
        ${b.institution.trim()},
        ${b.classLevel.trim()},
        ${b.yearAwarded.toString().trim()},
        ${b.awardStatus || 'Active'},
        ${b.bioStory || ''},
        ${b.imageUrl || ''},
        ${b.location || 'Imo State, Nigeria'},
        ${b.gender || 'Not specified'},
        ${b.featured === true || b.featured === 'true'},
        ${typeof b.sortOrder === 'number' ? b.sortOrder : 0},
        NOW(),
        NOW()
      )
      RETURNING id,
        full_name AS "fullName",
        category,
        institution,
        class_level AS "classLevel",
        year_awarded AS "yearAwarded",
        award_status AS "awardStatus",
        COALESCE(bio_story, '') AS "bioStory",
        COALESCE(image_url, '') AS "imageUrl",
        location,
        gender,
        featured,
        sort_order AS "sortOrder",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating scholarship beneficiary:', error);
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
